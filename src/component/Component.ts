import { GameObject } from '../object/GameObject'

export class Component {
  gameObject: GameObject

  constructor(gameObject: GameObject) {
    this.gameObject = gameObject
  }

  update() {}
}
