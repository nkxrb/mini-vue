import Dep from "./dep.js"

export function abserver (data) {
  for (let key in data) {
    defineReactive(data, key, data[key])
  }
}

function defineReactive (obj, key, val) {
  // 创建一个依赖对象
  let dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      // 将count添加到依赖中
      dep.depend()
      return val
    },
    set: function (newVal) {
      val = newVal
      // 在v0.0.1版本中，此处是写死的 button.innerText = newVal, 为了通用，我们这里用一个函数代替
      // 如下notify() 将实现button.innerText = newVal操作，但是button没法获取到，因此需要在get时进行收集
      dep.notify()
    }
  })
}

/**
 * 将data的属性代理到vm._data中去
 * @param {*} obj 
 * @param {*} sourceKey 
 * @param {*} key 
 */
export function proxy (obj, sourceKey, key) {
  function getProp () {
    return this[sourceKey][key]
  }

  function setProp (val) {
    this[sourceKey][key] = val
  }

  Object.defineProperty(obj, key, {
    get: getProp,
    set: setProp
  })
}