export function createElement (vm, tag, prop, children) {
  const vnode = { vm, tag }
  let events;
  if (Array.isArray(prop)) {
    children = prop
  } else if (prop) {
    for (let attr of Object.getOwnPropertyNames(prop)) {
      if (attr === 'on') {
        // 如果存在on属性，则进行事件绑定操作
        events = {}
        for (let ev of Object.getOwnPropertyNames(prop.on)) {
          events[ev] = prop.on[ev].bind(vm)
        }
      } else {
        vm[attr] = prop[attr]
      }
    }
  }

  events && (vnode.events = events)

  if (children && children.length > 0) {
    const arr = []
    children.forEach(child => {
      if (typeof child === 'string') {
        arr.push({ vm, tag: 'text', text: child })
      } else if (Array.isArray(child)) {
        arr.push.apply(arr, child)
      } else {
        arr.push(child)
      }
    })
    vnode.children = arr
  }
  return vnode
}