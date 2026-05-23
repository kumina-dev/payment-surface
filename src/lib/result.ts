export type AppResult<T, E extends string = string> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: E;
    };

export function ok<T>(data: T): AppResult<T, never> {
  return { ok: true, data };
}

export function fail<E extends string>(error: E): AppResult<never, E> {
  return { ok: false, error };
}
