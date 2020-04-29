/**
 * main class module
 * @module Class-Module
 */
import { qAddress, indexNew } from '../../controller/controller.js'

/**
 * @const {Object} enum listing Plains
 */
export const plains = {
  ROOT: 'root',
  REALM: 'realm',
  WORLD: 'world',
  ISOLATE: 'isolate',
  AREA: 'area',
  ROOM: 'room',
  GAME_OBJECT: 'gameObject',
  EXIT: 'exit'
}

/**
 * @const {Object} enum for error templating
 * *not properly implemented*
 */
const qErr = {
  /**
   * some error presets, unfinished
   */
  noPermission (target, property, receiver) {
    return new Error(`!>> ${receiver} doesn't have permission to access ${property} of ${target}`)
  }
}

/**
 * Proxy handler that wraps every object. can check permissions and can be used to store
 * values that should not be known to the object itself like absolute Address
 */
export class BaseProxy {
  /**
   * getter trap. [Link]
   */
  get (target, propertyKey, receiver) {
    if (process.env.finished) return Reflect.get(...arguments)
    if (preCheck(target, propertyKey, receiver)) return Reflect.get(...arguments)
    if (!this.checkPermission(target, propertyKey, receiver)) {
      throw qErr.noPermission(target, propertyKey, receiver)
    }
    switch (true) {
      case /^address$/i.test(propertyKey): {
        if (target.id === 'ROOT') return 'ROOT'
        return qAddress.join(this.parent.address, this.id)
      } default:
        return Reflect.get(...arguments)
    }
    function preCheck (target, propertyKey, receiver) {
      return propertyKey === ('uuid' ||
      'permission') || false
    }
  }

  /**
   * setter trap. [Link]
   */
  set (target, propertyKey, value, receiver) {
    switch (true) {
      case /^address$/i.test(propertyKey): {
        this.address = value
        return true
      } case /^parent$/i.test(propertyKey): {
        this.parent = value
        return true
      } case /^id$/i.test(propertyKey): {
        this.id = value
        return Reflect.set(...arguments)
      } default:
        return Reflect.set(...arguments)
    }
  }

  /**
   * not really implemented yet
   */
  checkPermission (target, propertyKey, receiver) {
    return true // FIXME
  }
}

/**
 * the most basic object every object in game inherits from
 */
export class BaseObject {
  /**
   *Creates an instance of BaseObject, it's proxy, and gives it a UID
   * @param {object} options - options object
   */
  constructor (options = {}) {
    // root check
    if (options.isGlobalRoot && !!game) {
      throw new Error('Global Root already exists')
    }
    if (options.isGlobalRoot) {
      this.id = 'ROOT'
      this.isGlobalRoot = true
    }
    this.plain = plains[options.plain]
      ? plains[options.plain]
      : () => { throw new Error(this + ' object needs a plain') }
    return indexNew(new Proxy(this, new BaseProxy()))
  }

  // we use getters to dynamically return a value upon request
  get hasChildren () {
    return !!this.childCache
  }

  /**
   *  resolves the absolute address of two objects and reduces it to the last
   *  common node
   * @param {Object} target
   * @returns {String} relative address
   */
  getRelativeAddress (target) {
    return qAddress.relative(this.address, target.address)
  }

  /**
   * getter that updates the cache and returns all the direct and indirect
   * children. Bare bones at this point
   * @readonly
   */
  get children () {
    return Object.values(this.childCache.getCache())
  }

  /**
   * basic function to add an object to a node
   * @param {Object|Object[]} children
   * @returns {Object} itself
   * @memberof BaseObject
   */
  addNewChild (...children) {
    if (!this.childCache) this.childCache = new ChildCache(this)
    if (!children) this.childCache.update()
    else this.childCache.add(...children)
    return this
  }
}

/**
 * Caching object that handles updating and distribution of child nodes.
 * Somewhat bare-bones
 */
class ChildCache {
  /**
   *Creates an instance of ChildCache.
   * @param {Object} parent
   * @param {Object} options
   */
  constructor (parent, options) {
    this.cache = {}
    this.parent = parent
    this.hasChanged = true
  }

  /**
   * assigns unique-within-scope id to child
   * @param {Object} child
   */
  assignID (child) {
    let id = 0x0
    while (id in this.childNodes) {
      id += 0x1
    }
    child.id = id.toString(16)
  }

  /**
   * basic cache update-function, needs fleshing out to optimise memory usage
   */
  update () {
    if (!this.hasChanged) return
    for (const child of this.childNodes) {
      this.cache[child.uuid] = child
      if (child.childCache) {
        Object.assign(this.cache, child.childCache.getCache())
      }
    }
    this.hasChanged = false
  }

  /**
   * force-updating cache
   */
  forceUpdate () {
    this.hasChanged = true
    this.update()
  }

  /**
   * getter + force-update, needs optimization
   * @returns {Object} cache-object
   */
  getCache () {
    this.forceUpdate() // FIXME
    return this.cache
  }

  /**
   * basic internal node adder
   * @param {Object} children
   */
  async add (...children) {
    if (!this.childNodes) this.childNodes = []
    for (const child of children) {
      child.parent = this.parent
      this.assignID(child)
      this.childNodes.push(child)
    }
    this.forceUpdate()
  }
}

/**
 * @const {Object} The Main Game-Instance
*/
export var game = new BaseObject({ isGlobalRoot: true, plain: 'ROOT' })
/**
 *  [Link]:<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler>
 */
