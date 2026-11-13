import { SPRITE } from '../data/sprite.js';

/** Icon from the inline sprite. Decorative: always aria-hidden (buttons carry their own labels). */
export function Icon({ name, className = '', style }) {
  return (
    <svg className={`ic ${className}`.trim()} aria-hidden="true" style={style}>
      <use href={`#i-${name}`} />
    </svg>
  );
}

/** Inline SVG symbol sprite (static, trusted markup defined in data/sprite.js). */
export function IconSprite() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false"
      dangerouslySetInnerHTML={{ __html: SPRITE }} />
  );
}
