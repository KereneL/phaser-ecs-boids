import * as bitEcs from 'bitecs';

export function graphicsSystem(world: any) {
  const { Graphic, Position, Velocity } = world.components
  for (const eid of bitEcs.query(world, [Graphic])) {
    const { x, y } = Position.vec2[eid]
    Graphic.gameobject[eid].setPosition(x,y)
    Graphic.gameobject[eid].setRotation(Velocity.vec2[eid].angle())
  }
}