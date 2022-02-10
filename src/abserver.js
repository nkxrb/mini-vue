import Dep from "./dep.js"
import { def, isObject } from "./shared.js"

const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
const hasProto = '__proto__' in {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) { // inserted为新增的元素，如果是对象的话，需要进行响应式改造
      // 因为inserted是数组
      defineArray(inserted)
    }
    // notify change
    ob.dep.notify()
    return result
  })
})

export function abserver (data) {

  // 对响应式对象进行标记
  data.__ob__ = {
    value: data,
    dep: new Dep(),
    vmCount: 0
  }

  // 如果是数组，修改对象的__proto__,主要作用是在调用数组方法时，可以进行拦截操作，从而实现数组的响应
  if (Array.isArray(data)) {
    // 拦截该数组对象的方法调用，从而监听每个数组元素响应变化
    console.log(123)
    if (hasProto) { // 如果平台支持__proto__属性，则直接修改__proto__即可
      protoAugment(data, arrayMethods)
    } else { // 如果不支持__proto__，则需要对每个属性进行重新赋值操作-copy
      copyAugment(data, arrayMethods, arrayKeys)
    }
    // 对现有的数组元素进行响应式遍历
    defineArray(data)
  } else {
    for (let key in data) {
      if (key === '__ob__') {
        return
      }
      defineReactive(data, key, data[key])
    }
  }

}

function protoAugment (target, src) {
  target.__proto__ = src
}

function copyAugment (target, src, keys) {

}

function defineArray (arr) {
  for (let i = 0; i < arr.length; i++) {
    defineReactive(arr, i, arr[i])
  }
}

function defineReactive (obj, key, val) {

  if (isObject(obj[key])) { // 如果该值是对象，则进行递归响应
    // 递归响应，通过__ob__属性判断，防止嵌套循环
    !obj[key].__ob__ && abserver(obj[key])
  }

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  // 创建一个依赖对象
  let dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      // 将count添加到依赖中
      const value = getter ? getter.call(obj) : val
      dep.depend()
      if (value.__ob__) {
        value.__ob__.dep.depend()
      }
      return val
    },
    set: function (newVal) {
      val = newVal
      // 当设置新值时，触发依赖
      if (isObject(newVal)) {
        // 每次赋值新值时，都重新将新对象进行响应转换
        abserver(newVal)
      }
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
