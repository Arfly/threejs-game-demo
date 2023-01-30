import { Box3, Sphere, Vector3 } from 'three'
import { globals, models } from '../global'
import { inputManager } from '../manager/InputManager'
import { GameObject } from '../object/GameObject'
import { Component } from './Component'
import { SkinInstance } from './SkinInstance'

export const kForward = new Vector3(0, 0, 1)

export class Player extends Component {
  skinInstance: SkinInstance
  turnSpeed: number
  offscreenTimer: number
  maxTimeOffScreen = 3
  playerRadius: number

  constructor(gameObject: GameObject) {
    super(gameObject)
    const model = models.knight.gltf
    this.skinInstance = gameObject.addComponent(SkinInstance, model)
    const box = new Box3().setFromObject(model!.scene)
    this.playerRadius = box.getSize(new Vector3()).length() / 2
    this.skinInstance.setAnimation('Run')
    const { moveSpeed } = globals
    this.turnSpeed = moveSpeed ? moveSpeed / 10 : 0
    this.offscreenTimer = 0
  }

  update(): void {
    const { deltaTime, moveSpeed, cameraInfo } = globals
    if (deltaTime !== undefined && moveSpeed !== undefined) {
      const { transform } = this.gameObject
      const delta =
        (inputManager.keys.left.down ? 1 : 0) +
        (inputManager.keys.right.down ? -1 : 0)

      transform.rotation.y += this.turnSpeed * delta * deltaTime
      transform.translateOnAxis(kForward, moveSpeed * deltaTime)

      if (cameraInfo) {
        const { frustum } = cameraInfo
        if (frustum.containsPoint(transform.position)) {
          this.offscreenTimer = 0
        } else {
          this.offscreenTimer += deltaTime
          if (this.offscreenTimer >= this.maxTimeOffScreen) {
            transform.position.set(0, 0, 0)
            this.offscreenTimer = 0
          }
        }
      }
    }
  }
}
