import { PerspectiveCamera } from 'three'

const fov = 45
const aspect = 2 // the canvas default
const near = 0.1
const far = 100
const camera = new PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 20, 40)

export default camera
