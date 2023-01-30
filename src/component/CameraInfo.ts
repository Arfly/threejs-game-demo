import { Frustum, Matrix4 } from 'three'
import { globals } from '../global'
import { GameObject } from '../object/GameObject'
import { Component } from './Component'

export class CameraInfo extends Component {
  projScreenMatrix: Matrix4
  frustum: Frustum

  constructor(gameObject: GameObject) {
    super(gameObject)
    this.projScreenMatrix = new Matrix4()
    this.frustum = new Frustum()
  }

  update(): void {
    const { camera } = globals

    if (camera) {
      this.projScreenMatrix.multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      )
      this.frustum.setFromProjectionMatrix(this.projScreenMatrix)
    }
  }
}
