import * as Phaser from "phaser";
import * as bitEcs from "bitecs";
import { createThisWorld, updateWorld } from '../ecs/ecs';

export class Game extends Phaser.Scene {
  private world: bitEcs.World
  private boidColor: Phaser.Display.Color
  constructor() {
    super("Game");
  }

  preload() { }

  create() {
    console.log(this.boidColor)
    this.world = createThisWorld();
    this.seedWorldWithBoids(this.world, 100);
  }

  private seedWorldWithBoids(world: bitEcs.World, boidAmount: number) {

    for (let i = 0; i < boidAmount; i++) {
      this.boidColor = Phaser.Display.Color.HSLToColor(0.11, 1, Phaser.Math.Linear(0.25, 0.55, i / boidAmount))
      this.createBoid(world)
    }
  }
  private createBoid(world: bitEcs.World) {
    const { Graphic, Position, Velocity, Acceleration } = this.world.components
    const boid = bitEcs.addEntity(world);

    bitEcs.addComponent(world, boid, Position);
    const pX = Math.round(Phaser.Math.RND.between(0, 1024));
    const pY = Math.round(Phaser.Math.RND.between(0, 768));
    Position.vec2[boid] = new Phaser.Math.Vector2(pX, pY)

    bitEcs.addComponent(world, boid, Velocity);
    Velocity.maxSpeed[boid] = 4;
    Velocity.vec2[boid] = new Phaser.Math.Vector2()

    bitEcs.addComponent(world, boid, Acceleration);
    const aX = Phaser.Math.RND.realInRange(-1, 1);
    const aY = Phaser.Math.RND.realInRange(-1, 1);
    Acceleration.maxForce[boid] = 1;
    Acceleration.vec2[boid] = new Phaser.Math.Vector2(aX, aY);

    bitEcs.addComponent(world, boid, Graphic);
    Graphic.gameobject[boid] = this.add.rectangle(0, 0, 20, 5, this.boidColor.color)
  }
  update(_time: any, delta: any) {
    updateWorld(this.world, delta)
  }
}