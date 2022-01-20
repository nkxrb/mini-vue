export function noop (a, b, c) { }

export const isUndef = val => val === undefined || val === null

export const isDef = val => val !== undefined && val !== null

export const isObject = val => typeof val === 'object' && val !== null

export const merger = (a, b) => {
  if (!b) {
    return
  }

  for (let key in b) {
    a[key] = b[key]
  }
}

/**
 * Define a property.
 */
export function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}