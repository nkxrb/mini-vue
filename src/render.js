export function createElement (vm, tag, data, children) {
  const vnode = { vm, tag }
  if (Array.isArray(data)) {
    children = data
    data = undefined
  }
  vnode.data = data

  if (children && children.length > 0) {
    const arr = []
    children.forEach(child => {
      if (typeof child === 'string') {
        arr.push({ vm, tag: 'text', text: child })
      } else if (Array.isArray(child)) {
        // 没使用concat, 因为concat不改变原数组，需要重新赋值
        arr.push.apply(arr, child) // 利用apply的数组参数将两个数组合并
      } else {
        arr.push(child)
      }
    })
    vnode.children = arr
  }
  return vnode
}