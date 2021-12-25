import { abserver } from './abserver.js'
import { patch } from './patch.js'
import { createElement } from './render.js'
import { noop } from './shared.js'
import Watcher from './watcher.js'
function Vue (app) {

  const data = app.data()
  // 将data改造成响应式的
  abserver(data)
  // 将methods也合并到vm中，方便获取
  const vm = Object.assign(data, app.methods)

  // 定义渲染函数，app的render函数中需要用到
  vm.$createElement = function (...args) {
    return createElement.call(vm, vm, ...args)
  }

  vm._v = val => {
    return val != null ? val.toString() : ''
  }

  function updateComponent () {
    const container = vm.container
    // 调用render函数，获得虚拟dom节点
    const vnode = app.render ? app.render.call(vm) : ''
    patch(vm._vnode, vnode, container, vm)
  }


  const $mount = selector => {
    const page = document.querySelector(selector) || document.body
    vm.container = page
    // 声明一个全局监听对象，记录app渲染时的操作,当vm中，依赖属性发生变化时，触发updateComponent函数重新渲染
    vm._watcher = new Watcher(vm, updateComponent, noop)
  }

  return {
    $mount
  }
}

// 为了更清晰的了解逻辑，会省略一些数据校验，我们都假设为正确的数据
Vue.$createElement = createElement

export default Vue
