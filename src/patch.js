import { isDef, isUndef } from "./shared.js"

/**
 * 更新DOM
 * @param {vnode} n1 旧vnode
 * @param {vnode} n2 新vnode
 * @param {Element} container 父节点
 * @param {Object} vm 当前组件实例对象
 */
export function patch (n1, n2, container, vm) {
  n2.vm = vm
  if (n1 == null) {
    initPatch(n2, container)
  } else {
    updatePatch(n1, n2, container)
  }

  // vm是全局不变的对象，因此用_vnode属性来存储本次的虚拟DOM，用于下次更新时比较
  vm._vnode = n2
}

/**
 * 初始化DOM，不用多余的判断，直接渲染
 */
function initPatch (vnode, container) {
  let el = vnodeToDom(vnode)
  container.innerHTML = ''
  container.append(el)
}

/**
 * 
 * @param {vnode} n1 旧vnode
 * @param {vnode} n2 新vnode
 * @param {Element} container 父节点
 * @param {boolean} isSame 判断n1,n2是否已经比较过了, 在updateChildren函数中有使用 
 */
function updatePatch (n1, n2, container, isSame) {
  let el = n1.el
  if (!isSame && !sameVnode(n1, n2)) {
    el = vnodeToDom(n2)
  }
  n2.el = el
  if (n2.children && n1.children) {
    updateChildren(n1.children, n2.children, el)
  } else if (isUndef(n2.children)) {
    el.innerHTML = ''
  }

  if (el !== n1.el) { // 当新的节点不是原来旧的节点时，执行替换操作
    container.replaceChild(el, n1.el)
  }
}

/**
 * diff算法，更新DOM子节点们
 * @param {Array} oldCh 旧vnode子节点集合
 * @param {Array} newCh 新vnode子节点集合
 * @param {Element} container 父节点
 */
function updateChildren (oldCh, newCh, container) {
  let oldStartIdx = 0
  let oldStart = oldCh[oldStartIdx]
  let oldEndIdx = oldCh.length - 1
  let oldEnd = oldCh[oldEndIdx]
  let newStartIdx = 0
  let newStart = newCh[newStartIdx]
  let newEndIdx = newCh.length - 1
  let newEnd = newCh[newEndIdx]

  let oldKeyMap, idxInOld // 定义旧节点的KeyMap, 要新插入的DOM, 要移除的DOM

  // 新旧数组，分别使用双指针进行遍历
  // 旧前-新前, 旧后-新后, 旧前-新后, 旧后-新前
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStart)) { // 此处使用isUndef, 避免把0,''等一些合法值过滤了
      oldStart = oldCh[++oldStartIdx]
    } else if (isUndef(oldEnd)) {
      oldEnd = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStart, newStart)) { // 旧前-新前
      // 当前节点相同时，进一步比较他们的子节点是否也相同
      updatePatch(oldStart, newStart, oldStart.el, true)
      oldStart = oldCh[++oldStartIdx]
      newStart = newCh[++newStartIdx]
    } else if (sameVnode(oldEnd, newEnd)) { // 旧后-新后
      updatePatch(oldEnd, newEnd, oldEnd.el, true)
      oldEnd = oldCh[--oldEndIdx]
      newEnd = newCh[--newEndIdx]
    } else if (sameVnode(oldStart, newEnd)) { // 旧前-新后
      updatePatch(oldStart, newEnd, oldStart.el, true)
      oldStart = oldCh[++oldStartIdx]
      newEnd = newCh[--newEndIdx]
    } else if (sameVnode(oldEnd, newStart)) { // 旧后-新前
      updatePatch(oldEnd, newStart, oldEnd.el, true)
      oldEnd = oldCh[--oldEndIdx]
      newStart = newCh[++newStartIdx]
    } else { // 当前后两端都没匹配到时，通过key来查找，顺序匹配newCh, 这也就是newStart = [++newStartIdx]的原因
      // 初始化old的keyMap
      oldKeyMap = oldKeyMap || getKeyMap(oldCh, oldStartIdx, oldEndIdx)
      // 判断newStart是否在oldCh中, 优先使用key获取，其次遍历oldCh全部进行查找
      // 因此在使用v-for时，最好定义唯一的key值
      idxInOld = isDef(newStart.key) ? oldKeyMap[newStart.key] : findNewInOld(newStart, oldCh, oldStartIdx, oldEndIdx)

      if (isUndef(idxInOld)) { // 如果不存在，则newStart为新增的节点
        insertBefore(container, vnodeToDom(newStart), oldStart.el)
      } else {
        vnodeToMove = oldCh[idxInOld]
        if (sameVnode(vnodeToMove, newStart)) { // 说明该节点在此次更新中移动了位置
          updatePatch(vnodeToMove, newStart, vnodeToMove.el, true)
          insertBefore(container, vnodeToMove.el, oldStart.el)
          oldCh[idxInOld] = undefined
        } else {
          // key值相同，但却不是同一个节点，因此还是按照新增节点处理
          insertBefore(container, vnodeToDom(newStart), oldStart.el)
        }
      }

      newStart = [++newStartIdx]
    }

    // 循环匹配结束后，只存在两种情况
    if (oldStartIdx > oldEndIdx) { // 旧的队列提前遍历完了，说明新的比旧的多，还需要进行插入操作
      for (let i = newStartIdx; i <= newEndIdx; i++) {
        container.appendChild(vnodeToDom(newCh[i]))
      }
    } else if (newStartIdx > newEndIdx) { // 新的队列提前遍历完了，说明新的比旧的少，还需要把旧的里面剩余节点移除
      for (let i = oldStartIdx; i <= oldEndIdx; i++) {
        container.removeChild(oldCh[i].el)
      }
    }

  }
}

/**
 * 将n1插入到n2前面
 */
function insertBefore (container, n1, n2) {
  container.insertBefore(n1, n2)
}


function findNewInOld (item, arr, startIdx, endIdx) {
  for (let i = startIdx; i <= endIdx; i++) {
    if (isDef(arr[i]) && sameVnode(item, arr[i])) {
      return i
    }
  }
  return null
}

function getKeyMap (arr, startIdx, endIdx) {
  let map = {}
  let key
  for (let i = startIdx; i <= endIdx; i++) {
    key = arr[i].key
    if (isDef(key)) {
      map[key] = i
    }
  }
  return map
}

/**
 * 判断两个虚拟DOM是否相同
 * @param {*} n1 
 * @param {*} n2 
 * @returns boolean 
 */
function sameVnode (n1, n2) {
  return (n1.tag === n2.tag && n1.text === n2.text)
}

/**
 * 将虚拟DOM转换为真实DOM
 * @param {*} vnode 
 * @returns 
 */
function vnodeToDom (vnode) {
  const { tag, events, attrs, children, text } = vnode
  if (tag === 'text') {
    vnode.el = document.createTextNode(text)
    return vnode.el
  }

  const el = vnode.el || (vnode.el = document.createElement(tag))
  if (events) {
    Object.getOwnPropertyNames(events).forEach(ev => {
      el.addEventListener(ev, events[ev])
    })
  }

  if (attrs) {
    Object.getOwnPropertyNames(attrs).forEach(name => {
      el.setAttribute(name, attrs[name])
    })
  }

  if (children) {
    children.forEach(child => {
      el.append(vnodeToDom(child))
    })
  }

  return el
}