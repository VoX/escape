import { defineSystem, defineQuery } from "bitecs";

import CanCollide from "../components/CanCollide";
import Position from "../components/Position";
import Velocity from "../components/Velocity";

export default function createMovementSystem() {
  const movementQuery = defineQuery([Position, Velocity, CanCollide]);

  return defineSystem((world) => {
    const entities = movementQuery(world);

    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];
      //console.log(CanCollide.collisionNormalX[id]);
      if (Math.abs(CanCollide.collisionNormalX[id]) > 0) {
		  Velocity.x[id] *= -1;
		  console.log("flip" + Velocity.x[id])
      } else if (Math.abs(CanCollide.collisionNormalY[id]) > 0) {
        Velocity.x[id] = 0.015;
        console.log("set" + Velocity.x[id])
      } 
      //console.log(Velocity.x[id]);
    }

    return world;
  });
}
