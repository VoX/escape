import { defineComponent, Types } from "bitecs";

export const CanCollide = defineComponent({
  collisionNormalX: Types.f32,
  collisionNormalY: Types.f32,
});

export default CanCollide;
