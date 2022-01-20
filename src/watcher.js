import { pushTarget, popTarget } from './dep.js'
import { watcherqueue } from './scheduler.js'
import { noop } from './shared.js'

let uid = 0
class Watcher {
  constructor(vm, expOrFn, cb, val) {
    this.id = ++uid
    this.vm = vm
    this.expOrFn = expOrFn
    this.cb = cb
    this.deps = []
    this.depIds = new Set()
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      // 如果是string，解析对象属性，$router.path, 返回一个函数
      this.getter = parsePath(expOrFn)
      // 如果getter没解析到, 给getter赋值一个默认空函数
      if (!this.getter) {
        this.getter = noop
      }
    }

    this.value = this.get() || val
  }

  addDep (dep) {
    const { id } = dep
    if (!this.depIds.has(id)) {
      dep.addSub(this)
      this.deps.push(dep)
      this.depIds.add(id)
    }
  }

  get () {
    // 将当前监听器设置成target
    pushTarget(this)
    // 调用getter函数获取最新值
    this.value = this.getter.call(this.vm, this.vm)
    // 移除Dep.target当前监听器
    popTarget()
  }

  run () {
    let oldVal = this.value
    this.get()
    // 执行用户自定义的watch
    this.cb.call(this.vm, this.value, oldVal)
  }

  update () {
    watcherqueue(this)
  }
}

function parsePath (path) {
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}

export default Watcher