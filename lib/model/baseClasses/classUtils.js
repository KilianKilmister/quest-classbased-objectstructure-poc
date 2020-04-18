import * as Address from '../addressModule.js'
import * as util from 'util'

// enum listing levels
export const plains = {
  ROOT: 'root',
  REALM: 'realm',
  WORLD: 'world',
  ISOLATE: 'isolate',
  AREA: 'area',
  ROOM: 'room',
  GAMEOBJECT: 'gameObject'
}

// the most basic object
// all classes inherit from here
export class BaseObject {
  constructor (parent, options) {
    // Root check
    if (!parent && !options.isGlobalRoot) {
      throw new Error('object lacks a parent\n' + util.inspect(this))
    }
    this.plain = plains[options.plain] || null
    // tell parent to index mthis new child
    this.id = options.isGlobalRoot ? 'ROOT' : parent.indexNewChild(this)
    this.childNodes = []
  }

  // we use getters to dynamically return a value upon request
  get hasChildren () {
    return !!this.childNodes.length
  }

  // children getter iterates over every child recursively and returns an object containing relative-address/childObject pairs.
  get children () {
    // return if object has no children
    if (!this.hasChildren) return {}
    const children = {}
    // iterate over children
    this.childNodes.forEach(child => {
      children[child.id] = child
      // iterate over grandchildren if any
      if (child.hasChildren) {
        // map each level of nesting to an objects ID and format to relative address
        Object.entries(child.children).forEach(pair => {
          const address = Address.join(child.id, pair[0])
          const obj = pair[1]
          children[address] = obj
        })
      }
    })
    return children
  }

  // assign unique childID to child
  indexNewChild (child) {
    if (!this.childNodes) this.childNodes = []
    let id = 0x0
    while (this.childNodes.find(child => { return parseInt(child.id, 16) === id })) {
      id++
    }
    this.childNodes.push(child)
    return id.toString(16)
  }

  // not used
  // -----
  // get containers () {
  //   if (!this.containers.length && this.hasChildren) {
  //     return {
  //       name: 'constainer',
  //       content: []
  //     }
  //   } else {
  //     return this.containers
  //   }
  // }
  // ----
}
