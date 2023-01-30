import { Box3, Object3D, Sphere, Vector3 } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { globals, models } from '../global'
import { GameObject } from '../object/GameObject'
import { FiniteStateMachine } from '../utils/FiniteStateMachine'
import { Component } from './Component'
import { kForward } from './Player'
import { SkinInstance } from './SkinInstance'

function isClose(
  obj1: Object3D,
  obj1Radius: number,
  obj2: Object3D,
  obj2Radius: number
): boolean {
  return obj1.position.distanceTo(obj2.position) < obj1Radius + obj2Radius
}

const delta = new Vector3()

function aimTowardAndGetDistance(
  source: Object3D,
  targetPos: Vector3,
  maxTurn: number
) {
  return 1
}

export class Animal extends Component {
  fsm: FiniteStateMachine

  constructor(gameObject: GameObject, model: GLTF) {
    super(gameObject)
    const boundingBox = new Box3().setFromObject(model.scene)
    const hitRadius = boundingBox.getSize(new Vector3()).length() / 2
    const transform = gameObject.transform

    const skinInstance = gameObject.addComponent(SkinInstance, model)
    if (globals.moveSpeed !== undefined) {
      skinInstance.mixer.timeScale = globals.moveSpeed / 4
      skinInstance.setAnimation('Idle')
    }

    if (!globals.player || globals.moveSpeed === undefined) return

    const playerTransform = globals.player.gameObject.transform
    const maxTurnSpeed = (Math.PI * globals.moveSpeed) / 4
    const targetHistory: Vector3[] = []
    let targetIndex = 0

    function addHistory() {
      const targetGO = globals.congaLine[targetIndex]
      if (targetGO) {
        const newTargetPos = new Vector3()
        newTargetPos.copy(targetGO.transform.position)
        targetHistory.push(newTargetPos)
      }
    }

    this.fsm = new FiniteStateMachine(
      {
        idle: {
          enter: () => {
            skinInstance.setAnimation('idle')
          },
          update: () => {
            if (
              globals.player &&
              isClose(
                transform,
                hitRadius,
                globals.player.gameObject.transform,
                globals.player.playerRadius
              )
            ) {
              this.fsm.transition('waitForEnd')
            }
          }
        },
        waitForEnd: {
          enter: () => {
            skinInstance.setAnimation('jump')
          },
          update: () => {
            const lastGo = globals.congaLine[globals.congaLine.length - 1]
            const deltaTurnSpeed = maxTurnSpeed * globals.deltaTime
            const targetPos = lastGo.transform.position
            aimTowardAndGetDistance(transform, targetPos, deltaTurnSpeed)
            if (
              globals.player &&
              isClose(
                transform,
                hitRadius,
                lastGo.transform,
                globals.player.playerRadius
              )
            ) {
              this.fsm.transition('goToLast')
            }
          }
        },
        goToLast: {
          enter: () => {
            targetIndex = globals.congaLine.length - 1
            globals.congaLine.push(gameObject)
            skinInstance.setAnimation('Walk')
          },

          update: () => {
            addHistory()
            const targetPos = targetHistory[0]
            const maxVelocity = globals.moveSpeed * globals.deltaTime

            const deltaTurnSpeed = maxTurnSpeed * globals.deltaTime

            const distance = aimTowardAndGetDistance(
              transform,
              targetPos,
              deltaTurnSpeed
            )

            const velocity = distance
            transform.translateOnAxis(kForward, Math.min(velocity, maxVelocity))

            if (distance <= maxVelocity) {
              this.fsm.transition('follow')
            }
          }
        },
        follow: {
          update: () => {
            addHistory()
            const targetPos = targetHistory.shift()
            if (targetPos) {
              transform.position.copy(targetPos)
              const deltaTurnSpeed = maxTurnSpeed * globals.deltaTime
              aimTowardAndGetDistance(
                transform,
                targetHistory[0],
                deltaTurnSpeed
              )
            }
          }
        }
      },
      'idle'
    )
  }

  update(): void {
    this.fsm.update()
  }
}
