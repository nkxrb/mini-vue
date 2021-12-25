export function createElement (vm, tag, prop, children) {
  const vnode = { vm, tag }

  if (Array.isArray(prop)) {
    children = prop
  } else {
    if (prop.on) {
      // 如果存在on属性，则进行事件绑定操作
      vnode.events = {}
      for (let ev of Object.getOwnPropertyNames(prop.on)) {
        vnode.events[ev] = prop.on[ev].bind(vm)
      }
    }
  }

  if (children && children.length > 0) {
    const arr = []
    children.forEach(child => {
      if (typeof child === 'string') {
        child = { vm, tag: 'text', text: child }
      }
      arr.push(child)
    })
    vnode.children = arr
  }
  return vnode
}