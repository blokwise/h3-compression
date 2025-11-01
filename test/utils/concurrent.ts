type ToAsyncHandler<
  T extends readonly unknown[],
> = {
  [K in keyof T]: (() => Promise<T[K]>)
}

export async function concurrent<T extends readonly unknown[]>(
  tasks: ToAsyncHandler<T>,
): Promise<T> {
  return await Promise.all(tasks.map(async (task) => {
    return await task()
  })) as unknown as T
}
