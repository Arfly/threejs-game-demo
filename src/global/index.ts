import { AnimationClip, OrthographicCamera, PerspectiveCamera } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { CameraInfo } from '../component/CameraInfo'

interface Global {
  time: number
  deltaTime: number
  moveSpeed: number
  camera: PerspectiveCamera
  cameraInfo: CameraInfo
}
export const globals: Partial<Global> = {
  time: 0,
  deltaTime: 0,
  moveSpeed: 16
}

export const models: {
  [key: string]: {
    url: string
    gltf?: GLTF
    animations?: {
      [key: string]: AnimationClip
    }
  }
} = {
  pig: { url: 'resources/models/animals/Pig.gltf' },
  cow: { url: 'resources/models/animals/Cow.gltf' },
  llama: { url: 'resources/models/animals/Llama.gltf' },
  pug: { url: 'resources/models/animals/Pug.gltf' },
  sheep: { url: 'resources/models/animals/Sheep.gltf' },
  zebra: { url: 'resources/models/animals/Zebra.gltf' },
  horse: { url: 'resources/models/animals/Horse.gltf' },
  knight: { url: 'resources/models/knight/KnightCharacter.gltf' }
}
