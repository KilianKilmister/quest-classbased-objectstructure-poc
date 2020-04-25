import { BaseObject } from './classUtils.js'
import * as GO from './gameObjectClasses.js'
import * as qAddress from '../../controller/addressModule.js'

// objects on the scale of Room and up used for mapping
export class WorldObject extends BaseObject {
  constructor (parent, options) {
    super(parent, { ...options, hidden: true })
  }
}

// realms, the top most division effectively the root for to be used for almost anything
export class Realm extends WorldObject {
  constructor (options) {
    super(global.GLOBAL_ROOT, { ...options, plain: 'REALM' })
    // a realm needs a World- and Isolate-object to be of real use
    new World(this)
    new Isolate(this)
  }
}

// worlds form the common top-division, setting the majority of env-variables and keeping them semi-static
export class World extends WorldObject {
  constructor (parent, options) {
    super(parent, { ...options, plain: 'WORLD' })
    // a world needs an Area-object to be of real use
    new Area(this)
  }
}

// the Isolate is comparable to a combined world- and room-object.
// it provides a space without any world-level-env-variables or direct access to data contained in the worlds.
// it can be used for anything where the abstract datastructure of a realm makes no sense.
// it can be configured dynamically on usage and will do a clean reset afterwards
export class Isolate extends WorldObject { // todo: integrate with realm creation so Isolate doesn't have to be exported
  constructor (Realm, options) {
    super(Realm, { ...options, plain: 'ISOLATE' })
  }
}

// an area is a collection of rooms that need to regularly exchange information with eachother
// in contrast to the other WorldObject derrived classes it serves as a connector instead of a divider
// todo: implement a smart way for rooms to belong to multiple areas
export class Area extends WorldObject {
  constructor (World, options) {
    super(World, { ...options, plain: 'AREA' })
    new Room(this)
  }
}

// the room object on smallest divider derived from WorldObject
export class Room extends WorldObject {
  constructor (Area, options) {
    super(Area, { ...options, plain: 'ROOM' })
    // a room should start with some kind of default entrance to be accessable
    new GO.Exit(this, null, { entranceOnly: true, hidden: true })
  }

  // getter to return all the children that are exits
  get exit () {
    const children = Object.values(this.childNodes)
    return children.map((child) => {
      if (child instanceof GO.Exit) return child
    })
  }
}
