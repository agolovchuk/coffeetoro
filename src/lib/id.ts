import generate from 'nanoid/generate';
import url from 'nanoid/url';

export function getId(size: number) {
  return generate(url, size);
}