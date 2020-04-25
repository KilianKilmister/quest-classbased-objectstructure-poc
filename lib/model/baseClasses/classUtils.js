import * as util from 'util'
import * as Controller from '../../controller/controller.js'

// enum listing levels
export const plains = {
  ROOT: 'root',
  REALM: 'realm',
  WORLD: 'world',
  ISOLATE: 'isolate',
  AREA: 'area',
  ROOM: 'room',
  GAME_OBJECT: 'gameObject'
}

// the most basic object
// all classes inherit from here
export class BaseObject {
  constructor (parent, options) {
    // Root check
    if (!parent && !options.isGlobalRoot) {
      throw new Error('object lacks a parent\n' + util.inspect(this))
    }
    if (options.isGlobalRoot && !!global.GLOBAL_ROOT) {
      throw new Error('Global Root allready exists')
    }
    this.plain = plains[options.plain] ? plains[options.plain] : () => { throw new Error(this + 'object needs a plain') }
    // tell parent to index mthis new child
    this.id = options.isGlobalRoot ? 'ROOT' : parent.indexNewChild(this)
    this.childNodes = []
    this.uid = Controller.getNewUID(this).then((_uid) => { this.uid = _uid })
  }

  get scope () {
    return scope(this)
  }

  // we use getters to dynamically return a value upon request
  get hasChildren () {
    return !!this.childNodes.length
  }

  get children () {
    const children = {}
    const pool = []
    const scope = this
    for (const child of scope.childNodes) {
      pool.push(child)
      if (child.hasChildren) {
        pool.push(...child.childNodes)
      }
    }
    for (const child of pool) {
      const uid = typeof child.uid === 'string' ? child.uid : child.uid.then((uid) => { return uid })
      children[uid] = new Proxy(child, {})
    }
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

// create the global ROOT object. serves as an index and controle node
global.GLOBAL_ROOT = new BaseObject(null, { isGlobalRoot: true, plain: 'ROOT' })
