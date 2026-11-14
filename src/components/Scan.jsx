import { asset } from '../utils/assets.js';

/* Marker positions are percentages of the (16:9) frame, taken from the final "exploded" frame. */
const PARTS = [
  { name: 'Protective tip', x: 10.6, y: 50 },
  { name: 'Camera head', x: 27.5, y: 51 },
  { name: 'Circuit module', x: 43, y: 49 },
  { name: 'Upper shell', x: 60, y: 34 },
  { name: 'Handle shell', x: 56, y: 62 },
  { name: 'Cable connector', x: 83, y: 50 },
];

/** Scroll-scrubbed frame sequence (canvas) of a 3D scanner coming apart — see motion/scan.js. */
export function Scan() {
  return (
    <section className="scan" id="precision" data-scan aria-labelledby="scan-title">
      <div className="wrap scan__inner">
        <div className="scan__head">
          <span className="eyebrow">Precision Technology</span>
          <h2 className="h-xl" id="scan-title">Precision, part by part</h2>
          <p className="lead">Modern dentistry runs on exacting digital tools. Keep scrolling to take one apart: an intraoral 3D scanner, from tip to cable.</p>
        </div>

        <div className="scan__stage">
          <img className="scan__poster" data-scan-poster data-base={asset('assets/scan')} src={asset('assets/scan/d/001.webp')} width="1600" height="900" alt="Exploded view of an intraoral 3D scanner: tip, camera head, circuit module, shells and cable connector" loading="lazy" decoding="async" />
          <canvas className="scan__canvas" aria-hidden="true" />
          {PARTS.map((p, i) => (
            <span className="scan__marker" data-scan-marker key={p.name} style={{ left: p.x + '%', top: p.y + '%' }} aria-hidden="true">{i + 1}</span>
          ))}
        </div>

        <ol className="scan__legend" data-scan-legend>
          {PARTS.map((p, i) => (
            <li key={p.name}><b>{String(i + 1).padStart(2, '0')}</b><span>{p.name}</span></li>
          ))}
        </ol>
      </div>
    </section>
  );
}
