import * as bitEcs from 'bitecs';

export function spriteSystem(world: any) {
  const { Sprite, Position, Velocity } = world.components
  for (const eid of bitEcs.query(world, [Sprite, Position, Velocity])) {
    const { x, y } = Position.vec2[eid];
    const gO = Sprite.gameobject[eid];

    const angle = Velocity.vec2[eid].angle();
    const frame = Math.floor(angle / (Math.PI / 4));

    gO.setPosition(x, y)
      .setFrame(frame)
  }
}