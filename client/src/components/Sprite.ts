import { defineComponent, Types } from 'bitecs'

export const Sprite = defineComponent({
	texture: Types.ui8,
	scale: Types.f32,
	scaleX: Types.f32,
	scaleY: Types.f32,
})

export default Sprite
