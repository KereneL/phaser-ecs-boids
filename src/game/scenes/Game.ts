import * as Phaser from "phaser";
import * as bitEcs from "bitecs";
import { createThisWorld, updateWorld } from '../ecs/ecs';

export class Game extends Phaser.Scene {
  constructor() {
    super("Game");
    this.world = createThisWorld();
  }

  preload() {}

  create() {
    seedWorldWithBoids(this, 1000);
  }

  update(_time: any, delta: any) {
    updateWorld(this.world, delta)
  }
  
  addGraphic(){
    return this.add.rectangle(0, 0, 20, 5, 0xffffff)
  }
}

function seedWorldWithBoids(scene: any, boidAmount: number) {
  const { world } = scene;
  const { Graphic, Position, Velocity, Acceleration } = world.components

  for (let i = 0; i < boidAmount; i++) {
    const boid = bitEcs.addEntity(world);
    
    bitEcs.addComponent(world, boid, Position);
    const pX = Math.round(Phaser.Math.RND.between(0, 1024));
    const pY = Math.round(Phaser.Math.RND.between(0, 768));
    Position.vec2[boid] = new Phaser.Math.Vector2(pX, pY)

    bitEcs.addComponent(world, boid, Velocity);
    Velocity.max[boid] = 2
    Velocity.vec2[boid] = new Phaser.Math.Vector2(0, 0)

    bitEcs.addComponent(world, boid, Acceleration);
    const aX = Phaser.Math.RND.realInRange(-1, 1);
    const aY = Phaser.Math.RND.realInRange(-1, 1);
    Acceleration.max[boid] = 1
    Acceleration.vec2[boid] = new Phaser.Math.Vector2(aX, aY);

    bitEcs.addComponent(world, boid, Graphic);
    Graphic.gameobject[boid] = scene.addGraphic()
  }
}