import { pushTarget, popTarget } from './dep.js'

let uid = 0
class Watcher {
  constructor(vm, expOrFn, cb, val) {
    this.id = ++uid
    this.vm = vm
    this.expOrFn = expOrFn
    this.cb = cb
    this.deps = []
    this.depIds = new Set()
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