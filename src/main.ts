import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Color,
  DirectionalLight,
  LoadingManager,
  Object3D,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  Vector3,
  WebGLRenderer
} from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils'

import './index.css'
import { globals, models } from './global'
import { GameObjectManager } from './manager/GameObjectManager'
import { Player } from './component/Player'
import { inputManager } from './manager/InputManager'
import { CameraInfo } from './component/CameraInfo'
import { Animal } from './component/Animal'

const gameObjectManager = new GameObjectManager()

const canvas = document.querySelector('#c') as HTMLCanvasElement
const renderer = new WebGLRenderer({ canvas })
renderer.outputEncoding = sRGBEncoding

const fov = 45
const aspect = 2 // the canvas default
const near = 0.1
const far = 100
const camera = new PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 20, 40)
globals.camera = camera

const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 5, 0)
controls.update()

const scene = new Scene()
scene.background = new Color('white')

function addLight(x: number, y: number, z: number) {
  const color = 0xffffff
  const intensity = 0.8
  const light = new DirectionalLight(color, intensity)
  light.position.set(x, y, z)
  scene.add(light)
  scene.add(light.target)
}
addLight(5, 5, 2)
addLight(-5, 5, 5)

const manager = new LoadingManager()

manager.onLoad = () => {
  prepModelsAndAnimations()

  const cameraObject = gameObjectManager.createGameObject(camera, 'camera')
  const cameraInfo = cameraObject.addComponent(CameraInfo)
  globals.cameraInfo = cameraInfo

  const gameObject = gameObjectManager.createGameObject(scene, 'player')
  gameObject.addComponent(Player)

  const animalModelNames = [
    'pig',
    'cow',
    'llama',
    'pug',
    'sheep',
    'zebra',
    'horse'
  ]

  animalModelNames.forEach((name, index) => {
    const gameObject = gameObjectManager.createGameObject(scene, name)
    gameObject.addComponent(Animal, models[name].gltf)
    gameObject.transform.position.x = (index + 1) * 5
  })
}

const mixers: AnimationMixer[] = []
interface MixerInfo {
  mixer: AnimationMixer
  actions: AnimationAction[]
  actionNdx: number
}
const mixerInfos: MixerInfo[] = []

function playNextAction(mixerInfo: MixerInfo) {
  const { actions, actionNdx } = mixerInfo
  const nextActionNdx = (actionNdx + 1) % actions.length
  mixerInfo.actionNdx = nextActionNdx
  actions.forEach((action, ndx) => {
    const enabled = ndx === nextActionNdx
    action.enabled = enabled
    if (enabled) {
      action.play()
    }
  })
}

function prepModelsAndAnimations() {
  Object.values(models).forEach(model => {
    console.log('------>:', model.url)
    const animationByName: {
      [name: string]: AnimationClip
    } = {}
    model.gltf?.animations.forEach(clip => {
      animationByName[clip.name] = clip
      console.log('       ', clip.name)
    })
    model.animations = animationByName
  })

  Object.values(models).forEach((model, ndx) => {
    const clonedScene = SkeletonUtils.clone(model.gltf!.scene)
    // const root = new Object3D()
    // root.add(clonedScene)
    // scene.add(root)
    // root.position.x = (ndx - 3) * 3

    if (model.animations) {
      const mixer = new AnimationMixer(clonedScene)
      const actions = Object.values(model.animations).map(clip => {
        return mixer.clipAction(clip)
      })
      const mixerInfo = {
        mixer,
        actions,
        actionNdx: -1
      }
      mixerInfos.push(mixerInfo)
      // playNextAction(mixerInfo)
    }
  })
}

manager.onProgress = (url, loaded, total) => {
  console.log(((loaded / total) * 100) | 0)
}

const gltfLoader = new GLTFLoader(manager)

for (const model of Object.values(models)) {
  gltfLoader.load(model.url, (gltf: GLTF) => {
    model.gltf = gltf
  })
}

function resizeRendererToDisplaySize(renderer: WebGLRenderer) {
  const canvas = renderer.domElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    renderer.setSize(width, height, false)
  }
  return needResize
}

let then = 0
function render(now: DOMHighResTimeStamp) {
  globals.time = now * 0.001
  globals.deltaTime = Math.min(globals.time - then, 1 / 20)
  now *= 0.001 // convert to seconds
  const deltaTime = now - then
  then = globals.time

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }

  gameObjectManager.update()
  inputManager.update()
  renderer.render(scene, camera)

  requestAnimationFrame(render)
}

requestAnimationFrame(render)

window.addEventListener('keydown', e => {
  const mixerInfo = mixerInfos[e.keyCode - 49]
  if (mixerInfo) {
    playNextAction(mixerInfo)
  }
})
