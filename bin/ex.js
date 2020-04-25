#!/usr/bin/env node

import * as Quest from '../lib/main.js'
// node internals
import * as util from 'util'
import { performance } from 'perf_hooks'
// inquirer provides the CLI UI
import inquirer from 'inquirer'
import chalk from 'chalk'

// just the selection prompt
console.log(process.env)
if (!process.env.DEBUG) {
  inquirer.prompt([{
    type: 'list',
    name: 'script',
    message: 'choose which script to run',
    choices: ['unstructured', 'structured']
  }]).then(answer => {
    answer.script === 'structured' ? structured() : unstructured()
  })
} else unstructured()
/**
 * simple structured generation of a bare bone objectStructure
 */
function structured () {
  const T0 = performance.now()
  const realm = new Quest.model.Realm()

  const world = new Quest.model.World(realm)

  // area
  const areaA = new Quest.model.Area(world)

  const roomA = new Quest.model.Room(areaA)
  const objectA1 = new Quest.model.GameObject(roomA, { hidden: false })
  const objectA2 = new Quest.model.GameObject(roomA, { hidden: false })

  const roomB = new Quest.model.Room(areaA)
  const objectB1 = new Quest.model.GameObject(roomB, { hidden: false })
  const objectB2 = new Quest.model.GameObject(roomB, { hidden: false })

  // area
  const areaX = new Quest.model.Area(world)

  const roomX = new Quest.model.Room(areaX)
  const objectX1 = new Quest.model.GameObject(roomX, { hidden: false })
  const objectX2 = new Quest.model.GameObject(roomX, { hidden: false })

  const roomY = new Quest.model.Room(areaX)
  const objectY1 = new Quest.model.GameObject(roomY, { hidden: false })
  const objectY2 = new Quest.model.GameObject(roomY, { hidden: false })

  // result logging
  console.log('-------- result ---------')
  // pick random object
  const randObj = getRandomElement(global.GLOBAL_ROOT.children)
  console.log(chalk.cyan('test address getter:'))
  console.log('Object: ' + randObj.plain)
  console.log('Address: ' + randObj.address)
  console.log('A grand total of ' + Object.keys(global.GLOBAL_ROOT.children).length + ' objects in ' + Math.round(performance.now() - T0) + 'ms.')
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
  await generate(Quest.model.Realm, 2, 10, null)
  await generate(Quest.model.World, 5, 20, 'realm')
  await generate(Quest.model.Area, 10, 40, 'world')
  await generate(Quest.model.Room, 10, 100, 'area')
  await generate(Quest.model.GameObject, 100, 1000, 'room')
  await generate(Quest.model.GameObject, 50, 500, 'gameObject')
  const all = Object.assign([], index.area, index.gameObject, index.realm, index.room, index.world)

  // Log when donw
  console.log('-------- result ---------')
  console.log(util.inspect(global.GLOBAL_ROOT.children, false, 0, true))
  ;['a', 'b', 'c', 'd'].forEach(element => {
    element = getRandomElement(all)
    console.log(element.plain + ' -> ' + Quest.getGlobalAddress)
  })
  index.report()
  console.log(util.inspect(global.GLOBAL_ROOT.children, false, 0, true))

  // helper
  async function generate (ObjectClass, min, max, _parent) {
    const limit = random(min, max)
    let i = 0

    // generator
    do {
      const parent = getRandomElement(index[_parent])
      const obj = new ObjectClass(parent)
      index[obj.plain].push(obj)
      i++
    }
    while (i < limit)
  }
}

// helpers
function getRandomElement (choices) {
  if (!choices) return
  const rand = random(0, choices.length || 0)
  const x = Math.floor(rand)
  const y = choices[x]
  return y
}
function random (_min, _max) {
  return _min + Math.random() * (_max - _min)
}
