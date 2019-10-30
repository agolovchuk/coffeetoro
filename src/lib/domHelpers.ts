export type CSSStylesType = ReadonlyArray<{ name: string, value: string | null }>;

export function scrollBarWidth(): string {
  const width = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || (document.body && document.body.clientWidth);
  return `${(width || 0) - ((document.body && document.body.offsetWidth) || 0)}px`;
}

export function updateStyle(el: HTMLElement | null, val: CSSStylesType) {
  val.forEach((prop) => {
    if (el) el.style.setProperty(prop.name, prop.value);
  });
}

export function bodyToggler(isOpened: boolean) {
  const { body } = document;
  if (body) {
    if (!isOpened) {
      updateStyle(body, [
        { name: 'overflow', value: 'hidden' },
        { name: 'padding-right', value: scrollBarWidth() },
      ]);
    } else {
      updateStyle(body, [
        { name: 'overflow', value: null },
        { name: 'padding-right', value: null },
      ]);
    }
  }
}
