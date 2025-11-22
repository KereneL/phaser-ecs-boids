import * as Phaser from "phaser";
import * as bitEcs from "bitecs";
import { createThisWorld, updateWorld } from '../ecs/ecs';

export class Game extends Phaser.Scene {
  private world: bitEcs.World
  private boidColor: Phaser.Display.Color
  constructor() {
    super("Game");
  }

  preload() {
    this.load.spritesheet("hover-bug", '/HoverBug.png', { frameWidth: 24, frameHeight: 24 })
  }

  create() {
    this.world = createThisWorld(this);
    this.seedWorldWithBoids(this.world, 100);
  }

  private seedWorldWithBoids(world: bitEcs.World, boidAmount: number) {

    for (let i = 0; i < boidAmount; i++) {
      this.boidColor = Phaser.Display.Color.HSLToColor(0.11, 1, Phaser.Math.Linear(0.25, 0.55, i / boidAmount))
      this.createBoid(world)
    }
  }
  private createBoid(world: bitEcs.World) {
    const { Sprite, Graphic, Position, Velocity, Acceleration } = this.world.components
    let { width, height } = this.sys.game.canvas;
    const boid = bitEcs.addEntity(world);

    bitEcs.addComponent(world, boid, Position);
    const pX = Math.round(Phaser.Math.RND.between(0, width));
    const pY = Math.round(Phaser.Math.RND.between(0, height));
    Position.vec2[boid] = new Phaser.Math.Vector2(pX, pY)

    bitEcs.addComponent(world, boid, Velocity);
    Velocity.maxSpeed[boid] = 4;
    const vX = Phaser.Math.RND.realInRange(-1, 1);
    const vY = Phaser.Math.RND.realInRange(-1, 1);
    Velocity.vec2[boid] = new Phaser.Math.Vector2(vX, vY)

    bitEcs.addComponent(world, boid, Acceleration);
    Acceleration.maxForce[boid] = 1;
    Acceleration.vec2[boid] = new Phaser.Math.Vector2();

    const rnd = Math.random();
    if (rnd > 0.5) {
      bitEcs.addComponent(world, boid, Graphic);
      Graphic.gameobject[boid] = this.add.rectangle(0, 0, 16, 4, this.boidColor.color)
    } else {
      bitEcs.addComponent(world, boid, Sprite);
      Sprite.gameobject[boid] = this.add.sprite(0, 0, "hover-bug")
    }
  }
  update(_time: any, delta: any) {
    updateWorld(this.world, delta)
  }
}