import Phaser from 'phaser'
import {
	defineSystem,
	defineQuery,
} from 'bitecs'

import Lemming from '../components/Lemming'
import Velocity from '../components/Velocity'
import Rotation from '../components/Rotation'
import Input, { Direction} from '../components/Input'

export default function createSystem(scene: Phaser.Scene) {
	const cpuQuery = defineQuery([Lemming, Velocity, Rotation, Input])

	return defineSystem((world) => {
		const entities = cpuQuery(world)
		const dt = scene.game.loop.delta
		for (let i = 0; i < entities.length; ++i)
		{
			const id = entities[i]
			
			Lemming.accumulatedTime[id] += dt

			if (Lemming.accumulatedTime[id] < Lemming.timeBetweenActions[id])
			{
				continue
			}

			Lemming.accumulatedTime[id] = 0

			switch (Phaser.Math.Between(0, 200))
			{
				// left
				case 0:
				{
					Input.direction[id] = Direction.Right
					break
				}

				// right
				case 1:
				{
					Input.direction[id] = Direction.Left

					break
				}
				
				
				// // up
				// case 2:
				// {
				// 	Input.direction[id] = Direction.Up
				// 	break
				// }

				// // down
				// case 3:
				// {
				// 	Input.direction[id] = Direction.Down
				// 	break
				// }

				// default:
				// {
				// 	Input.direction[id] = Direction.Right

				// 	break
				// }
			}
		}
	
		return world
	})
}
