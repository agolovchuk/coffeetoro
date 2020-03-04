import * as t from 'io-ts';
import { LangType } from 'domain/env';
import { valueOrThrow } from 'lib/contracts';

export type Messages = Record<string, string>;

export const translation = t.record(t.string, t.string);

export const messageAdapter = (v: unknown) => valueOrThrow(translation, v);

export const getMessages = (lang: LangType): Promise<Messages> | undefined => {
  if (lang === 'ru') return import('l10n/ru').then((l) => messageAdapter(l.default));
  if (lang === 'en') return import('l10n/en').then((l) => messageAdapter(l.default));
}