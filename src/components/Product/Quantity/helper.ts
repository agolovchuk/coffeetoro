
export function quantify(quantity: number, m: number, handler: (q: number) => void) {
  return (): void => {
    const q = Math.max(quantity + m, 1);
    if (quantity !== q) {
      handler(Math.max(quantity + m, 1));
    }
  }
}

export function maybyRemove(quantity: number, onRemove: () => void) {
  return () => {
    if (quantity === 0) {
      onRemove();
    }
  }
}