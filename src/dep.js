let uid = 0
class Dep {
  constructor() {
    this.id = ++uid
    this.subs = []
  }

  addSub (watcher) {
    this.subs.push(watcher)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // 因为可能存在多个依赖，此处使用数组形式遍历触发
    // 依赖是有先后顺序的，因此需要提前排下序
    this.subs.sort((a, b) => a.id - b.id)
    this.subs.forEach(sub => sub.update())
  }
}

Dep.target = null
const staticTargets = []
export function pushTarget (watcher) {
  staticTargets.push(watcher)
  Dep.target = staticTargets[staticTargets.length - 1]
}

export function popTarget () {
  staticTargets.pop()
  Dep.target = staticTargets[staticTargets.length - 1]
}

export default Dep