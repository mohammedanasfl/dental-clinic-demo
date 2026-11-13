/** URL for a file in /public, honouring the Vite `base` (GitHub Pages serves under /dental-clinic-demo/). */
export const asset = (p) => import.meta.env.BASE_URL + p;
export const img = (name) => asset('assets/img/' + name);
