import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const C = {
  primary:'#4f46e5', primaryL:'#eef2ff', danger:'#ef4444', dangerL:'#fef2f2',
  success:'#10b981', successL:'#ecfdf5', warn:'#f97316', warnL:'#fff7ed',
  bg:'#f1f5f9', card:'#ffffff', text:'#1e293b', muted:'#64748b', border:'#e2e8f0',
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Inter',sans-serif;background:${C.bg};color:${C.text};}
  .root{display:flex;min-height:100vh;}
  .sidebar{width:240px;background:${C.primary};color:#fff;display:flex;flex-direction:column;padding:24px 16px;position:fixed;top:0;left:0;height:100vh;}
  .logo{font-size:20px;font-weight:700;margin-bottom:36px;}
  .logo span{opacity:.6;}
  .nav{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;margin-bottom:4px;transition:background .15s;}
  .nav:hover{background:rgba(255,255,255,.15);}
  .nav.on{background:rgba(255,255,255,.22);}
  .sfooter{margin-top:auto;font-size:12px;opacity:.4;}
  .main{margin-left:240px;padding:32px;flex:1;}
  .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;}
  .topbar h1{font-size:22px;font-weight:700;}
  .tuser{display:flex;align-items:center;gap:10px;background:${C.card};padding:8px 16px;border-radius:50px;font-size:14px;font-weight:500;box-shadow:0 1px 4px rgba(0,0,0,.08);}
  .av{width:32px;height:32px;border-radius:50%;background:${C.primary};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;}
  .sgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px;}
  .sc{background:${C.card};border-radius:12px;padding:20px 24px;box-shadow:0 1px 4px rgba(0,0,0,.06);display:flex;align-items:center;gap:16px;}
  .si{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;}
  .si-info p{font-size:11px;color:${C.muted};font-weight:600;text-transform:uppercase;letter-spacing:.5px;}
  .si-info h2{font-size:26px;font-weight:700;margin-top:2px;}
  .card{background:${C.card};border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,.06);margin-bottom:20px;overflow:hidden;}
  .ch{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid ${C.border};}
  .ch h3{font-size:15px;font-weight:600;}
  table{width:100%;border-collapse:collapse;}
  thead tr{background:#f8fafc;}
  th{padding:11px 20px;text-align:left;font-size:11px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:.5px;}
  td{padding:13px 20px;font-size:14px;border-top:1px solid ${C.border};vertical-align:middle;}
  tr:hover td{background:#f8fafc;}
  .btn{padding:7px 14px;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:500;transition:opacity .15s;}
  .btn:hover{opacity:.85;}
  .bp{background:${C.primary};color:#fff;}
  .bd{background:${C.danger};color:#fff;}
  .bs{background:${C.success};color:#fff;}
  .bg{background:transparent;color:${C.muted};border:1px solid ${C.border};}
  .bw{background:${C.warn};color:#fff;}
  .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;}
  .b-good{background:#d1fae5;color:#065f46;}
  .b-fair{background:#fef9c3;color:#854d0e;}
  .b-repair{background:#fee2e2;color:#991b1b;}
  .b-out{background:#f1f5f9;color:#475569;}
  .b-pending{background:#fef9c3;color:#854d0e;}
  .b-approved{background:#d1fae5;color:#065f46;}
  .b-rejected{background:#fee2e2;color:#991b1b;}
  .b-ongoing{background:#dbeafe;color:#1e40af;}
  .b-returned{background:#f1f5f9;color:#475569;}
  .overlay{position:fixed;inset:0;background:rgba(15,23,42,.45);display:flex;align-items:center;justify-content:center;z-index:1000;}
  .mbox{background:${C.card};border-radius:14px;width:460px;max-width:92%;box-shadow:0 20px 60px rgba(0,0,0,.15);overflow:hidden;max-height:90vh;display:flex;flex-direction:column;}
  .mh{padding:18px 24px;border-bottom:1px solid ${C.border};font-size:16px;font-weight:600;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
  .mc{padding:24px;display:flex;flex-direction:column;gap:14px;overflow-y:auto;}
  .mf{padding:16px 24px;border-top:1px solid ${C.border};display:flex;justify-content:flex-end;gap:10px;flex-shrink:0;}
  .fg{display:flex;flex-direction:column;gap:6px;}
  .fg label{font-size:13px;font-weight:500;color:${C.muted};}
  .fg input,.fg select,.fg textarea{padding:9px 12px;border:1px solid ${C.border};border-radius:8px;font-size:14px;outline:none;font-family:inherit;transition:border .15s;}
  .fg input:focus,.fg select:focus,.fg textarea:focus{border-color:${C.primary};}
  .fg input[type=file]{padding:7px 10px;cursor:pointer;}
  .row2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .err{background:${C.dangerL};color:${C.danger};padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;}
  .ok{background:${C.successL};color:${C.success};padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;}
  .empty{text-align:center;color:${C.muted};padding:32px;font-size:14px;}
  .acts{display:flex;gap:6px;flex-wrap:wrap;}
  .vthumb{width:56px;height:44px;object-fit:cover;border-radius:7px;border:1px solid ${C.border};display:block;}
  .vthumb-empty{width:56px;height:44px;border-radius:7px;background:#f1f5f9;border:1px solid ${C.border};display:flex;align-items:center;justify-content:center;font-size:20px;}
  .img-upload-area{border:2px dashed ${C.border};border-radius:10px;padding:16px;text-align:center;cursor:pointer;transition:border .15s;position:relative;}
  .img-upload-area:hover{border-color:${C.primary};}
  .img-upload-area input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
  .img-preview{width:100%;height:160px;object-fit:cover;border-radius:8px;margin-top:8px;border:1px solid ${C.border};}
  @media(max-width:768px){.sidebar{display:none;}.main{margin-left:0;padding:16px;}.sgrid{grid-template-columns:1fr 1fr;}}
`;

const NAV = [
  { key:'overview',  icon:'📊', label:'Overview'  },
  { key:'vehicles',  icon:'🚗', label:'Vehicles'  },
  { key:'users',     icon:'👥', label:'Users'     },
  { key:'bookings',  icon:'📅', label:'Bookings'  },
  { key:'fleets',    icon:'🗂️', label:'Fleets'    },
];

const API = 'http://localhost:8000/api';

function condBadge(c) {
  const map = { Good:'b-good', Fair:'b-fair', 'Under Repair':'b-repair', 'Out of Service':'b-out' };
  return map[c] || 'b-out';
}
function bookBadge(s) {
  const map = { Pending:'b-pending', Approved:'b-approved', Rejected:'b-rejected', Ongoing:'b-ongoing', Returned:'b-returned' };
  return map[s] || '';
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab]         = useState('overview');
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState({ msg:'', type:'' });

  const [adminUser, setAdminUser] = useState({});
  const [stats, setStats]         = useState({});
  const [vehicles, setVehicles]   = useState([]);
  const [users, setUsers]         = useState([]);
  const [fleets, setFleets]       = useState([]);
  const [bookings, setBookings]   = useState([]);

  const [modal, setModal] = useState('');
  const [sel, setSel]     = useState(null);

  // Vehicle form — includes image (File) and preview (blob URL) and existingImage (URL from server)
  const [vForm, setVForm] = useState({
    name:'', plate_number:'', model:'', year:'', condition:'Good',
    image: null, preview: null, existingImage: null
  });

  const [uForm, setUForm] = useState({
    username:'', email:'', password:'', is_staff:false,
    profile:{ employee_id:'', department:'', phone:'' }
  });

  const showToast = (msg, type='ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:'', type:'' }), 3000);
  };

  const headers = useCallback(() => {
    const token = localStorage.getItem('adminToken');
    return { Authorization:`Bearer ${token}`, 'Content-Type':'application/json' };
  }, []);

  const fetchAll = useCallback(async () => {
    const token   = localStorage.getItem('adminToken');
    const isAdmin = localStorage.getItem('isAdmin');
    if (!token || isAdmin !== 'true') { navigate('/admin-login'); return; }

    try {
      const h = { Authorization:`Bearer ${token}`, 'Content-Type':'application/json' };
      const [rD, rV, rU, rF, rB] = await Promise.all([
        fetch(`${API}/admin-dashboard/`, { headers:h }),
        fetch(`${API}/admin-vehicles/`,  { headers:h }),
        fetch(`${API}/admin-users/`,     { headers:h }),
        fetch(`${API}/admin-fleets/`,    { headers:h }),
        fetch(`${API}/admin-bookings/`,  { headers:h }),
      ]);
      const [d, v, u, f, b] = await Promise.all([rD.json(), rV.json(), rU.json(), rF.json(), rB.json()]);
      setAdminUser(d.admin); setStats(d.stats);
      setVehicles(v); setUsers(u); setFleets(f); setBookings(b);
    } catch(e) {
      showToast('Failed to load data. Is the server running?', 'err');
    } finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const closeModal = () => { setModal(''); setSel(null); };

  // ── Vehicle CRUD ──────────────────────────────────────────
  const openAddVehicle = () => {
    setVForm({ name:'', plate_number:'', model:'', year:'', condition:'Good', image:null, preview:null, existingImage:null });
    setModal('addVehicle');
  };

  const openEditVehicle = (v) => {
    setVForm({
      name: v.name,
      plate_number: v.plate_number,
      model: v.model || '',
      year: v.year || '',
      condition: v.condition || 'Good',
      image: null,
      preview: null,
      existingImage: v.image_url || null   // ← show current image from server
    });
    setSel(v);
    setModal('editVehicle');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVForm(f => ({
      ...f,
      image: file,
      preview: URL.createObjectURL(file),
      existingImage: null   // new image replaces old preview
    }));
  };

  const saveVehicle = async () => {
    const isEdit = modal === 'editVehicle';
    const url    = isEdit ? `${API}/admin-vehicles/${sel.id}/` : `${API}/admin-vehicles/`;
    const method = isEdit ? 'PUT' : 'POST';

    const formData = new FormData();
    formData.append('name',         vForm.name);
    formData.append('plate_number', vForm.plate_number);
    formData.append('model',        vForm.model);
    formData.append('year',         vForm.year);
    formData.append('condition',    vForm.condition);
    if (vForm.image) {
      formData.append('image', vForm.image);
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization:`Bearer ${localStorage.getItem('adminToken')}` },
        body: formData,
      });
      if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
      showToast(isEdit ? 'Vehicle updated!' : 'Vehicle added!');
      closeModal(); fetchAll();
    } catch(e) { showToast('Error: ' + e.message, 'err'); }
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    await fetch(`${API}/admin-vehicles/${id}/`, { method:'DELETE', headers:headers() });
    showToast('Vehicle deleted.'); fetchAll();
  };

  // ── User CRUD ─────────────────────────────────────────────
  const openAddUser = () => {
    setUForm({ username:'', email:'', password:'', is_staff:false, profile:{ employee_id:'', department:'', phone:'' } });
    setModal('addUser');
  };
  const openEditUser = (u) => {
    setUForm({
      username:u.username, email:u.email, password:'', is_staff:u.is_staff,
      profile:{ employee_id:u.profile?.employee_id||'', department:u.profile?.department||'', phone:u.profile?.phone||'' }
    });
    setSel(u); setModal('editUser');
  };
  const saveUser = async () => {
    const isEdit = modal === 'editUser';
    const url    = isEdit ? `${API}/admin-users/${sel.id}/` : `${API}/admin-users/`;
    const method = isEdit ? 'PUT' : 'POST';
    const body   = { ...uForm };
    if (isEdit && !body.password) delete body.password;
    try {
      const res = await fetch(url, { method, headers:headers(), body:JSON.stringify(body) });
      if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
      showToast(isEdit ? 'User updated!' : 'User added!');
      closeModal(); fetchAll();
    } catch(e) { showToast('Error: ' + e.message, 'err'); }
  };
  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await fetch(`${API}/admin-users/${id}/`, { method:'DELETE', headers:headers() });
    showToast('User deleted.'); fetchAll();
  };

  // ── Booking Actions ───────────────────────────────────────
  const bookingAction = async (id, newStatus, notes='') => {
    try {
      const res = await fetch(`${API}/admin-bookings/${id}/`, {
        method:'PUT', headers:headers(),
        body: JSON.stringify({ status:newStatus, admin_notes:notes })
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed'); }
      showToast(`Booking marked as ${newStatus}!`);
      fetchAll();
    } catch(e) { showToast('Error: ' + e.message, 'err'); }
  };

  if (loading) return (
    <><style>{css}</style>
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:C.muted}}>
      Loading…
    </div></>
  );

  // The image to show in modal: new preview or existing server image
  const modalImageSrc = vForm.preview || vForm.existingImage;

  return (
    <div className="root">
      <style>{css}</style>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">Fleet<span>Dispatch</span></div>
        {NAV.map(n => (
          <div key={n.key} className={`nav ${tab===n.key?'on':''}`} onClick={()=>setTab(n.key)}>
            <span style={{fontSize:18}}>{n.icon}</span>{n.label}
            {n.key==='bookings' && stats.pendingBookings > 0 &&
              <span style={{marginLeft:'auto',background:'#ef4444',borderRadius:'50%',width:18,height:18,
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700}}>
                {stats.pendingBookings}
              </span>
            }
          </div>
        ))}
        <div className="sfooter">FleetDispatch v2.0</div>
        <div className="nav" style={{color:'#fca5a5'}} onClick={() => {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isAdmin');
          navigate('/admin-login');
        }}>
          🚪 Logout
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <div className="topbar">
          <h1>{NAV.find(n=>n.key===tab)?.label}</h1>
          <div className="tuser">
            <div className="av">{(adminUser.name||'A')[0].toUpperCase()}</div>
            {adminUser.name||'Admin'}
          </div>
        </div>

        {toast.msg && <div className={toast.type==='err'?'err':'ok'}>{toast.msg}</div>}

        {/* ── OVERVIEW ── */}
        {tab==='overview' && (
          <div className="sgrid">
            {[
              {icon:'🚗',label:'Vehicles',  value:stats.totalVehicles||0,  bg:C.primaryL, color:C.primary},
              {icon:'👥',label:'Users',     value:stats.totalUsers||0,     bg:C.successL, color:C.success},
              {icon:'🗂️',label:'Fleets',    value:stats.totalFleets||0,    bg:C.warnL,    color:C.warn},
              {icon:'📅',label:'Pending',   value:stats.pendingBookings||0,bg:C.dangerL,  color:C.danger},
            ].map(s=>(
              <div className="sc" key={s.label}>
                <div className="si" style={{background:s.bg,color:s.color}}>{s.icon}</div>
                <div className="si-info"><p>{s.label}</p><h2>{s.value}</h2></div>
              </div>
            ))}
          </div>
        )}

        {/* ── VEHICLES ── */}
        {tab==='vehicles' && (
          <div className="card">
            <div className="ch">
              <h3>Vehicles <span className="badge b-ongoing" style={{marginLeft:8}}>{vehicles.length}</span></h3>
              <button className="btn bp" onClick={openAddVehicle}>+ Add Vehicle</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Image</th><th>ID</th><th>Name</th><th>Plate</th>
                  <th>Model/Year</th><th>Condition</th><th>Available</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length===0 && <tr><td colSpan={8} className="empty">No vehicles yet.</td></tr>}
                {vehicles.map(v=>(
                  <tr key={v.id}>
                    {/* ── IMAGE CELL ── */}
                    <td>
                      {v.image_url
                        ? <img src={v.image_url} alt={v.name} className="vthumb"/>
                        : <div className="vthumb-empty">🚗</div>
                      }
                    </td>
                    <td style={{color:C.muted}}>#{v.id}</td>
                    <td style={{fontWeight:500}}>{v.name}</td>
                    <td>
                      <code style={{background:'#f1f5f9',padding:'2px 8px',borderRadius:4,fontSize:13}}>
                        {v.plate_number}
                      </code>
                    </td>
                    <td style={{color:C.muted}}>{v.model} {v.year}</td>
                    <td><span className={`badge ${condBadge(v.condition)}`}>{v.condition}</span></td>
                    <td>
                      <span className={`badge ${v.is_available?'b-approved':'b-rejected'}`}>
                        {v.is_available?'Yes':'No'}
                      </span>
                    </td>
                    <td className="acts">
                      <button className="btn bp" onClick={()=>openEditVehicle(v)}>Edit</button>
                      <button className="btn bd" onClick={()=>deleteVehicle(v.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── USERS ── */}
        {tab==='users' && (
          <div className="card">
            <div className="ch">
              <h3>Users <span className="badge b-ongoing" style={{marginLeft:8}}>{users.length}</span></h3>
              <button className="btn bp" onClick={openAddUser}>+ Add User</button>
            </div>
            <table>
              <thead><tr><th>Emp. ID</th><th>Username</th><th>Email</th><th>Department</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {users.length===0 && <tr><td colSpan={6} className="empty">No users yet.</td></tr>}
                {users.map(u=>(
                  <tr key={u.id}>
                    <td><code style={{background:'#f1f5f9',padding:'2px 8px',borderRadius:4,fontSize:13}}>{u.profile?.employee_id||'—'}</code></td>
                    <td style={{fontWeight:500}}>{u.username}</td>
                    <td style={{color:C.muted}}>{u.email}</td>
                    <td style={{color:C.muted}}>{u.profile?.department||'—'}</td>
                    <td><span className={`badge ${u.is_staff?'b-approved':'b-ongoing'}`}>{u.is_staff?'Admin':'User'}</span></td>
                    <td className="acts">
                      <button className="btn bp" onClick={()=>openEditUser(u)}>Edit</button>
                      <button className="btn bd" onClick={()=>deleteUser(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {tab==='bookings' && (
          <div className="card">
            <div className="ch">
              <h3>Bookings <span className="badge b-pending" style={{marginLeft:8}}>{bookings.filter(b=>b.status==='Pending').length} pending</span></h3>
            </div>
            <table>
              <thead><tr><th>ID</th><th>Employee</th><th>Vehicle</th><th>Start</th><th>End</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {bookings.length===0 && <tr><td colSpan={7} className="empty">No bookings yet.</td></tr>}
                {bookings.map(b=>(
                  <tr key={b.id}>
                    <td style={{color:C.muted}}>#{b.id}</td>
                    <td>
                      <div style={{fontWeight:500}}>{b.user_name}</div>
                      <div style={{fontSize:12,color:C.muted}}>{b.employee_id||'No EMP ID'}</div>
                    </td>
                    <td>
                      <div style={{fontWeight:500}}>{b.vehicle_name}</div>
                      <div style={{fontSize:12,color:C.muted}}>{b.vehicle_plate}</div>
                    </td>
                    <td style={{fontSize:13}}>{new Date(b.start_datetime).toLocaleString()}</td>
                    <td style={{fontSize:13}}>{new Date(b.end_datetime).toLocaleString()}</td>
                    <td><span className={`badge ${bookBadge(b.status)}`}>{b.status}</span></td>
                    <td className="acts">
                      {b.status==='Pending'  && <><button className="btn bs" onClick={()=>bookingAction(b.id,'Approved')}>Approve</button><button className="btn bd" onClick={()=>bookingAction(b.id,'Rejected')}>Reject</button></>}
                      {b.status==='Approved' && <button className="btn bw" onClick={()=>bookingAction(b.id,'Ongoing')}>Mark Ongoing</button>}
                      {b.status==='Ongoing'  && <button className="btn bg" onClick={()=>bookingAction(b.id,'Returned')}>Mark Returned</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── FLEETS ── */}
        {tab==='fleets' && (
          <div className="card">
            <div className="ch"><h3>Fleets</h3></div>
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Vehicles</th></tr></thead>
              <tbody>
                {fleets.length===0 && <tr><td colSpan={3} className="empty">No fleets.</td></tr>}
                {fleets.map(f=>(
                  <tr key={f.id}>
                    <td style={{color:C.muted}}>#{f.id}</td>
                    <td style={{fontWeight:500}}>{f.name}</td>
                    <td><span className="badge b-ongoing">{f.vehicle_count}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ══ ADD / EDIT VEHICLE MODAL ══ */}
      {(modal==='addVehicle'||modal==='editVehicle') && (
        <div className="overlay" onClick={closeModal}>
          <div className="mbox" onClick={e=>e.stopPropagation()}>
            <div className="mh">
              {modal==='addVehicle'?'Add Vehicle':'Edit Vehicle'}
              <button className="btn bg" style={{padding:'4px 10px'}} onClick={closeModal}>✕</button>
            </div>
            <div className="mc">
              <div className="row2">
                <div className="fg">
                  <label>Vehicle Name *</label>
                  <input value={vForm.name} onChange={e=>setVForm({...vForm,name:e.target.value})} placeholder="e.g. Toyota Hilux"/>
                </div>
                <div className="fg">
                  <label>Plate Number *</label>
                  <input value={vForm.plate_number} onChange={e=>setVForm({...vForm,plate_number:e.target.value})} placeholder="e.g. ABC-1234"/>
                </div>
              </div>
              <div className="row2">
                <div className="fg">
                  <label>Model</label>
                  <input value={vForm.model} onChange={e=>setVForm({...vForm,model:e.target.value})} placeholder="e.g. Hilux Revo"/>
                </div>
                <div className="fg">
                  <label>Year</label>
                  <input type="number" value={vForm.year} onChange={e=>setVForm({...vForm,year:e.target.value})} placeholder="e.g. 2022"/>
                </div>
              </div>
              <div className="fg">
                <label>Condition</label>
                <select value={vForm.condition} onChange={e=>setVForm({...vForm,condition:e.target.value})}>
                  <option>Good</option><option>Fair</option><option>Under Repair</option><option>Out of Service</option>
                </select>
              </div>

              {/* ── IMAGE UPLOAD ── */}
              <div className="fg">
                <label>Vehicle Image {modal==='editVehicle' && '(leave empty to keep current)'}</label>
                <div className="img-upload-area">
                  <input type="file" accept="image/*" onChange={handleImageChange}/>
                  {modalImageSrc
                    ? <img src={modalImageSrc} alt="preview" className="img-preview"/>
                    : <div style={{padding:'20px 0',color:C.muted,fontSize:13}}>
                        <div style={{fontSize:28,marginBottom:6}}>📷</div>
                        Click or drag an image here
                      </div>
                  }
                </div>
                {modalImageSrc && (
                  <button
                    type="button"
                    className="btn bg"
                    style={{fontSize:12,padding:'4px 10px',marginTop:4,alignSelf:'flex-start'}}
                    onClick={() => setVForm(f=>({...f, image:null, preview:null, existingImage:null}))}
                  >
                    ✕ Remove image
                  </button>
                )}
              </div>
            </div>
            <div className="mf">
              <button className="btn bg" onClick={closeModal}>Cancel</button>
              <button className="btn bp" onClick={saveVehicle}>{modal==='addVehicle'?'Add Vehicle':'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ADD / EDIT USER MODAL ══ */}
      {(modal==='addUser'||modal==='editUser') && (
        <div className="overlay" onClick={closeModal}>
          <div className="mbox" onClick={e=>e.stopPropagation()}>
            <div className="mh">
              {modal==='addUser'?'Add User':'Edit User'}
              <button className="btn bg" style={{padding:'4px 10px'}} onClick={closeModal}>✕</button>
            </div>
            <div className="mc">
              <div className="row2">
                <div className="fg"><label>Username *</label><input value={uForm.username} onChange={e=>setUForm({...uForm,username:e.target.value})} placeholder="johndoe"/></div>
                <div className="fg"><label>Employee ID *</label><input value={uForm.profile.employee_id} onChange={e=>setUForm({...uForm,profile:{...uForm.profile,employee_id:e.target.value}})} placeholder="EMP-001"/></div>
              </div>
              <div className="fg"><label>Email</label><input type="email" value={uForm.email} onChange={e=>setUForm({...uForm,email:e.target.value})} placeholder="john@company.com"/></div>
              <div className="fg"><label>{modal==='editUser'?'New Password (leave blank to keep)':'Password *'}</label><input type="password" value={uForm.password} onChange={e=>setUForm({...uForm,password:e.target.value})} placeholder="••••••••"/></div>
              <div className="row2">
                <div className="fg"><label>Department</label><input value={uForm.profile.department} onChange={e=>setUForm({...uForm,profile:{...uForm.profile,department:e.target.value}})} placeholder="e.g. Logistics"/></div>
                <div className="fg"><label>Phone</label><input value={uForm.profile.phone} onChange={e=>setUForm({...uForm,profile:{...uForm.profile,phone:e.target.value}})} placeholder="09XX-XXX-XXXX"/></div>
              </div>
              <div className="fg">
                <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
                  <input type="checkbox" checked={uForm.is_staff} onChange={e=>setUForm({...uForm,is_staff:e.target.checked})}/>
                  Grant Admin Access
                </label>
              </div>
            </div>
            <div className="mf">
              <button className="btn bg" onClick={closeModal}>Cancel</button>
              <button className="btn bp" onClick={saveUser}>{modal==='addUser'?'Add User':'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}