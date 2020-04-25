import { BaseObject } from './classUtils.js'
import * as WO from './worldObjectClasses.js'
import * as Address from '../../controller/addressModule.js'

// the base object for anything that needs to be actively manipulated
// in contrast to WorldObjects, these actively expose and share data about themselves within their division
export class GameObject extends BaseObject {
  constructor (Room, options) {
    super(Room, { ...options, plain: 'GAME_OBJECT' })
    // this.isHidden = options.hidden || false
  }
}

// an object serving as an accesss node for a room
// it can be linked to any other exit or an abstract concept if needed
// these links are not subject to the dividers formed by WorldObject
export class Exit extends GameObject {
  constructor (Room, destination, options) {
    super(Room, { ...options })
    // this.locked = locked || false
    this.isEntranceOnly = !!options.entranceOnly
    this.isOneWay = !!options.oneWay
    if (destination) this.destination = destination
  }

  // setter to create a link between two exits
  // it's powerfull in that it can change properties of the remote
  set destination (remote) {
    if (remote instanceof WO.Room) {
      return remote.genericEntrance
    } else {
      if (!this.isOneWay || !remote.isEntranceOnly) remote.destination = this
      return remote
    }
  }
}

// items, furniture, NPC/Player and the like will also be derrived from GameObject
