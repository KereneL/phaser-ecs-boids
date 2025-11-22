import * as Phaser from "phaser";

export const Sprite = {
  gameobject: [] as Phaser.GameObjects.Sprite[],
};

export const Graphic = {
  gameobject: [] as Phaser.GameObjects.GameObject[],
};

export const Position = {
  vec2: [] as Phaser.Math.Vector2[]
};

export const Velocity = {
  maxSpeed: [] as number[],
  vec2: [] as Phaser.Math.Vector2[]
};

export const Acceleration = {
  maxForce: [] as number[],
  vec2: [] as Phaser.Math.Vector2[]
};