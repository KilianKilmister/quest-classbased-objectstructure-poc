import { BaseObject } from './classUtils.js'
import * as WO from './worldObjectClasses.js'

/** Bare Bones, was not the focus of this PoC
 *the base object for anything that needs to be actively manipulated
 * in contrast to WorldObjects, these actively expose and share data about themselves within their division
 * @export
 * @class GameObject
 * @extends {BaseObject}
 */
export class GameObject extends BaseObject {
  /**
   *Creates an instance of GameObject.
   * @param {object} options
   * @memberof GameObject
   */
  constructor (options) {
    super({ hidden: false, plain: 'GAME_OBJECT', ...options })
    // this.isHidden = options.hidden || false
  }
}

/** Bare Bones, was not the focus of this PoC
 * an object serving as an access node for a room
 * it can be linked to any other exit or an abstract concept if needed
 * these links are not subject to the dividers formed by WorldObject
 * @export
 * @class Exit
 * @extends {GameObject}
 */
export class Exit extends GameObject {
  /**
   *Creates an instance of Exit.
   * @param {object} destination
   * @param {object} options
   * @memberof Exit
   */
  constructor (destination, options) {
    super({ ...options, plain: 'EXIT' })
    // this.locked = locked || false
    this.isEntranceOnly = !!options.entranceOnly
    this.isOneWay = !!options.oneWay
    if (destination) this.destination = destination
  }

  // setter to create a link between two exits
  // it's powerful in that it can change properties of the remote
  set destination (remote) {
    if (remote instanceof WO.Room) {
      return remote.genericEntrance
    } else {
      if (!this.isOneWay || !remote.isEntranceOnly) remote.destination = this
      return remote
    }
  }
}

// items, furniture, NPC/Player and the like will also be derived from
// GameObject
