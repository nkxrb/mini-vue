import { callhook } from "./lifecycle.js"

let queue = []
let has = {}

let waiting = false

function flushSchedulerQueue () {
  let len = queue.length
  if (len === 0) {
    return
  }
  console.log(queue)
  let watcher
  queue.sort((a, b) => a.id - b.id)
  for (let i = 0; i < len; i++) {
    watcher = queue[i]
    callhook(watcher.vm, 'beforeUpdate')
    watcher.run()
  }
  // 在清除之前存一份
  const updateQueue = queue.slice()

  queue = []
  has = {}
  waiting = false
  // 清空队列后，再执行updated生命周期，因为用户可能会在这里再触发watcherqueue
  updateQueue.forEach(q => {
    callhook(q.vm, 'updated')
  })

}

export function watcherqueue (watcher) {
  const id = watcher.id
  if (!has[id]) {
    has[id] = true
    queue.push(watcher)

    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}

let timer
export function nextTick (fn, ctx) {
  console.log(timer)
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(fn.call(ctx), 1000)
}