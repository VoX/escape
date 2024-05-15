import Phaser from 'phaser'
import {
	defineSystem,
	defineQuery,
	enterQuery,
	exitQuery
} from 'bitecs'

import Position from '../components/Position'
import Sprite from '../components/Sprite'
import Rotation from '../components/Rotation'
import CanCollide from '../components/CanCollide'
import Collidable from '../components/Collidable'

export default function createSpriteSystem(scene: Phaser.Scene, textures: string[]) {
	const spritesById = new Map<number, Phaser.GameObjects.Sprite>()

	const spriteQuery = defineQuery([Position, Rotation, Sprite, Collidable])
	
	const spriteQueryEnter = enterQuery(spriteQuery)
	const spriteQueryExit = exitQuery(spriteQuery)

	return defineSystem((world) => {
		const entitiesEntered = spriteQueryEnter(world)
		for (let i = 0; i < entitiesEntered.length; ++i)
		{
			const id = entitiesEntered[i]
			const texId = Sprite.texture[id]
			const texture = textures[texId]
			const scaleValueX = Sprite.scaleX[id] || Sprite.scale[id] || 1
			const scaleValueY = Sprite.scaleY[id] || Sprite.scale[id] || 1
			
			const sprite = scene.add.sprite(0, 0, texture);
			sprite.setScale(scaleValueX, scaleValueY);
			spritesById.set(id, sprite);
			Collidable.height[id] = sprite.displayHeight;
			Collidable.width[id] = sprite.displayWidth;
			
			
		}

		const entities = spriteQuery(world)
		for (let i = 0; i < entities.length; ++i)
		{
			const id = entities[i]

			const sprite = spritesById.get(id)
			if (!sprite)
			{
				// log an error
				continue
			}

			sprite.x = Position.x[id]
			sprite.y = Position.y[id]
			sprite.angle = Rotation.angle[id]
		}

		const entitiesExited = spriteQueryExit(world)
		for (let i = 0; i < entitiesExited.length; ++i)
		{
			const id = entitiesEntered[i]
			spritesById.delete(id)
		}

		return world
	})
}
