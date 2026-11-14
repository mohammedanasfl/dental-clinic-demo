import { Fragment, useState } from 'react';
import { Icon } from './Icon.jsx';
import { CONTACT, BOOKING_SERVICES, BOOKING_DOCTORS } from '../data/content.js';
import { openMail, handoffMessage } from '../utils/mailto.js';
import { canSubmitOnline, sendForm } from '../utils/formSubmit.js';

const STEPS = ['Service', 'Time', 'Confirm'];
const EMPTY = { service: BOOKING_SERVICES[0], doctor: BOOKING_DOCTORS[0], name: '', phone: '', date: '' };

export function Appointment() {
  const [v, setV] = useState(EMPTY);
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent | error

  const set = (e) => { setTouched(true); setV((s) => ({ ...s, [e.target.name]: e.target.value })); };

  // The stepper reflects real progress through the form (service → date → name + phone).
  const ok = [!!v.service, !!v.date.trim(), !!(v.name.trim() && v.phone.trim())];
  const current = touched ? ok.indexOf(false) : 0; // -1 once everything is filled in
  const isDone = (i) => touched && (current === -1 || i < current);

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); setStatus(''); setState('idle'); return; }
    const fields = { Service: v.service, 'Preferred doctor': v.doctor, Name: v.name.trim(), Phone: v.phone.trim(), 'Preferred date': v.date };
    const subject = `Appointment request: ${v.service}`;

    if (!canSubmitOnline()) { // no mail service configured: hand over to the visitor's mail app (never a fake success)
      setState('idle');
      setStatus(handoffMessage());
      openMail(subject, Object.entries(fields).map(([k, val]) => `${k}: ${val}`));
      return;
    }

    setState('sending');
    setStatus('Sending your request…');
    const res = await sendForm(subject, fields, form.elements.botcheck ? (form.elements.botcheck.checked ? 'on' : '') : '');
    if (res.ok) {
      setState('sent');
      setStatus(`Thank you. Your appointment request has been sent. We will contact you on ${fields.Phone} to confirm.`);
      setV(EMPTY);
      setTouched(false);
    } else {
      setState('error');
      setStatus(`Sorry, we could not send your request. Please try again, or call ${CONTACT.phone}.`);
    }
  };

  return (
    <section className="section appt" id="appointment" aria-labelledby="appt-title">
      <div className="appt__bg" data-appt-bg>
        <div className="appt__glow" data-appt-glow />
        <div className="appt__glow appt__glow--2" data-appt-glow />
        <div className="wrap">
          <div className="appt__grid">
            <div data-appt-copy>
              <span className="pill pill--glass" data-a><span className="pill__dot" />Priority Scheduling</span>
              <h2 className="h-xl" id="appt-title" data-split>Make An Appointment Today</h2>
              <p className="lead" data-a>Clita ipsum magna kasd rebum at ipsum amet dolor justo dolor est magna stet eirmod. Schedule your consultation with our world-renowned dental specialists and experience uncompromised comfort.</p>
              <div className="hotline" data-a>
                <div className="hotline__icon"><Icon name="phone-call" /></div>
                <div>
                  <small>Emergency &amp; General Line</small>
                  <a href={CONTACT.phoneHref} aria-label={CONTACT.phone} data-roll>{CONTACT.phone}</a>
                  <span className="s">Available 24/7 for urgent dental emergencies</span>
                </div>
              </div>
            </div>

            <div className="booking" data-appt-form>
              <h3>Book Instant Consultation</h3>
              <p className="sub">Send us your preferred service and date and we will get back to you to confirm.</p>
              <div className="stepper" aria-hidden="true" id="stepper">
                {STEPS.map((label, i) => (
                  <Fragment key={label}>
                    <span className={`step${isDone(i) ? ' is-done' : ''}${touched ? (i === current ? ' is-current' : '') : (i === 0 ? ' is-current' : '')}`}><i>{i + 1}</i>{label}</span>
                    {i < STEPS.length - 1 && <span className={`step-line${isDone(i) ? ' is-done' : ''}`} />}
                  </Fragment>
                ))}
              </div>
              <form className="form" id="appointment-form" noValidate onSubmit={submit}>
                {/* spam trap: hidden from people, bots tend to tick it */}
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }} />
                <div className="form-row">
                  <label className="field"><span>Service Required</span>
                    <select name="service" value={v.service} onChange={set} required>{BOOKING_SERVICES.map((o) => <option key={o}>{o}</option>)}</select></label>
                  <label className="field"><span>Preferred Doctor</span>
                    <select name="doctor" value={v.doctor} onChange={set}>{BOOKING_DOCTORS.map((o) => <option key={o}>{o}</option>)}</select></label>
                </div>
                <div className="form-row">
                  <label className="field"><span>Your Name</span><input type="text" name="name" value={v.name} onChange={set} placeholder="Johnathan Carter" autoComplete="name" required /></label>
                  <label className="field"><span>Phone Number</span><input type="tel" name="phone" value={v.phone} onChange={set} placeholder="+1 (555) 000-0000" autoComplete="tel" required /></label>
                </div>
                <label className="field"><span>Preferred Appointment Date</span><input type="date" name="date" value={v.date} onChange={set} required /></label>
                <button className="btn btn--blue btn--block btn--md" type="submit" disabled={state === 'sending'} aria-busy={state === 'sending'}><span>{state === 'sending' ? 'Sending…' : 'Book Instant Consultation'}</span><Icon name="circle-check" /></button>
                <p className={`form-status${state === 'error' ? ' is-error' : ''}${state === 'sent' ? ' is-sent' : ''}`} role="status" aria-live="polite">{status}</p>
                <div className="form-note"><Icon name="lock" /><span>Your details are only used to arrange your appointment</span></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
