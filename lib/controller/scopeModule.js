import { model } from '../main.js'

export function scope (thisArg) {
  const self = thisArg || model.GLOBAL_ROOT
  console.log(self)
}

global.uidDictionary = {}
export async function getNewUID (self) {
  if (!global.uidDictionary[self.plain]) global.uidDictionary[self.plain] = {}
  const dictionary = global.uidDictionary[self.plain]
  const uid = await new Promise((resolve, reject) => {
    let id = ''
    do {
      var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      }
      id = 'UID_' + S4() + S4() + '-' + S4() + '-' + S4()
    }
    while (dictionary[id])
    resolve(id)
    reject(new Error('uid_module failed'))
  })
  dictionary[uid] = new Proxy(self, {})
  return uid
}
