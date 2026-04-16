import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const API = 'http://localhost:8000/api';

function condBadge(c) {
  const map = { Good:'b-good', Fair:'b-fair', 'Under Repair':'b-repair', 'Out of Service':'b-out' };
  return map[c] || 'b-out';
}

function bookBadge(s) {
  const map = { Pending:'b-pending', Approved:'b-approved', Rejected:'b-rejected', Ongoing:'b-ongoing', Returned:'b-returned' };
  return map[s] || '';
}

const NAV = [
  { key:'overview',  icon:'📊', label:'Overview'  },
  { key:'vehicles',  icon:'🚗', label:'Vehicles'  },
  { key:'users',     icon:'👥', label:'Users'     },
  { key:'bookings',  icon:'📅', label:'Bookings'  },
  { key:'fleets',    icon:'🗂️', label:'Fleets'    },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg:'', type:'' });
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [adminUser, setAdminUser] = useState({});
  const [stats, setStats] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [fleets, setFleets] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [modal, setModal] = useState('');
  const [sel, setSel] = useState(null);

  const [vForm, setVForm] = useState({ name:'', plate_number:'', model:'', year:'', condition:'Good', fleet_id:'' });
  const [uForm, setUForm] = useState({ username:'', email:'', password:'', is_staff:false, profile:{ employee_id:'', department:'', phone:'' } });

  const showToast = (msg, type='ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:'', type:'' }), 3000);
  };

  const headers = useCallback(() => {
    const token = localStorage.getItem('adminToken');
    return { Authorization: `Bearer ${token}`, 'Content-Type':'application/json' };
  }, []);

  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    const isAdmin = localStorage.getItem('isAdmin');
    if (!token || isAdmin !== 'true') { 
      navigate('/admin-login'); 
      return; 
    }

    try {
      const h = headers();
      const [rD, rV, rU, rF, rB] = await Promise.all([
        fetch(`${API}/admin/dashboard/`, { headers: h }),
        fetch(`${API}/admin/vehicles/`,  { headers: h }),
        fetch(`${API}/admin/users/`,     { headers: h }),
        fetch(`${API}/admin/fleets/`,    { headers: h }),
        fetch(`${API}/admin/bookings/`,  { headers: h }),
      ]);

      if (!rD.ok || !rV.ok || !rU.ok || !rF.ok || !rB.ok) {
        throw new Error('One or more API calls failed');
      }

      const [d, v, u, f, b] = await Promise.all([
        rD.json(), rV.json(), rU.json(), rF.json(), rB.json()
      ]);
      
      setAdminUser(d.admin || {});
      setStats(d.stats || {});
      setVehicles(v || []);
      setUsers(u || []);
      setFleets(f || []);
      setBookings(b || []);
    } catch(e) {
      console.error('Error fetching data:', e);
      showToast('Failed to load data. Is the server running?', 'err');
    } finally { 
      setLoading(false); 
    }
  }, [navigate, headers]);

  useEffect(() => { 
    fetchAll(); 
  }, [fetchAll]);

  const closeModal = () => { 
    setModal(''); 
    setSel(null); 
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    navigate('/admin-login');
  };

  const openAddVehicle = () => {
    setVForm({ name:'', plate_number:'', model:'', year:'', condition:'Good', fleet_id:'' });
    setModal('addVehicle');
  };

  const openEditVehicle = (v) => {
    setVForm({ name:v.name, plate_number:v.plate_number, model:v.model||'', year:v.year||'', condition:v.condition||'Good', fleet_id:v.fleet_id||'' });
    setSel(v); 
    setModal('editVehicle');
  };

  const saveVehicle = async () => {
    const isEdit = modal === 'editVehicle';
    const url = isEdit ? `${API}/admin/vehicles/${sel.id}/` : `${API}/admin/vehicles/`;
    const method = isEdit ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(vForm) });
      if (!res.ok) { 
        const e = await res.json(); 
        throw new Error(JSON.stringify(e)); 
      }
      showToast(isEdit ? 'Vehicle updated!' : 'Vehicle added!');
      closeModal(); 
      fetchAll();
    } catch(e) { 
      showToast('Error: ' + e.message, 'err'); 
    }
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      const res = await fetch(`${API}/admin/vehicles/${id}/`, { method:'DELETE', headers: headers() });
      if (!res.ok) throw new Error('Failed to delete');
      showToast('Vehicle deleted.');
      fetchAll();
    } catch(e) { 
      showToast('Error: ' + e.message, 'err'); 
    }
  };

  const openAddUser = () => {
    setUForm({ username:'', email:'', password:'', is_staff:false, profile:{ employee_id:'', department:'', phone:'' } });
    setModal('addUser');
  };

  const openEditUser = (u) => {
    setUForm({
      username:u.username, 
      email:u.email, 
      password:'', 
      is_staff:u.is_staff||false,
      profile:{ 
        employee_id:u.profile?.employee_id||'', 
        department:u.profile?.department||'', 
        phone:u.profile?.phone||'' 
      }
    });
    setSel(u); 
    setModal('editUser');
  };

  const saveUser = async () => {
    if (!uForm.username || !uForm.email) {
      showToast('Username and Email are required', 'err');
      return;
    }
    const isEdit = modal === 'editUser';
    const url = isEdit ? `${API}/admin/users/${sel.id}/` : `${API}/admin/users/`;
    const method = isEdit ? 'PUT' : 'POST';
    const body = { ...uForm };
    if (isEdit && !body.password) delete body.password;
    try {
      const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(body) });
      if (!res.ok) { 
        const e = await res.json(); 
        throw new Error(JSON.stringify(e)); 
      }
      showToast(isEdit ? 'User updated!' : 'User added!');
      closeModal(); 
      fetchAll();
    } catch(e) { 
      showToast('Error: ' + e.message, 'err'); 
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const res = await fetch(`${API}/admin/users/${id}/`, { method:'DELETE', headers: headers() });
      if (!res.ok) throw new Error('Failed to delete');
      showToast('User deleted.');
      fetchAll();
    } catch(e) { 
      showToast('Error: ' + e.message, 'err'); 
    }
  };

  const bookingAction = async (id, newStatus, notes='') => {
    try {
      const res = await fetch(`${API}/admin/bookings/${id}/action/`, {
        method:'PUT', 
        headers: headers(),
        body: JSON.stringify({ status:newStatus, admin_notes:notes })
      });
      if (!res.ok) { 
        const e = await res.json(); 
        throw new Error(e.error || 'Failed'); 
      }
      showToast(`Booking marked as ${newStatus}!`);
      fetchAll();
    } catch(e) { 
      showToast('Error: ' + e.message, 'err'); 
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner">Loading…</div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-logo">Fleet<span>Dispatch</span></div>
        {NAV.map(n => (
          <div 
            key={n.key} 
            className={`admin-nav ${tab===n.key?'active':''}`} 
            onClick={()=>setTab(n.key)}
          >
            <span className="admin-icon">{n.icon}</span>
            <span>{n.label}</span>
            {n.key==='bookings' && stats.pendingBookings > 0 &&
              <span className="admin-badge-notif">{stats.pendingBookings}</span>
            }
          </div>
        ))}
        <div className="admin-footer">FleetDispatch v2.0</div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h1>{NAV.find(n=>n.key===tab)?.label}</h1>
          <div className="admin-user-menu">
            <button 
              className="admin-user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="admin-avatar">{(adminUser.username||'A')[0].toUpperCase()}</span>
              <span>{adminUser.username||'Admin'}</span>
            </button>
            {showUserMenu && (
              <div className="admin-dropdown">
                <button className="admin-dropdown-item" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {toast.msg && (
          <div className={`admin-toast ${toast.type==='err'?'error':'success'}`}>
            {toast.msg}
          </div>
        )}

        {tab==='overview' && (
          <div className="admin-stats-grid">
            {[
              {icon:'🚗', label:'Vehicles', value:stats.totalVehicles||0},
              {icon:'👥', label:'Users', value:stats.totalUsers||0},
              {icon:'🗂️', label:'Fleets', value:stats.totalFleets||0},
              {icon:'📅', label:'Pending', value:stats.pendingBookings||0},
            ].map(s=>(
              <div className="admin-stat-card" key={s.label}>
                <div className="admin-stat-icon">{s.icon}</div>
                <div className="admin-stat-info">
                  <p>{s.label}</p>
                  <h2>{s.value}</h2>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='vehicles' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Vehicles <span className="admin-count">{vehicles.length}</span></h3>
              <button className="admin-btn admin-btn-primary" onClick={openAddVehicle}>
                + Add Vehicle
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Plate</th>
                  <th>Model/Year</th>
                  <th>Condition</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length===0 && (
                  <tr><td colSpan={7} className="admin-empty">No vehicles yet.</td></tr>
                )}
                {vehicles.map(v=>(
                  <tr key={v.id}>
                    <td className="admin-muted">#{v.id}</td>
                    <td className="admin-bold">{v.name}</td>
                    <td><code className="admin-code">{v.plate_number}</code></td>
                    <td className="admin-muted">{v.model} {v.year}</td>
                    <td><span className={`admin-badge ${condBadge(v.condition)}`}>{v.condition}</span></td>
                    <td><span className={`admin-badge ${v.is_available?'b-approved':'b-rejected'}`}>{v.is_available?'Yes':'No'}</span></td>
                    <td className="admin-actions">
                      <button className="admin-btn admin-btn-primary" onClick={()=>openEditVehicle(v)}>Edit</button>
                      <button className="admin-btn admin-btn-danger" onClick={()=>deleteVehicle(v.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab==='users' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Users <span className="admin-count">{users.length}</span></h3>
              <button className="admin-btn admin-btn-primary" onClick={openAddUser}>
                + Add User
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Emp. ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length===0 && (
                  <tr><td colSpan={6} className="admin-empty">No users yet.</td></tr>
                )}
                {users.map(u=>(
                  <tr key={u.id}>
                    <td><code className="admin-code">{u.profile?.employee_id||'—'}</code></td>
                    <td className="admin-bold">{u.username}</td>
                    <td className="admin-muted">{u.email}</td>
                    <td className="admin-muted">{u.profile?.department||'—'}</td>
                    <td><span className={`admin-badge ${u.is_staff?'b-approved':'b-ongoing'}`}>{u.is_staff?'Admin':'User'}</span></td>
                    <td className="admin-actions">
                      <button className="admin-btn admin-btn-primary" onClick={()=>openEditUser(u)}>Edit</button>
                      <button className="admin-btn admin-btn-danger" onClick={()=>deleteUser(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab==='bookings' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Bookings <span className="admin-count">{bookings.filter(b=>b.status==='Pending').length} pending</span></h3>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Vehicle</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length===0 && (
                  <tr><td colSpan={7} className="admin-empty">No bookings yet.</td></tr>
                )}
                {bookings.map(b=>(
                  <tr key={b.id}>
                    <td className="admin-muted">#{b.id}</td>
                    <td>
                      <div className="admin-bold">{b.user?.username}</div>
                      <div className="admin-muted-sm">{b.user?.profile?.employee_id||'No EMP ID'}</div>
                    </td>
                    <td>
                      <div className="admin-bold">{b.vehicle?.name}</div>
                      <div className="admin-muted-sm">{b.vehicle?.plate_number}</div>
                    </td>
                    <td className="admin-muted-sm">{new Date(b.start_datetime).toLocaleString()}</td>
                    <td className="admin-muted-sm">{new Date(b.end_datetime).toLocaleString()}</td>
                    <td><span className={`admin-badge ${bookBadge(b.status)}`}>{b.status}</span></td>
                    <td className="admin-actions">
                      {b.status==='Pending'  && (
                        <>
                          <button className="admin-btn admin-btn-success" onClick={()=>bookingAction(b.id,'Approved')}>Approve</button>
                          <button className="admin-btn admin-btn-danger" onClick={()=>bookingAction(b.id,'Rejected')}>Reject</button>
                        </>
                      )}
                      {b.status==='Approved' && <button className="admin-btn admin-btn-warning" onClick={()=>bookingAction(b.id,'Ongoing')}>Mark Ongoing</button>}
                      {b.status==='Ongoing'  && <button className="admin-btn admin-btn-outline" onClick={()=>bookingAction(b.id,'Returned')}>Mark Returned</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab==='fleets' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Fleets</h3>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Vehicles</th>
                </tr>
              </thead>
              <tbody>
                {fleets.length===0 && (
                  <tr><td colSpan={3} className="admin-empty">No fleets.</td></tr>
                )}
                {fleets.map(f=>(
                  <tr key={f.id}>
                    <td className="admin-muted">#{f.id}</td>
                    <td className="admin-bold">{f.name}</td>
                    <td><span className="admin-badge b-ongoing">{f.vehicles?.length || 0}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {(modal==='addVehicle'||modal==='editVehicle') && (
        <div className="admin-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e=>e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{modal==='addVehicle'?'Add Vehicle':'Edit Vehicle'}</h3>
              <button className="admin-btn admin-btn-outline admin-close" onClick={closeModal}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Vehicle Name *</label>
                  <input value={vForm.name} onChange={e=>setVForm({...vForm,name:e.target.value})} placeholder="e.g. Toyota Hilux"/>
                </div>
                <div className="admin-form-group">
                  <label>Plate Number *</label>
                  <input value={vForm.plate_number} onChange={e=>setVForm({...vForm,plate_number:e.target.value})} placeholder="e.g. ABC-1234"/>
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Model</label>
                  <input value={vForm.model} onChange={e=>setVForm({...vForm,model:e.target.value})} placeholder="e.g. Hilux Revo"/>
                </div>
                <div className="admin-form-group">
                  <label>Year</label>
                  <input type="number" value={vForm.year} onChange={e=>setVForm({...vForm,year:e.target.value})} placeholder="e.g. 2022"/>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Condition</label>
                <select value={vForm.condition} onChange={e=>setVForm({...vForm,condition:e.target.value})}>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Under Repair</option>
                  <option>Out of Service</option>
                </select>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-outline" onClick={closeModal}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={saveVehicle}>
                {modal==='addVehicle'?'Add Vehicle':'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {(modal==='addUser'||modal==='editUser') && (
        <div className="admin-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e=>e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{modal==='addUser'?'Add User':'Edit User'}</h3>
              <button className="admin-btn admin-btn-outline admin-close" onClick={closeModal}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Username *</label>
                  <input value={uForm.username} onChange={e=>setUForm({...uForm,username:e.target.value})} placeholder="johndoe"/>
                </div>
                <div className="admin-form-group">
                  <label>Employee ID</label>
                  <input value={uForm.profile.employee_id} onChange={e=>setUForm({...uForm,profile:{...uForm.profile,employee_id:e.target.value}})} placeholder="EMP-001"/>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Email *</label>
                <input type="email" value={uForm.email} onChange={e=>setUForm({...uForm,email:e.target.value})} placeholder="john@company.com"/>
              </div>
              <div className="admin-form-group">
                <label>{modal==='editUser'?'New Password (leave blank to keep)':'Password *'}</label>
                <input type="password" value={uForm.password} onChange={e=>setUForm({...uForm,password:e.target.value})} placeholder="••••••••"/>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Department</label>
                  <input value={uForm.profile.department} onChange={e=>setUForm({...uForm,profile:{...uForm.profile,department:e.target.value}})} placeholder="e.g. Logistics"/>
                </div>
                <div className="admin-form-group">
                  <label>Phone</label>
                  <input value={uForm.profile.phone} onChange={e=>setUForm({...uForm,profile:{...uForm.profile,phone:e.target.value}})} placeholder="09XX-XXX-XXXX"/>
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-checkbox">
                  <input type="checkbox" checked={uForm.is_staff} onChange={e=>setUForm({...uForm,is_staff:e.target.checked})}/>
                  <span>Grant Admin Access</span>
                </label>
              </div>
            </div>
            <div className="admin-modal-footer">              <button className="admin-btn admin-btn-outline" onClick={closeModal}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={saveUser}>
                {modal==='addUser'?'Add User':'Save Changes'}
              </button>
            </div>
          </div>
        </div>      )}
    </div>
  );
}
