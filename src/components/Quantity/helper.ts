
export function quantify(quantity: number, m: number, handler: (q: number) => void) {
  return () => handler(Math.max(quantity + m, 1));
}

export function valueNormalize(value: string): number {
  const n = parseInt(value, 10)
  return isNaN(n) ? 0 : n;
}

export function maybyRemove(quantity: number, onRemove: () => void) {
  return () => {
    if (quantity === 0) {
      onRemove();
    }
  }
}