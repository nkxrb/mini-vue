
export function abserver (data) {
  for (let key in data) {
    defineReactive(data, key, data[key])
  }
}

function defineReactive (obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      console.log('ab-->', this)
      return val
    },
    set: function (newVal) {
      val = newVal
    }
  })
}