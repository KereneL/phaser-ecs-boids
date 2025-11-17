import * as bitEcs from "bitecs";
import { Graphic, Position, Velocity, Acceleration } from "./components/components";
import { timeSystem } from "./systems/time";
import { flockSystem } from "./systems/flocking";
import { movementSystem } from "./systems/movement";
import { graphicsSystem } from "./systems/graphics";

export function createThisWorld(scene: Phaser.Scene):bitEcs.World {
  return bitEcs.createWorld({
    components: { Graphic, Position, Velocity, Acceleration },
    time: {
      delta: 0,
      elapsed: 0,
      then: 0
    },
    scene,
  });
}

export function updateWorld(world: any, deltaTime: any) {
  timeSystem(world, deltaTime);
  flockSystem(world)
  movementSystem(world);
  graphicsSystem(world);
}