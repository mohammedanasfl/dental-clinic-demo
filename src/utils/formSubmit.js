/** Real form delivery through Web3Forms (https://web3forms.com): no backend, the message is emailed to the
 *  inbox that owns the access key. The key is public by design (it can only send to that inbox) and is
 *  injected at build time from VITE_WEB3FORMS_KEY. Without a key the callers fall back to a mailto: hand-off. */
const ENDPOINT = 'https://api.web3forms.com/submit';
const KEY = import.meta.env.VITE_WEB3FORMS_KEY || '';

export const canSubmitOnline = () => KEY.length > 0;

/** Resolves `{ ok: true }` only when Web3Forms confirms it accepted the message. Never throws. */
export async function sendForm(subject, fields, honeypot = '') {
  if (!KEY) return { ok: false, reason: 'not-configured' };
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: KEY, subject, from_name: 'DentCare website', botcheck: honeypot, ...fields }),
    });
    const data = await res.json().catch(() => ({}));
    return res.ok && data.success === true ? { ok: true } : { ok: false, reason: 'rejected', message: data.message };
  } catch {
    return { ok: false, reason: 'network' };
  }
}
