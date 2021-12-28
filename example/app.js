export default {
  data: function () {
    return {
      count: 0,
      test: 1001,
      countList: []
    }
  },
  methods: {
    plus () {
      this.count++
      this.countList = [...this.countList, this.count]
    },
    del (i) {
      this.countList.splice(i, 1)
      this.countList = [...this.countList]
    },
    testNoReactive () {
      // 测试修改test属性，不触发重新渲染
      console.log('testNoReactive', this.test++)
    }
  },
  render () {
    /**
     * this为当前实例对象，通过vm.$createElement来生成dom对象
     * vm._v() 通过这个函数来收集依赖，因为vm.count将触发count属性的getter函数
     * 重点注意，此处 h('h2', [vm._v(vm.count)]) 按照js的执行顺序，
     * 1. 先执行vm.count, 触发get响应
     * 2. 然后执行vm._v()
     * 3. 最后执行h(), 
     * 明白了这个执行顺序，能同时在多个函数内使用的变量，就是全局变量，因此在执行render之前，
     * 要先声明一个全局变量，来将这过程中产生的操作记录下来，方便后续数据响应时调用
     */
    const vm = this
    const h = vm.$createElement

    return h('div', [
      h('h2', [vm._v(vm.count)]),
      h('button', { on: { click: vm.plus } }, [vm._v('+1')]),
      h('button', { on: { click: vm.testNoReactive } }, [vm._v('testNoReactive')]),
      h('div', vm._l((vm.countList), function (n, i) {
        return h('span', { key: n }, [vm._v(`第${i}次: ${n}`), h('button', {
          on: {
            click: function ($event) {
              return vm.del(i)
            }
          }
        }, ['删除']), h('br')])
      }))
    ])

  }
}