import { CONTACT } from '../data/content.js';

/** Hand the form over to the visitor's mail app. There is no backend, so we never fake a success. */
export function openMail(subject, lines) {
  window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

export const handoffMessage = () =>
  `Opening your email app with your details. If nothing opens, email ${CONTACT.email} or call ${CONTACT.phone}.`;
