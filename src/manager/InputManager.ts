interface KeyState {
  down: boolean
  justPressed: boolean
}
export class InputManager {
  keys: {
    [key: string]: KeyState
  }
  keyMap: Map<number, string>
  constructor() {
    this.keys = {}
    this.keyMap = new Map()

    this.addKey(37, 'left')
    this.addKey(39, 'right')
    this.addKey(38, 'up')
    this.addKey(40, 'down')
    this.addKey(90, 'a')
    this.addKey(88, 'b')

    window.addEventListener('keydown', e => {
      this.setKeyFromKeyCode(e.keyCode, true)
    })

    window.addEventListener('keyup', e => {
      this.setKeyFromKeyCode(e.keyCode, false)
    })
  }

  setKey(keyName: string, pressed: boolean) {
    const keyState = this.keys[keyName]
    keyState.justPressed = pressed && !keyState.down
    keyState.down = pressed
  }

  addKey(keyCode: number, name: string) {
    this.keys[name] = { down: false, justPressed: false }
    this.keyMap.set(keyCode, name)
  }

  setKeyFromKeyCode(keyCode: number, pressed: boolean) {
    const keyName = this.keyMap.get(keyCode)
    if (!keyName) {
      return
    }
    this.setKey(keyName, pressed)
  }

  update() {
    for (const keyState of Object.values(this.keys)) {
      if (keyState.justPressed) {
        keyState.justPressed = false
      }
    }
  }
}

export const inputManager = new InputManager()
