import ImgFull from './ImgFull'

let Lightbox
let instance

const initialize = (el, binding) => {
  let images

  if (binding.arg === 'group') {
    images = binding.value
  } else {
    images = [el.src]
  }

  if (!images) {
    // console.error('Binding element missing images!')
    return
  }

  if (!instance) {
    const container = document.createElement('div')
    container.id = 'v-img-view'

    document.body.appendChild(container)
    instance = new Lightbox().$mount('#v-img-view')
  }

  instance.images = images

  el.onclick = () => {
    const currentIndex = images.indexOf(el.src)
    instance.index = currentIndex
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
