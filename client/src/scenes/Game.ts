import Phaser from "phaser";
import { createWorld, addEntity, addComponent } from "bitecs";

import type { IWorld, System } from "bitecs";

import CanCollide from "../components/CanCollide";
import Collidable from "../components/Collidable";
import Input from "../components/Input";
// import Lemming from "../components/Lemming";
import Position from "../components/Position";
import Rotation from "../components/Rotation";
import Sprite from "../components/Sprite";
import Velocity from "../components/Velocity";

import createCollisionSystem from "../systems/collision";
import createCPUSystem from "../systems/cpu";
// import createLemmingSystem from "../systems/lemming";
import createMovementSystem from "../systems/movement";
import createPlayerSystem from "../systems/player";
import createSpriteSystem from "../systems/sprite";

enum Textures {
  Lemming,
  Background,
  Ground,
}

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private world!: IWorld;
  private playerSystem!: System;
  private cpuSystem!: System;
  private movementSystem!: System;
  private spriteSystem!: System;
  private collisionSystem!: System;
  // private lemmingSystem!: System;

  constructor() {
    super("game");
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload() {
    // background
    this.load.image("background", "assets/background.png");
		// floor/wall
    this.load.image("ground", "assets/ground.png");
    // lemming
    this.load.image("lemming", "assets/lemming.png");
    this.load.image("lemming-left", "assets/lemming_left.png");
  }

  create() {
    const { width, height } = this.scale;
    this.world = createWorld();

    // background
    this.add.image(width / 2, height / 2, "background");

    // create the walls
    const wallLeft = addEntity(this.world);
    addComponent(this.world, Position, wallLeft);
    addComponent(this.world, Collidable, wallLeft);
    addComponent(this.world, Sprite, wallLeft);
    addComponent(this.world, CanCollide, wallLeft);
    addComponent(this.world, Rotation, wallLeft);
    Position.x[wallLeft] = 0;
    Position.y[wallLeft] = 0;
    Sprite.texture[wallLeft] = Textures.Ground;
    Sprite.scaleY[wallLeft] = height;
    Sprite.scaleX[wallLeft] = 5;
	
    const wallRight = addEntity(this.world);
    addComponent(this.world, Position, wallRight);
    addComponent(this.world, Collidable, wallRight);
    addComponent(this.world, Sprite, wallRight);
    addComponent(this.world, CanCollide, wallRight);
    addComponent(this.world, Rotation, wallRight);
    Position.x[wallRight] = width - 10;
    Position.y[wallRight] = 0;
    Sprite.texture[wallRight] = Textures.Ground;
    Sprite.scaleY[wallRight] = height;
    Sprite.scaleX[wallRight] = 5;
	
	
    // create the ground
    const ground = addEntity(this.world);
    addComponent(this.world, Position, ground);
    addComponent(this.world, Collidable, ground);
    addComponent(this.world, Sprite, ground);
    addComponent(this.world, CanCollide, ground);
    addComponent(this.world, Rotation, ground);
    Position.x[ground] = 0;
    Position.y[ground] = height - 10;
    Sprite.texture[ground] = Textures.Ground;
    Sprite.scaleY[ground] = 5;
    Sprite.scaleX[ground] = width * 2;

    // create the lemming
    const lemming = addEntity(this.world);
    addComponent(this.world, Position, lemming);
    addComponent(this.world, Velocity, lemming);
    addComponent(this.world, Collidable, lemming);
    addComponent(this.world, Rotation, lemming);
    addComponent(this.world, Sprite, lemming);
    // addComponent(this.world, Lemming, lemming);
    addComponent(this.world, CanCollide, lemming);
    // Lemming.timeBetweenActions[lemming] = Phaser.Math.Between(0, 20);
    addComponent(this.world, Input, lemming);
    Velocity.x[lemming] = 0.01;

    Collidable.height[lemming] = 100;
    Collidable.width[lemming] = 100;
    Position.x[lemming] = 150;
    Position.y[lemming] = 100;
    Sprite.texture[lemming] = Textures.Lemming;
    Sprite.scale[lemming] = 0.2;

    // create the systems
    this.playerSystem = createPlayerSystem(this.cursors);
    this.cpuSystem = createCPUSystem(this);
    this.movementSystem = createMovementSystem();
    this.spriteSystem = createSpriteSystem(this, [
      "lemming",
      "background",
      "ground",
    ]);
    this.collisionSystem = createCollisionSystem(this.world);
    // this.lemmingSystem = createLemmingSystem(this);
  }

  update(t: number, dt: number) {
    this.spriteSystem(this.world);
    
    // run each system in desired order
    this.playerSystem(this.world);

    // this.lemmingSystem(this.world);

    this.collisionSystem(this.world);

    this.cpuSystem(this.world);

    //this.movementSystem(this.world);

   
  }
}
