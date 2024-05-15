import { defineComponent, Types } from "bitecs";

export const Collidable = defineComponent({
  width: Types.f32,
  height: Types.f32,
});

export default Collidable;
