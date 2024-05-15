import {
  defineSystem,
  defineQuery,
  enterQuery,
  exitQuery,
  Not,
  hasComponent,
  IWorld,
} from "bitecs";
import { Bodies, Composite, Engine, Events, Pair } from "matter-js";

import CanCollide from "../components/CanCollide";
import Collidable from "../components/Collidable";
import Position from "../components/Position";
import Velocity from "../components/Velocity";

export default function createCollisionSystem(world: IWorld) {
  const collisionsById = new Map<number, MatterJS.BodyType>();
  const entityIdByMatterId = new Map<number, number>();

  const moveablesQuery = defineQuery([
    Collidable,
    Position,
    Velocity,
    CanCollide,
  ]);
  const collidiblesQuery = defineQuery([
    Collidable,
    Position,
    Not(Velocity),
    CanCollide,
  ]);
  const engine = Engine.create();
  Events.on(engine, "collisionStart", function (event) {
    for (const pair of event.pairs) {
      const entityIdA = entityIdByMatterId.get(pair.bodyA.id);
      const entityIdB = entityIdByMatterId.get(pair.bodyB.id);
      if (entityIdA !== undefined && hasComponent(world, Velocity, entityIdA)) {
        if (Math.abs(CanCollide.collisionNormalX[entityIdA]) > 0) {
          Velocity.x[entityIdA] *= -1;
          console.log("flip" + Velocity.x[entityIdA]);
        } else if (Math.abs(CanCollide.collisionNormalY[entityIdA]) > 0) {
          Velocity.x[entityIdA] = 0.015;
          console.log("set" + Velocity.x[entityIdA]);
        }
      }
      if (entityIdB !== undefined && hasComponent(world, Velocity, entityIdB)) {
        if (Math.abs(CanCollide.collisionNormalX[entityIdB]) > 0) {
          Velocity.x[entityIdB] *= -1;
          console.log("flip" + Velocity.x[entityIdB]);
        } else if (Math.abs(CanCollide.collisionNormalY[entityIdB]) > 0) {
          Velocity.x[entityIdB] = 0.015;
          console.log("set" + Velocity.x[entityIdB]);
        }
      }
      if (entityIdA !== undefined && entityIdB !== undefined) {
        CanCollide.collisionNormalX[entityIdA] = pair.collision.normal.x;
        CanCollide.collisionNormalY[entityIdA] = pair.collision.normal.y;
        CanCollide.collisionNormalX[entityIdB] = pair.collision.normal.x;
        CanCollide.collisionNormalY[entityIdB] = pair.collision.normal.y;
      }
    }
  });
  Events.on(engine, "collisionEnd", function (event) {
    for (const pair of event.pairs) {
      const entityIdA = entityIdByMatterId.get(pair.bodyA.id);
      const entityIdB = entityIdByMatterId.get(pair.bodyB.id);
      
      if (entityIdA !== undefined && entityIdB !== undefined) {
        console.log("collisionend0");
        CanCollide.collisionNormalX[entityIdA] = 0;
        CanCollide.collisionNormalY[entityIdA] = 0;
        CanCollide.collisionNormalX[entityIdB] = 0;
        CanCollide.collisionNormalY[entityIdB] = 0;
      }
    }
  });

  engine.world.gravity.y = 1;
  const moveablesQueryEnter = enterQuery(moveablesQuery);
  const collidiblesQueryEnter = enterQuery(collidiblesQuery);
  const collidiblesQueryExit = exitQuery(collidiblesQuery);

  return defineSystem((world) => {
    const movablesEntered = moveablesQueryEnter(world);
    for (let i = 0; i < movablesEntered.length; ++i) {
      const id = movablesEntered[i];
      var boxA = Bodies.rectangle(
        Position.x[id],
        Position.y[id],
        Collidable.width[id],
        Collidable.height[id]
      );
      Composite.add(engine.world, boxA);
      collisionsById.set(id, boxA);
      entityIdByMatterId.set(boxA.id, id);
    }

    const entitiesEntered = collidiblesQueryEnter(world);
    for (let i = 0; i < entitiesEntered.length; ++i) {
      const id = entitiesEntered[i];
      var boxA = Bodies.rectangle(
        Position.x[id],
        Position.y[id],
        Collidable.width[id],
        Collidable.height[id],
        { isStatic: true }
      );
      Composite.add(engine.world, boxA);
      collisionsById.set(id, boxA);
      entityIdByMatterId.set(boxA.id, id);
    }

    Engine.update(engine);

    const entities = moveablesQuery(world);
    for (let i = 0; i < entities.length; ++i) {
      var id = entities[i];
      var collisionEntity = collisionsById.get(id);
      if (collisionEntity) {
        Position.x[id] = collisionEntity.position.x;
        Position.y[id] = collisionEntity.position.y;
        collisionEntity.angle = 0;
        collisionEntity.force = { x: Velocity.x[id], y: Velocity.y[id] };
        //console.log(collisionEntity.position.x);
      }
    }

    const entitiesExited = collidiblesQueryExit(world);
    for (let i = 0; i < entitiesExited.length; ++i) {
      const id = entitiesEntered[i];
      const collisionToRemove = collisionsById.get(id);
      if (collisionToRemove) {
        Composite.remove(engine.world, [collisionToRemove]);
      }
      collisionsById.delete(id);
    }

    return world;
  });
}
