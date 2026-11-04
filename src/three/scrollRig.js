import { MathUtils } from 'three';

// The character fills this box, in model units. Its centre sits this high above the feet.
export const SUBJECT = { width: 1.85, height: 1.95, centerY: 0.92 };
export const CAMERA_DISTANCE = 10;

const FILL = 0.95;
const TURN_TO_TEXT = 0.45;
const LEAVE_TURN = 0.6;
const LEAVE_TILT = 0.12;
const MID_ZOOM = 0.12;

const smoothstep = (t) => t * t * (3 - 2 * t);
const centre = (rect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

// Works out where the character should be for the current scroll position, from two page elements:
// the empty box in the hero and the empty space beside the About text. Reading them every frame
// keeps the character lined up at any screen size, so nothing needs recalculating on resize.
export function computeRig({ hero, about, viewport, fov, motion }) {
  const heroRect = hero.getBoundingClientRect();
  const aboutRect = about?.getBoundingClientRect();
  const hasStage = motion && aboutRect && aboutRect.width > 0 && aboutRect.height > 0;

  // 0 at the top of the page, 1 once the About space is centred on screen.
  let travel = 0;
  // 0 while About is centred, 1 once it has scrolled most of the way off the top.
  let leave = 0;
  if (hasStage) {
    const distance = centre(aboutRect).y - heroRect.top - viewport.height / 2;
    travel = MathUtils.clamp(-heroRect.top / distance, 0, 1);
    leave = MathUtils.clamp((viewport.height / 2 - centre(aboutRect).y) / (viewport.height * 0.8), 0, 1);
  }
  const eased = smoothstep(travel);

  const from = centre(heroRect);
  const to = hasStage ? centre(aboutRect) : from;
  const box = {
    x: MathUtils.lerp(from.x, to.x, eased),
    y: MathUtils.lerp(from.y, to.y, eased),
    width: hasStage ? MathUtils.lerp(heroRect.width, aboutRect.width, eased) : heroRect.width,
    height: hasStage ? MathUtils.lerp(heroRect.height, aboutRect.height, eased) : heroRect.height,
  };

  // Screen pixels to world units on the plane the character stands on.
  const worldPerPx = (2 * CAMERA_DISTANCE * Math.tan(MathUtils.degToRad(fov) / 2)) / viewport.height;
  const zoom = 1 + Math.sin(eased * Math.PI) * MID_ZOOM;
  const scale =
    Math.min((box.height * FILL) / SUBJECT.height, (box.width * FILL) / SUBJECT.width) * worldPerPx * zoom;

  const visible =
    box.y + box.height / 2 > 0 && box.y - box.height / 2 < viewport.height && box.width > 0 && box.height > 0;

  return {
    x: (box.x - viewport.width / 2) * worldPerPx,
    y: -(box.y - viewport.height / 2) * worldPerPx - SUBJECT.centerY * scale,
    scale,
    // A full turn on the way down, ending turned towards the About text.
    rotationY: eased * (Math.PI * 2 + TURN_TO_TEXT) + smoothstep(leave) * LEAVE_TURN,
    rotationX: smoothstep(leave) * LEAVE_TILT,
    face: { x: box.x, y: box.y - box.height * 0.3 },
    visible,
  };
}
