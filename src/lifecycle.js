export function callhook (vm, lifecycle) {
  console.log(lifecycle, JSON.stringify(vm, ['count', 'countList']))

  if (typeof vm.$options[lifecycle] === 'function') {
    vm.$options[lifecycle].call(vm)
  }
}