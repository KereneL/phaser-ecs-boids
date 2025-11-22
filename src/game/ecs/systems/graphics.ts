import * as bitEcs from 'bitecs';

export function graphicsSystem(world: any) {
  const { Graphic, Position, Velocity } = world.components
  for (const eid of bitEcs.query(world, [Graphic, Position, Velocity])) {
    const { x, y } = Position.vec2[eid];
    const gO = Graphic.gameobject[eid];

    const angle = Velocity.vec2[eid].angle();

    gO.setPosition(x, y)
      .setRotation(angle)
  }
}