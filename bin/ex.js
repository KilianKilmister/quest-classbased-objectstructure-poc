#!/usr/bin/env node

import * as Quest from '../lib/main.js'
// node internals
import * as fs from 'fs'
import { performance } from 'perf_hooks'
// inquirer provides the CLI UI
import inquirer from 'inquirer'

// just the selection prompt powered by inquirer
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
 * simple structured generation of a game skeleton
 */
function structured () {
  const game = Quest.game
  const T0 = performance.now()
  game
    .addNewChild(new Quest.Realm()
      .addNewChild(new Quest.World()
        .addNewChild(new Quest.Area()
          .addNewChild(new Quest.Room()
            .addNewChild(new Quest.GameObject())
            .addNewChild(new Quest.GameObject())
          )
          .addNewChild(new Quest.Room()
            .addNewChild(new Quest.GameObject())
            .addNewChild(new Quest.GameObject())
          )
        )
        .addNewChild(new Quest.Area()
          .addNewChild(new Quest.Room()
            .addNewChild(new Quest.GameObject())
            .addNewChild(new Quest.GameObject())
          )
          .addNewChild(new Quest.Room()
            .addNewChild(new Quest.GameObject())
            .addNewChild(new Quest.GameObject())
          )
        )
      )
    )

  // result logging
  console.log('-------- result ---------')
  process.env.finished = true
  console.log('A grand total of ' + Object.keys(game.children).length + ' objects in ' + Math.round(performance.now() - T0) + 'ms.')
  fs.writeFile('./structuredResult.json', JSON.stringify(game, jsonReplacer, 2), (err) => {
    if (err) throw err
    console.log('done')
  })
}

/**
 * more advanced objectStructure generator
 */
async function unstructured () {
  const T0 = performance.now()
  const game = Quest.game
  // store objects to randomly select parent and calculate result logging
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
      console.log('\nGenerated')
      console.log('- ' + R + ' realms,')
      console.log('- ' + I + ' isolates,')
      console.log('- ' + W + ' worlds,')
      console.log('- ' + A + ' areas,')
      console.log('- ' + r + ' rooms,')
      console.log('- ' + G + ' game objects,')
      console.log('A grand total of ' + Object.keys(game.children).length + ' objects in ' + Math.round(T1 - T0) + 'ms.')
    }
  }

  // generators
  await generate(Quest.Realm, 1, 2)
  await generate(Quest.World, 5, 40, 'realm')
  await generate(Quest.Area, 10, 80, 'world')
  await generate(Quest.Room, 10, 200, 'area')
  await generate(Quest.GameObject, 1000, 20000, 'room')
  await generate(Quest.GameObject, 20, 200, 'gameObject')
  const T1 = performance.now()
  const all = Object.assign([], index.area, index.gameObject, index.realm, index.room, index.world)

  // Log when done
  console.log('-------- result ---------')
  index.report()
  for (let i = 0; i < 4; i++) {
    const a = getRandomElement(all)
    const b = getRandomElement(all)
    console.log('>> ' + a.address)
    console.log('>> ' + b.address)
    console.log('>> ' + a.getRelativeAddress(b))
  }
  process.env.finished = true
  fs.writeFile('./unstructuredResult.json', JSON.stringify(game, jsonReplacer, 2), (err) => {
    if (err) throw err
    console.log('done')
  })

  /**
   * helper
   * @param {Class} ObjectClass
   * @param {number} min
   * @param {number} max
   * @param {string} _parent
   */
  async function generate (ObjectClass, min, max, _parent) {
    const limit = random(min, max)
    let i = 0

    do {
      const parent = getRandomElement(index[_parent]) || game
      const obj = new ObjectClass()
      parent.addNewChild(obj)
      index[obj.plain].push(obj)
      i++
    }
    while (i < limit)
  }
}

/**
 * helper
 * @param {Array} choices
 * @returns random element from input array
 */
function getRandomElement (choices) {
  if (!choices) return false
  const rand = random(0, choices.length || 0)
  const x = Math.floor(rand)
  const y = choices[x]
  return y
}

/**
 * helper
 * @param {number} _min
 * @param {number} _max
 * @returns random number between min and max
 */
function random (_min, _max) {
  return _min + Math.random() * (_max - _min)
}

let childNodes = 0
let cache = 0
/**
 * helper to condense the JSON.stringify for writing to file
 * @param {string} key
 * @param {any} value
 */
function jsonReplacer (key, value) {
  if (key === 'parent') return undefined
  if (key === 'childNodes' && typeof value !== 'string') {
    if (childNodes === 0) { childNodes++; return value }
    return value.map(child => {
      return `{ ${child.plain} }`
    })
  }
  if (key === 'cache' && typeof value !== 'string') {
    if (cache === 0) {
      cache++
      const _obj = {}
      for (const obj in value) {
        _obj[obj] = `{ ${value[obj].plain} }`
      }
      return _obj
    } else {
      return '...(omitted for size)'
    }
  }
  return value
}
