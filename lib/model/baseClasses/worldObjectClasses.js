/**
 * {@link module:Class-Module}
 */
import { BaseObject } from './classUtils.js'
import * as GO from './gameObjectClasses.js'

/** Bare-Bones. not the focus of this PoC
 * objects on the scale of Room and up used for mapping
 * @extends {BaseObject}
 */
class WorldObject extends BaseObject {
  /**
   *Creates an instance of WorldObject.
   * @param {object} options
   * @memberof WorldObject
   */
  constructor (options) {
    super({ ...options, hidden: true })
  }
}

/** Bare-Bones. not the focus of this PoC
 * realms, the top most division effectively the root to be used for almost anything
 * @extends {WorldObject}
 */
class Realm extends WorldObject {
  /**
   *Creates an instance of Realm.
   * @param {object} options
   * @memberof Realm
   */
  constructor (options) {
    super({ ...options, plain: 'REALM' })
    // a realm needs a World- and Isolate-object to be of real use
    this.addNewChild(
      new World(),
      new Isolate()
    )
  }
}

/** Bare-Bones. not the focus of this PoC
 * worlds form the common top-division, setting the majority of env-variables and keeping them semi-static
 * @extends {WorldObject}
 */
class World extends WorldObject {
  /**
   *Creates an instance of World.
   * @param {object} options
   * @memberof World
   */
  constructor (options) {
    super({ ...options, plain: 'WORLD' })
    // a world needs an Area-object to be of real use
    this.addNewChild(new Area())
  }
}

/** Bare-Bones. not the focus of this PoC
 * the Isolate is comparable to a combined world- and room-object.
 * it provides a space without any world-level-env-variables or direct access to data contained in the worlds.
 * it can be used for anything where the abstract data-structure of a realm makes no sense.
 * it can be configured dynamically on usage and will do a clean reset afterwards
 * @extends {WorldObject}
 */
class Isolate extends WorldObject { // todo: integrate with realm creation so Isolate doesn't have to be exported
  /**
   *Creates an instance of Isolate.
   * @param {object} options
   * @memberof Isolate
   */
  constructor (options) {
    super({ ...options, plain: 'ISOLATE' })
  }
}

/** Bare-Bones. not the focus of this PoC
 * an area is a collection of rooms that need to regularly exchange information with each other
 * in contrast to the other WorldObject derived classes it serves as a connector instead of a divider
 * todo: implement a smart way for rooms to belong to multiple areas
 * @extends {WorldObject}
 */
class Area extends WorldObject {
  /**
   *Creates an instance of Area.
   * @param {object} options
   * @memberof Area
   */
  constructor (options) {
    super({ ...options, plain: 'AREA' })
    this.addNewChild(new Room())
  }
}

/** Bare-Bones. not the focus of this PoC
 * the room object on smallest divider derived from WorldObject
 * @extends {WorldObject}
 */
class Room extends WorldObject {
  /**
   *Creates an instance of Room.
   * @param {object} options
   * @memberof Room
   */
  constructor (options) {
    super({ ...options, plain: 'ROOM' })
    // a room should start with some kind of default entrance to be accessible
    this.addNewChild(new GO.Exit(null, { entranceOnly: true, hidden: true }))
  }

  get exit () {
    const children = Object.values(this.childNodes)
    return children.map((child) => {
      if (child instanceof GO.Exit) return child
    })
  }
}

export {
  WorldObject,
  Realm,
  World,
  Isolate,
  Area,
  Room
}
