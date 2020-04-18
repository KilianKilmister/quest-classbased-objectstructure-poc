#!/usr/bin/env node
import * as src from '../lib/main.js'
// node internals
import * as util from 'util'
import { performance } from 'perf_hooks'
// inquirer provides the CLI UI
import inquirer from 'inquirer'

// just the selection prompt
inquirer.prompt([{
  type: 'list',
  name: 'script',
  message: 'choose which script to run',
  choices: ['unstructured', 'structured']
}]).then(answer => {
  answer.script === 'structured' ? structured() : unstructured()
})

/**
 * simple structured generation of a bare bone objectStructure
 */
function structured () {
  const T0 = performance.now()
  const realm = new src.Realm()

  const world = new src.World(realm)

  // area
  const areaA = new src.Area(world)

  const roomA = new src.Room(areaA)
  const objectA1 = new src.GameObject(roomA, { hidden: false })
  const objectA2 = new src.GameObject(roomA, { hidden: false })

  const roomB = new src.Room(areaA)
  const objectB1 = new src.GameObject(roomB, { hidden: false })
  const objectB2 = new src.GameObject(roomB, { hidden: false })

  // area
  const areaX = new src.Area(world)

  const roomX = new src.Room(areaX)
  const objectX1 = new src.GameObject(roomX, { hidden: false })
  const objectX2 = new src.GameObject(roomX, { hidden: false })

  const roomY = new src.Room(areaX)
  const objectY1 = new src.GameObject(roomY, { hidden: false })
  const objectY2 = new src.GameObject(roomY, { hidden: false })

  // result logging
  console.log('-------- result ---------')
  console.log(util.inspect(src.GLOBAL_ROOT.children, false, 0, true))
  console.log('A grand total of ' + Object.keys(src.GLOBAL_ROOT.children).length + ' objects in ' + Math.round(performance.now() - T0) + 'ms.')
}

/**
 * more advanced objectStructure generator
 */
async function unstructured () {
  const T0 = performance.now()
  // store objects to randomly select parent and calculate resultlogging
  const index = {
    realm: [],
    world: [],
    area: [],
    room: [],
    gameObject: [],
    // logging function
    report () {
      const R = this.realm.length
      const I = R
      const W = this.world.length + R
      const A = this.area.length + W
      const r = this.room.length + A
      const G = this.gameObject.length + r
      const T = R + I + W + A + r + G
      console.log('\nGenerated')
      console.log('- ' + R + ' realms,')
      console.log('- ' + I + ' isolates,')
      console.log('- ' + W + ' worlds,')
      console.log('- ' + A + ' areas,')
      console.log('- ' + r + ' rooms,')
      console.log('- ' + G + ' game objects,')
      console.log('A grand total of ' + T + ' objects in ' + Math.round(performance.now() - T0) + 'ms.')
    }
  }

  // generators
  await generate(src.Realm, 2, 10, null)
  await generate(src.World, 2, 20, 'realm')
  await generate(src.Area, 10, 40, 'world')
  await generate(src.Room, 10, 100, 'area')
  await generate(src.GameObject, 100, 1000, 'room')
  await generate(src.GameObject, 50, 500, 'gameObject')

  // Log when donw
  console.log('-------- result ---------')
  console.log(util.inspect(src.GLOBAL_ROOT.children, false, null, true))
  return index.report()

  // helper
  async function generate (ObjectClass, min, max, _parent) {
    const limit = random(min, max)
    let i = 0

    // generator
    do {
      const parent = getRandomParent()
      const obj = new ObjectClass(parent)
      index[obj.plain].push(obj)
      i++
    }
    while (i < limit)

    // helpers
    function random (_min, _max) {
      return _min + Math.random() * (_max - _min)
    }
    function getRandomParent () {
      const choices = {
        ...index[_parent]
      }
      const rand = random(0, choices.lenght || 0)
      return choices[Math.floor(rand)]
    }
  }
}
