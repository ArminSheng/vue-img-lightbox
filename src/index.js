import ImgFull from './ImgFull'

let Lightbox
let instance

const initialize = (el, binding) => {
  const src = binding.value || el.src

  if (!src) {
    // console.error('Binding element missing src!')
    return
  }

  el.onclick = () => {
    if (!instance) {
      const container = document.createElement('div')
      container.id = 'v-img-view'

      document.body.appendChild(container)
      instance = new Lightbox().$mount('#v-img-view')
    }

    instance.src = src
    instance.open()
  }
}

// Vue install
const install = (Vue) => {
  Lightbox = Vue.extend(ImgFull)

  Vue.directive('img-view', {
    bind: initialize,
    update: initialize
  })
}

export default install
