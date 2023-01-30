import { Object3D } from 'three'
import { Component } from '../component/Component'

export class GameObject {
  public name: string
  public components: Component[]
  public transform: Object3D

  constructor(parent: Object3D, name: string) {
    this.name = name
    this.components = []
    this.transform = new Object3D()
    console.log(this.transform)
    parent.add(this.transform)
  }

  addComponent(ComponentType: any, ...args: any) {
    const component = new ComponentType(this, ...args)
    this.components.push(component)
    return component
  }

  removeComponent(component: Component) {
    const ndx = this.components.indexOf(component)
    if (ndx >= 0) {
      this.components.splice(ndx, 1)
    }
  }

  getComponent(ComponentType: any) {
    return this.components.find(comp => comp instanceof ComponentType)
  }

  update() {
    for (const component of this.components) {
      component.update()
    }
  }
}
