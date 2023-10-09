export interface SLPaginationResult<T> {
  count: number;
  results: T[];
}

export type RequiredPick<T, K extends keyof T> = Required<Pick<T, K>>;

/**
 * Pick nested properties from an object. All T properties will be ignored except K1
 */
export type NestedPick<T, K1 extends keyof T, K2 extends keyof T[K1]> = {
  [P1 in K1]: {
    [P2 in K2]: T[K1][P2];
  };
};

/**
 * Pick nested properties from an object. Remaining T properties will be preserved
 */
export type NestedPickAll<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1]
> = NestedPick<T, K1, K2> & Omit<T, K1>;
