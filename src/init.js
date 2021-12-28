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
    return val != null ? val.toString() : ''
  }

  vm._l = (list, fn) => {
    let res = []
    list.forEach((n, i) => {
      res.push(fn(n, i))
    })
    return res
  }
}