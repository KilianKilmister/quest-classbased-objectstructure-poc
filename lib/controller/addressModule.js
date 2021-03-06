/**
 * stripped down version of the NodeJS `path`-module tweaked to fit address resolving
 */

function normalize (_path) {
  let path = _path.toString()
  validateString(path, 'path')

  if (path.length === 0) { return '.' }

  const isAbsolute = path.startsWith('ROOT')
  const trailingSeparator =
      path.charCodeAt(path.length - 1) === ':'

  if (path.length === 0) {
    if (isAbsolute) { return ':' }
    return trailingSeparator ? '.:' : '.'
  }
  if (trailingSeparator) { path += ':' }

  return isAbsolute ? `${path.slice(4)}` : path
}

function isAbsolute (path) {
  validateString(path, 'path')
  return path.length > 0 && path.startsWith('ROOT')
}

/**
 * simple joiner
 * @param {String[]} args input strings
 * @returns {String} joined Address
 */
function join (...args) {
  if (args.length === 0) { return '.' }
  let joined
  for (let i = 0; i < args.length; ++i) {
    const arg = args[i]
    validateString(arg, 'path')
    if (arg && arg.length > 0) {
      if (joined === undefined) { joined = arg } else { joined += `:${arg}` }
    }
  }
  if (joined === undefined) { return '.' }
  return normalize(joined)
}

/**
 * returns address resolved to last common ancestor
 * @param {String} from
 * @param {String} to
 * @returns {String} relative Address
 */
function relative (from, to) {
  validateString(from, 'from')
  validateString(to, 'to')
  from = from.split(':')
  to = to.split(':')

  const out = Array.from(to)

  const map = ['ROOT', 'R', 'W', 'A', 'r']

  let index = 0
  while (true) {
    if (from[index] !== to[index]) break
    out.shift()
    index++
  }
  return join(map[index - 1] || 'c', ...out)
}

function validateString (value, name) {
  if (value.split(':').length <= 1) return
  const path = value.slice(value.indexOf(':'))
  const hexRE = /^[.:0-9A-F]*$/i
  if (!hexRE.test(path)) {
    console.log(value)
    throw new Error('invalid address: `' + value + '`')
  }
}

export const qAddress = {
  normalize,
  isAbsolute,
  join,
  relative
}
