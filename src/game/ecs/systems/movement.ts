import * as bitEcs from 'bitecs';

export function movementSystem(world: any) {
  const { Position, Velocity, Acceleration } = world.components
  const deltaTime = world.time.delta * 0.1
  // const normAccelerationVector = new Phaser.Math.Vector2(0, 0)

  for (const eid of bitEcs.query(world, [Position, Velocity, Acceleration])) {
    Acceleration.vec2[eid]
      .limit(Acceleration.max[eid])
      .scale(deltaTime)
    Velocity.vec2[eid]
      .add(Acceleration.vec2[eid])
      .limit(Velocity.max[eid])
      .scale(deltaTime)
    Position.vec2[eid]
      .add(Velocity.vec2[eid]);

    if (Position.vec2[eid].x > 1024) Position.vec2[eid].x -= 1024
    if (Position.vec2[eid].x < 0) Position.vec2[eid].x += 1024

    if (Position.vec2[eid].y > 768) Position.vec2[eid].y -= 768
    if (Position.vec2[eid].y < 0) Position.vec2[eid].y += 768
  }
}