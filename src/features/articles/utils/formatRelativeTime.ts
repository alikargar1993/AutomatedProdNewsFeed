const MIN = 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

export function formatRelativeTime(unixSeconds: number): string {
  const thenMs = unixSeconds * 1000;
  const diffSec = Math.floor((Date.now() - thenMs) / 1000);
  if (diffSec < 45) {
    return 'just now';
  }
  if (diffSec < MIN) {
    return `${diffSec}s ago`;
  }
  const min = Math.floor(diffSec / MIN);
  if (min < 60) {
    return `${min}m ago`;
  }
  const h = Math.floor(diffSec / HOUR);
  if (h < 24) {
    return `${h}h ago`;
  }
  const d = Math.floor(diffSec / DAY);
  if (d < 7) {
    return `${d}d ago`;
  }
  const w = Math.floor(diffSec / WEEK);
  if (w < 5) {
    return `${w}w ago`;
  }
  const mo = Math.floor(diffSec / (DAY * 30));
  if (mo < 12) {
    return `${mo}mo ago`;
  }
  const y = Math.floor(diffSec / (DAY * 365));
  return `${y}y ago`;
}
