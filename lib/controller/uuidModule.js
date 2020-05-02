/**
 * *should probably be integrated into ROOT object*
 */
export const UIDDictionary = {}

/**
 * uuid generator and indexer
 * @param {Object} self
 * @returns {Object} self
 */
export function indexNew (self) {
  let uuid
  do {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    uuid = S4() + S4() + '-' + S4() + '-' + S4()
  }
  while (UIDDictionary[uuid])
  if (self.isGlobalRoot) {
    uuid = 'ROOT'
  }
  UIDDictionary[uuid] = self
  self.uuid = uuid
  return self
}

/**
 * scope an object by it's UUID
 * @param {string} uuid
 * @returns {Object} target object
 */
export function getObjectFromUID (uuid) {
  return UIDDictionary[uuid]
}
