import { useState } from 'react'
import '../styles/UserForm.css'

const VEHICLES = [
  { id: '', label: 'Select vehicle' },
  { id: 'ABC-1234', label: 'ABC-1234 — Cargo Truck' },
  { id: 'XYZ-5678', label: 'XYZ-5678 — Delivery Van' },
  { id: 'LMN-9012', label: 'LMN-9012 — Flatbed' },
  { id: 'QRS-3456', label: 'QRS-3456 — Refrigerated Van' },
]

const PURPOSES = ['Delivery', 'Pickup', 'Transfer', 'Maintenance run', 'Client visit', 'Emergency']
const PRIORITIES = ['Normal', 'Urgent', 'Scheduled']

function SectionLabel({ children }) {
  return <p className="section-label">{children}</p>
}

function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  )
}

function StatusBadge({ status }) {
  return <span className={`badge badge--${status.toLowerCase()}`}>{status}</span>
}

export default function DispatchForm() {
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    vehicleId: '',
    driverName: '',
    driverId: '',
    contact: '',
    dispatchDate: today,
    departureTime: '08:00',
    returnDate: '',
    returnTime: '',
    origin: '',
    destination: '',
    routeNotes: '',
    purpose: '',
    priority: 'Normal',
  })

  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState('Pending')

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // Updated validation (removed checklist and dispatcher requirements)
  const canSubmit =
    form.vehicleId &&
    form.driverName &&
    form.dispatchDate &&
    form.origin &&
    form.destination

  function handleSubmit() {
    if (!canSubmit) return
    setStatus('Dispatched')
    setSubmitted(true)
  }

  function handleReset() {
    setForm({
      vehicleId: '',
      driverName: '',
      driverId: '',
      contact: '',
      dispatchDate: today,
      departureTime: '08:00',
      returnDate: '',
      returnTime: '',
      origin: '',
      destination: '',
      routeNotes: '',
      purpose: '',
      priority: 'Normal',
    })
    setSubmitted(false)
    setStatus('Pending')
  }

  return (
    <div className="fd-container">
      <div className="fd-card">

        {/* ── Header ── */}
        <div className="fd-header">
          <div className="fd-header-group">
            <div className="fd-header-icon">
              <TruckIcon />
            </div>

            <div className="fd-header-text">
              <h1>Fleet Dispatch Form</h1>
              <p>
                New dispatch request ·{" "}
                {new Date().toLocaleDateString('en-PH', { dateStyle: 'long' })}
              </p>
            </div>

            <StatusBadge status={status} />
          </div>
        </div>

        {submitted && (
          <div className="success-banner">
            <CheckCircleIcon />
            Dispatch submitted successfully. Reference: DSP-{Date.now().toString().slice(-6)}
          </div>
        )}

        <div className="fd-body">

          {/* ── Vehicle & Driver ── */}
          <section>
            <SectionLabel>Vehicle &amp; Driver</SectionLabel>
            <div className="grid grid-2">
              <Field label="Vehicle ID / Plate">
                <select
                  value={form.vehicleId}
                  onChange={e => set('vehicleId', e.target.value)}
                >
                  {VEHICLES.map(v => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Driver name">
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.driverName}
                  onChange={e => set('driverName', e.target.value)}
                />
              </Field>

              <Field label="Driver ID / Employee no.">
                <input
                  type="text"
                  placeholder="EMP-####"
                  value={form.driverId}
                  onChange={e => set('driverId', e.target.value)}
                />
              </Field>

              <Field label="Contact number">
                <input
                  type="tel"
                  placeholder="+63 9XX XXX XXXX"
                  value={form.contact}
                  onChange={e => set('contact', e.target.value)}
                />
              </Field>
            </div>
          </section>

          <div className="divider" />

          {/* ── Schedule ── */}
          <section>
            <SectionLabel>Schedule</SectionLabel>
            <div className="grid grid-2">
              <Field label="Dispatch date">
                <input
                  type="date"
                  value={form.dispatchDate}
                  onChange={e => set('dispatchDate', e.target.value)}
                />
              </Field>

              <Field label="Departure time">
                <input
                  type="time"
                  value={form.departureTime}
                  onChange={e => set('departureTime', e.target.value)}
                />
              </Field>

              <Field label="Expected return date">
                <input
                  type="date"
                  value={form.returnDate}
                  onChange={e => set('returnDate', e.target.value)}
                />
              </Field>

              <Field label="Expected return time">
                <input
                  type="time"
                  value={form.returnTime}
                  onChange={e => set('returnTime', e.target.value)}
                />
              </Field>
            </div>
          </section>

          <div className="divider" />

          {/* ── Route & Destination ── */}
          <section>
            <SectionLabel>Route &amp; Destination</SectionLabel>

            <div className="grid grid-2">
              <Field label="Origin / Base">
                <input
                  type="text"
                  placeholder="Dispatch base address"
                  value={form.origin}
                  onChange={e => set('origin', e.target.value)}
                />
              </Field>

              <Field label="Primary destination">
                <input
                  type="text"
                  placeholder="City, address"
                  value={form.destination}
                  onChange={e => set('destination', e.target.value)}
                />
              </Field>
            </div>

            <Field
              label="Additional stops or route notes"
              hint="List any intermediate stops or special route instructions"
            >
              <textarea
                rows={3}
                placeholder="e.g. Stop at Cagayan de Oro warehouse before final delivery…"
                value={form.routeNotes}
                onChange={e => set('routeNotes', e.target.value)}
              />
            </Field>

            <div className="grid grid-2" style={{ marginTop: '4px' }}>
              <Field label="Purpose / Cargo type">
                <select
                  value={form.purpose}
                  onChange={e => set('purpose', e.target.value)}
                >
                  <option value="">Select type</option>
                  {PURPOSES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </Field>

              <Field label="Priority level">
                <select
                  value={form.priority}
                  onChange={e => set('priority', e.target.value)}
                >
                  {PRIORITIES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

        </div>

        {/* ── Footer ── */}
        <div className="fd-footer">
          <button className="btn btn--ghost" onClick={handleReset}>Reset form</button>
          <div className="footer-right">
            <button className="btn btn--outline">Save draft</button>
            <button
              className={`btn btn--primary ${!canSubmit ? 'btn--disabled' : ''}`}
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              Submit dispatch →
            </button>
          </div>
        </div>

      </div>

      {!canSubmit && (
        <p className="form-hint">
          Fill in the required fields to enable submission.
        </p>
      )}
    </div>
  )
}

function TruckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="8" width="15" height="10" rx="1.5"/>
      <path d="M16 10h4l3 4v4h-7V10z"/>
      <circle cx="5.5" cy="18.5" r="1.5"/>
      <circle cx="18.5" cy="18.5" r="1.5"/>
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 12l3 3 5-5"/>
    </svg>
  )
}