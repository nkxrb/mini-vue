import { pushTarget, popTarget } from './dep.js'

class Watcher {
  constructor(vm, expOrFn, cb, val) {
    this.vm = vm
    this.expOrFn = expOrFn
    this.cb = cb
    this.deps = []
    this.value = this.get() || val
  }

  addDep (dep) {
    dep.addSub(this)
    this.deps.push(dep)
  }

  get () {
    // 将当前监听器设置成target
    pushTarget(this)

    this.expOrFn.call(this.vm)

    popTarget()
  }

  update () {
    // 触发组件更新渲染
    let value = this.get()

    // 执行用户自定义的watch
    this.cb.call(this.vm, value, this.value)
  }
}

export default Watcher