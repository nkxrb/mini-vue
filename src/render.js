export function createElement (vm, tag, prop, children) {
  const el = document.createElement(tag)
  vm.el = el

  if (Array.isArray(prop)) {
    children = prop
  } else {
    if (prop.on) {
      // 如果存在on属性，则进行事件绑定操作
      for (let ev in prop.on) {
        el.addEventListener(ev, prop.on[ev].bind(vm))
      }
    }
  }

  if (children && children.length > 0) {
    children.forEach(child => el.append(child))
  }

  return el
}