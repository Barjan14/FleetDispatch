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

function Field({ label, error, children }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
      {error && <span className="field-error">⚠ {error}</span>}
    </div>
  )
}

function StatusBadge({ status }) {
  return <span className={`badge badge--${status.toLowerCase()}`}>{status}</span>
}

export default function DispatchForm() {
  const today = new Date().toISOString().split('T')[0]

  const [step, setStep] = useState(1)

  const [form, setForm] = useState({
    vehicleId: '',
    driverName: '',
    driverId: '',
    contact: '',
    dispatchDate: today,
    departureTime: '08:00',
    returnDate: '',
    returnTime: '',
    origin: 'DAR Region 10',
    destination: '',
    routeNotes: '',
    purpose: '',
    priority: 'Normal',
  })

  const [submitted, setSubmitted] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [status, setStatus] = useState('Pending')
  const [errors, setErrors] = useState({})

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  const validateStep = () => {
    let newErrors = {}

    if (step === 1) {
      if (!form.vehicleId) newErrors.vehicleId = 'Vehicle is required'
      if (!form.driverName) newErrors.driverName = 'Driver name is required'
      if (!form.driverId) newErrors.driverId = 'Driver ID is required'
      if (!form.contact) newErrors.contact = 'Contact number is required'
    }

    if (step === 2) {
      if (!form.dispatchDate) newErrors.dispatchDate = 'Dispatch date is required'
      if (!form.departureTime) newErrors.departureTime = 'Departure time is required'
    }

    if (step === 3) {
      if (!form.destination) newErrors.destination = 'Destination is required'
      if (!form.purpose) newErrors.purpose = 'Purpose is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const canSubmit =
    form.vehicleId &&
    form.driverName &&
    form.dispatchDate &&
    form.destination

  function handleNext() {
    if (!validateStep()) return
    setStep(s => s + 1)
  }

  function handleSubmit() {
    if (!validateStep()) return

    setStatus('Dispatched')
    setSubmitted(true)
    setShowSummary(true) // ✅ SHOW SUMMARY AFTER SUBMIT
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
      origin: 'DAR Region 10',
      destination: '',
      routeNotes: '',
      purpose: '',
      priority: 'Normal',
    })

    setStep(1)
    setSubmitted(false)
    setShowSummary(false)
    setStatus('Pending')
    setErrors({})
  }

  return (
    <div className="fd-container">
      <div className="fd-card">

        {/* HEADER */}
        <div className="fd-header">
          <div className="fd-header-group">
            <div className="fd-header-icon">
              <TruckIcon />
            </div>

            <div className="fd-header-text">
              <h1>Fleet Dispatch Form</h1>
              <p>
                Step {step} of 3 · {new Date().toLocaleDateString('en-PH', { dateStyle: 'long' })}
              </p>
            </div>

            <StatusBadge status={status} />
          </div>
        </div>

        {/* SUCCESS */}
        {submitted && (
          <div className="success-banner">
            <CheckCircleIcon />
            Dispatch submitted successfully. Reference: DSP-{Date.now().toString().slice(-6)}
          </div>
        )}

        {/* ✅ SUMMARY CARD */}
        {showSummary && (
          <div className="summary-card">
            <h2>Dispatch Summary</h2>

            <div className="summary-grid">
              <p><b>Vehicle:</b> {form.vehicleId}</p>
              <p><b>Driver:</b> {form.driverName}</p>
              <p><b>Driver ID:</b> {form.driverId}</p>
              <p><b>Contact:</b> {form.contact}</p>
              <p><b>Dispatch Date:</b> {form.dispatchDate}</p>
              <p><b>Departure:</b> {form.departureTime}</p>
              <p><b>Return Date:</b> {form.returnDate || 'N/A'}</p>
              <p><b>Return Time:</b> {form.returnTime || 'N/A'}</p>
              <p><b>Origin:</b> {form.origin}</p>
              <p><b>Destination:</b> {form.destination}</p>
              <p><b>Purpose:</b> {form.purpose}</p>
              <p><b>Priority:</b> {form.priority}</p>
              <p><b>Notes:</b> {form.routeNotes || 'None'}</p>
            </div>

            <button className="btn btn--primary" onClick={handleReset}>
              Close Summary
            </button>
          </div>
        )}

        <div className="fd-body">

          {/* STEP 1 */}
          {step === 1 && (
            <section>
              <SectionLabel>Vehicle & Driver</SectionLabel>

              <div className="grid grid-2">

                <Field label="Vehicle ID / Plate" error={errors.vehicleId}>
                  <select
                    value={form.vehicleId}
                    onChange={e => set('vehicleId', e.target.value)}
                  >
                    {VEHICLES.map(v => (
                      <option key={v.id} value={v.id}>{v.label}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Driver name" error={errors.driverName}>
                  <input
                    value={form.driverName}
                    onChange={e => set('driverName', e.target.value)}
                  />
                </Field>

                <Field label="Driver ID" error={errors.driverId}>
                  <input
                    value={form.driverId}
                    onChange={e => set('driverId', e.target.value)}
                  />
                </Field>

                <Field label="Contact" error={errors.contact}>
                  <input
                    value={form.contact}
                    onChange={e => set('contact', e.target.value)}
                  />
                </Field>

              </div>
            </section>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <section>
              <SectionLabel>Schedule</SectionLabel>

              <div className="grid grid-2">

                <Field label="Dispatch date" error={errors.dispatchDate}>
                  <input
                    type="date"
                    value={form.dispatchDate}
                    onChange={e => set('dispatchDate', e.target.value)}
                  />
                </Field>

                <Field label="Departure time" error={errors.departureTime}>
                  <input
                    type="time"
                    value={form.departureTime}
                    onChange={e => set('departureTime', e.target.value)}
                  />
                </Field>

                <Field label="Return date">
                  <input
                    type="date"
                    value={form.returnDate}
                    onChange={e => set('returnDate', e.target.value)}
                  />
                </Field>

                <Field label="Return time">
                  <input
                    type="time"
                    value={form.returnTime}
                    onChange={e => set('returnTime', e.target.value)}
                  />
                </Field>

              </div>
            </section>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <section>
              <SectionLabel>Route & Destination</SectionLabel>

              <div className="grid grid-2">

                <Field label="Origin / Base">
                  <div className="fixed-value">DAR Region 10</div>
                </Field>

                <Field label="Primary destination" error={errors.destination}>
                  <input
                    value={form.destination}
                    onChange={e => set('destination', e.target.value)}
                    placeholder="Enter destination"
                  />
                </Field>

              </div>

              <Field label="Route notes">
                <textarea
                  rows={3}
                  value={form.routeNotes}
                  onChange={e => set('routeNotes', e.target.value)}
                />
              </Field>

              <div className="grid grid-2">

                <Field label="Purpose" error={errors.purpose}>
                  <select
                    value={form.purpose}
                    onChange={e => set('purpose', e.target.value)}
                  >
                    <option value="">Select</option>
                    {PURPOSES.map(p => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Priority">
                  <select
                    value={form.priority}
                    onChange={e => set('priority', e.target.value)}
                  >
                    {PRIORITIES.map(p => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </Field>

              </div>
            </section>
          )}

        </div>

        {/* FOOTER */}
        <div className="fd-footer">

          <button className="btn btn--ghost" onClick={() => setStep(s => Math.max(1, s - 1))}>
            Back
          </button>

          <div className="footer-right">

            {step < 3 && (
              <button className="btn btn--primary" onClick={handleNext}>
                Next →
              </button>
            )}

            {step === 3 && (
              <button className="btn btn--primary" disabled={!canSubmit} onClick={handleSubmit}>
                Submit →
              </button>
            )}

            <button className="btn btn--outline" onClick={handleReset}>
              Reset
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}

/* ICONS */
function TruckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="1" y="8" width="15" height="10" rx="1.5" />
      <path d="M16 10h4l3 4v4h-7V10z" />
      <circle cx="5.5" cy="18.5" r="1.5" />
      <circle cx="18.5" cy="18.5" r="1.5" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-5" />
    </svg>
  )
}