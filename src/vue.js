function Vue (app) {

  const data = app.data()

  abserver(data)

  const vm = Object.assign(data)

  const root = app.render ? app.render.call(vm) : ''

  const mount = selector => {
    const page = document.querySelector(selector) || document.body
    page.innerHTML = ''
    page.append(root)
  }

  return {
    mount
  }
}

export default Vue
