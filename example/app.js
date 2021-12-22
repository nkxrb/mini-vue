export default {
  data: function () {
    return {
      count: 0
    }
  },
  methods: {
    plus () {
      this.count++
    }
  },
  render () {
    /**
     * this为当前实例对象，通过vm.$createElement来生成dom对象
     * vm._v() 通过这个函数来收集依赖，因为vm.count将触发count属性的getter函数
     */
    const vm = this
    const h = vm.$createElement

    return h('div', [
      h('h2', [vm._v(vm.count)]),
      h('button', {
        on: { click: vm.plus }
      }, [vm._v('+1')])
    ])

  }
}