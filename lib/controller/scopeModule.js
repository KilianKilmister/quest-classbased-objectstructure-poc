export const UIDDictionary = {}

/**
 * uid generator and indexer
 * @export
 * @param {*} self
 * @returns self
 */
export function indexNew (self) {
  let uid
  do {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    uid = S4() + S4() + '-' + S4() + '-' + S4()
  }
  while (UIDDictionary[uid])
  if (self.isGlobalRoot) {
    uid = 'ROOT'
  }
  UIDDictionary[uid] = self
  self.uid = uid
  return self
}

/**
 * scope an object by it's UID
 * @export
 * @param {*} uid
 * @returns
 */
export function getObjectFromUID (uid) {
  return UIDDictionary[uid]
}
