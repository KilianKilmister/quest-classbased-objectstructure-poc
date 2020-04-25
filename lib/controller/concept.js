import util from 'util'

function guidGenerator () {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return ('_' + S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

function document () {
}

function head (params) {
  return 'head' + guidGenerator()
}

function body (...params) {
  return 'body' + guidGenerator()
}

const p = (params) => {
  return 'p' + guidGenerator()
}
var arg = 'someString'

class Generator {
  static generate () {

  }
}

// Generator.generate(
const template = {
  [head`dis`]: {

  },
  [body`someShit ${arg}`]: {
    [p()]: { text: 'sometext' },
    [p()]: {},
    [p()]: {},
    [p()]: {},
    [p()]: {},
    [p()]: {},
    [p()]: {},
    [p()]: {}
  }
}
//  })

console.log(util.inspect(template, true, null, true))
