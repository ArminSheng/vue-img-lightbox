import LightboxComponent from './LightboxComponent'

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
    instance = createInstance(images)
  }

  el.onclick = () => {
    instance.setImages(images)
    instance.setIndex(el.src)
    instance.open()
  }
}

const createInstance = (images) => {
  const container = document.createElement('div')
  container.id = 'v-img-view'
  document.body.appendChild(container)

  const instance = new Lightbox().$mount('#v-img-view')
  instance.setImages(images)

  return instance
}

// Vue install
const install = (Vue) => {
  if (!install.installed) {
    Vue.component(LightboxComponent.name, LightboxComponent)
  }

  Lightbox = Vue.extend(LightboxComponent)

  Vue.directive('img-view', {
    bind: initialize
  })
}

export default install
