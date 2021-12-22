
export function abserver (data) {
  for (let key in data) {

  }
}

function defineReactive (obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      return val
    },
    set: function (newVal) {
      val = newVal
    }
  })
}