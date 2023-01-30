import { AnimationAction, AnimationMixer, Object3D } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { GameObject } from '../object/GameObject'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils'
import { globals } from '../global'
import { Component } from './Component'

export class SkinInstance extends Component {
  model: GLTF
  actions: { [name: string]: AnimationAction }
  mixer: AnimationMixer
  animRoot: Object3D
  constructor(gameObject: GameObject, model: GLTF) {
    super(gameObject)
    this.model = model
    this.actions = {}
    this.animRoot = SkeletonUtils.clone(model.scene)
    this.mixer = new AnimationMixer(this.animRoot)
    gameObject.transform.add(this.animRoot)
  }

  setAnimation(name: string) {
    const clip = this.model.animations.find(clip => clip.name === name)
    if (!clip) {
      return
    }
    for (const action of Object.values(this.actions)) {
      action.enabled = false
    }

    const action = this.mixer.clipAction(clip)
    action.enabled = true
    action.reset()
    action.play()
    this.actions[name] = action
  }

  update() {
    this.mixer.update(globals.deltaTime)
  }
}
