import Watcher from './watcher.js'
import { abserver, proxy } from './abserver.js'
import { callhook } from './lifecycle.js'
import { createElement } from './render.js'
import { merger } from './shared.js'

export function init (vm) {

  initApi(vm)
  callhook(vm, 'beforeCreate')
  initData(vm)
  callhook(vm, 'created')
}

function initData (vm) {
  // 初始化顺序：props,methods,data,computed,watch
  const ops = vm.$options
  const props = initProps(vm, ops.props)
  const methods = initMethods(vm, ops.methods)

  if (typeof ops.data === 'function') {
    const data = ops.data()
    vm._data = data
    // 省略props、methods同属性值时，会覆盖的提示
    for (let key in data) {
      proxy(vm, '_data', key)
    }
    // 将data改造成响应式的
    abserver(data)
  }

  // 初始化watch
  if (ops.watch) {
    initWatch(vm, ops.watch)
  }
}

function initWatch (vm, watch) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        new Watcher(vm, key, handler[i])
      }
    } else {
      new Watcher(vm, key, handler)
    }
  }

}

function initMethods (vm, methods) {
  merger(vm, methods)
  return methods
}

function initProps (vm, props) {
  merger(vm, props)
  return props
}

function initApi (vm) {
  // 定义渲染函数，app的render函数中需要用到
  vm.$createElement = function (...args) {
    return createElement.call(vm, vm, ...args)
  }

  vm._v = val => {
    return val
  }
  vm._s = val => val != null ? val.toString() : ''

  vm._e = () => ''

  vm._l = (list, fn) => {
    let res = []
    list.forEach((n, i) => {
      res.push(fn(n, i))
    })
    return res
  }

  vm._self = vm
}