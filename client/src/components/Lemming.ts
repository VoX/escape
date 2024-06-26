import { defineComponent, Types } from 'bitecs'

export const Lemming = defineComponent({
	timeBetweenActions: Types.ui32,
	accumulatedTime: Types.ui32
})

export default Lemming
