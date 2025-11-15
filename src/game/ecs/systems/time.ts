

export const timeSystem = (world:any ,delta: any) => {
  const { time } = world
  time.delta = delta
  time.elapsed += delta
  time.then = performance.now()
}