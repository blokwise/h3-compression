type ToAsyncHandler<
  T extends readonly unknown[],
> = {
  [K in keyof T]: (() => Promise<T[K]>)
}

export async function concurrent<T extends readonly unknown[]>(
  tasks: ToAsyncHandler<T>,
): Promise<T> {
  return await Promise.all(tasks.map(async (task) => {
    // eslint-disable-next-line no-console
    console.log('shoot')
    return await task()
  })) as unknown as T
}
