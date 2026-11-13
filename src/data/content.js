export const CONTACT = {
  email: 'info@example.com',
  phone: '+012 345 6789',
  phoneHref: 'tel:+0123456789',
  footerPhone: '+012 345 67890',
  footerPhoneHref: 'tel:+01234567890',
  address: '123 Street, New York, USA',
  hours: 'Mon - Tues : 6.00 am - 10.00 pm, Sunday Closed',
};

export const NAV = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'dentists', label: 'Our Dentists' },
  { id: 'contact', label: 'Contact' },
];
export const SECTION_IDS = ['hero', 'about', 'services', 'appointment', 'dentists', 'contact'];

export const FEATURES = [
  { icon: 'award', title: 'Award Winning', text: 'Recognized for clinical excellence & gentle care.' },
  { icon: 'stethoscope', title: 'Professional Staff', text: 'Friendly, experienced dental professionals.' },
  { icon: 'siren', title: '24/7 Opened', text: 'Round-the-clock emergency dental care support.' },
  { icon: 'banknote', title: 'Fair Prices', text: 'Transparent pricing and flexible treatment plans.' },
];

export const SERVICES = [
  { icon: 'smile', title: 'Cosmetic Dentistry', text: 'Porcelain veneers, ultra-thin lumineers, composite resin bonding, and customized digital smile design to achieve your ideal harmony.' },
  { icon: 'shield-check', title: 'Dental Implants', text: 'Permanent biocompatible titanium and ceramic root replacements anchored with computer-guided surgical 3D navigation for seamless durability.' },
  { icon: 'tooth', title: 'Dental Bridges', text: 'High-strength monolithic zirconia bridges closing tooth gaps, restoring complete mastication power, and guarding jaw alignment naturally.' },
  { icon: 'sparkles', title: 'Teeth Whitening', text: 'Laser-assisted deep enamel bleaching that erases tough stains and leaves your smile visibly brighter in a single comfortable clinical sitting.' },
];

// The original site lists five identical placeholder profiles.
export const DENTISTS = [1, 2, 3, 4, 5].map((n) => ({ id: n, name: 'Dr. John Doe', role: 'Implant Surgeon', photo: `dentist-${n}-360.webp` }));
export const SOCIALS = [
  { icon: 'twitter', label: 'Twitter' },
  { icon: 'facebook', label: 'Facebook' },
  { icon: 'linkedin', label: 'LinkedIn' },
  { icon: 'instagram', label: 'Instagram' },
];

export const FOOTER_LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About Us' },
  { href: '#services', label: 'Our Services' },
  { href: '#', label: 'Latest Blog' }, // no blog page yet (placeholder, as in the original)
  { href: '#contact', label: 'Contact Us' },
];

export const BOOKING_SERVICES = ['Cosmetic Dentistry', 'Dental Implants', 'Dental Bridges', 'Teeth Whitening'];
export const BOOKING_DOCTORS = ['Any Available Dentist', 'Dr. John Doe (Implant Surgeon)'];
export const CONTACT_SUBJECTS = [
  'General Dental Consultation',
  'Aesthetic Smile Makeover & Veneers',
  'Full Mouth Implant Restoration',
  'Immediate Acute Dental Emergency',
  'Insurance, Pricing & Billing Inquiries',
];
export const MAP_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd';
