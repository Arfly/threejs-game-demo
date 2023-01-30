import { Object3D } from 'three'
import { GameObject } from '../object/GameObject'
import { SaferArray } from '../utils/SafeArray'

export class GameObjectManager {
  gameObjects: SaferArray<GameObject>

  constructor() {
    this.gameObjects = new SaferArray()
  }

  createGameObject(parent: Object3D, name: string) {
    const gameObject = new GameObject(parent, name)
    this.gameObjects.add(gameObject)
    return gameObject
  }

  /**
   * It removes a game object from the game object list
   * @param {GameObject} gameObject - The game object to remove from the scene.
   */
  removeGameObject(gameObject: GameObject) {
    this.gameObjects.remove(gameObject)
  }

  update() {
    this.gameObjects.forEach(gameObject => gameObject.update())
  }
}
