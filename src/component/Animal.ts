import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { globals } from '../global'
import { GameObject } from '../object/GameObject'
import { Component } from './Component'
import { SkinInstance } from './SkinInstance'

export class Animal extends Component {
  constructor(gameObject: GameObject, model: GLTF) {
    super(gameObject)
    const skinInstance = gameObject.addComponent(SkinInstance, model)
    if (globals.moveSpeed !== undefined) {
      skinInstance.mixer.timeScale = globals.moveSpeed / 4
      skinInstance.setAnimation('Idle')
    }
  }
}
