const h2 = document.createElement('h2')
const button = document.createElement('button')


export const App = {
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
    // 简易的渲染函数，直接操作真实dom
    // 下列代码将生成一个
    /**
     * <div>
     *  <h2>0</h2>
     *  <button>+1</button>
     * </div>
     */
    const app = document.createElement('div')
    // 将count值渲染到h2标签中
    h2.innerText = this.count
    button.innerText = '+1'
    // 给button绑定点击事件，并利用bind将事件的this指向调用render函数的this对象
    button.addEventListener('click', this.plus.bind(this))
    app.append(h2)
    app.append(button)
    return app
  }
}


/**
 * 使用函数式写法，声明一个Vue类
 * @param app 此处传入的app, 为了简单，已经转换成了一个对象，详情将/example/app.js
 * @returns 返回值需要包含一个mount函数，用于将节点挂载到页面上去
 */
function Vue (app) {
  // 因为vue中data是函数，此处需要执行data()来获取app中声明的对象
  const data = app.data()

  // 将data转换为响应式的
  abserver(data)

  // 将data,methods合并，并一起放入vm中，注意此处的vm===data, 这样可以保证响应式生效
  const vm = Object.assign(data, app.methods)

  // 执行app的render函数，得到最终渲染的dom对象
  const root = app.render ? app.render.call(vm) : ''

  const $mount = selector => {
    // 找到#app元素
    const page = document.querySelector(selector) || document.body
    // 先清空里面的内容
    page.innerHTML = ''
    // 将上面app生成的dom对象，放入page中
    page.append(root)
  }

  return {
    $mount
  }
}

/**
 * 为对象的每个属性添加响应
 * @param {*} data 
 */
function abserver (data) {
  for (let key in data) {
    // 在外边定义一个值用来存储值，此处可看作是一个闭包应用
    let val = data[key]
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        // 此处应该是用来依赖收集的，等到v0.0.2再详细设计
        return val
      },
      set: function (newVal) {
        val = newVal
        // 此处应该是用来更新所有依赖的，等到v0.0.2再详细设计
        h2.innerText = newVal
      }
    })
  }
}


export default Vue
