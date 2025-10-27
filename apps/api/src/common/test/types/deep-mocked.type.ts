export type DeepMocked<T> = T extends (...args: any[]) => any
  ? jest.Mock<ReturnType<T>, Parameters<T>>
  : T extends object
    ? { [K in keyof T]: DeepMocked<T[K]> }
    : T
