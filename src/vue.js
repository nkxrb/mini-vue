import { abserver } from './abserver.js'
import { createElement } from './render.js'

function Vue (app) {

  const data = app.data()

  abserver(data)

  const vm = Object.assign(data, app.methods)
  vm.$createElement = function (...args) {
    return createElement.call(vm, vm, ...args)
  }

  vm._v = val => {
    console.log('_v-->', this)
    return val
  }

  const root = app.render ? app.render.call(vm) : ''

  const mount = selector => {
    const page = document.querySelector(selector) || document.body
    page.innerHTML = ''
    page.append(root)
  }

  return {
    mount
  }
}

// 为了更清晰的了解逻辑，会省略一些数据校验，我们都假设为正确的数据
Vue.$createElement = createElement



export default Vue
