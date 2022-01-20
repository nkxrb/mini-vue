import { createElement } from './render.js'
import { patch } from './patch.js'
import { noop } from './shared.js'
import Watcher from './watcher.js'
import { init } from './init.js'
import { callhook } from './lifecycle.js'
function Vue (app) {

  const vm = { $options: app }
  init(vm)

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
    callhook(vm, 'beforeMount')
    updateComponent()
    callhook(vm, 'mounted')
  }

  return {
    $mount
  }
}

// 为了更清晰的了解逻辑，会省略一些数据校验，我们都假设为正确的数据
Vue.$createElement = createElement

export default Vue
