import LightboxComponent from './LightboxComponent'

let Lightbox
let instance
let images

const initialize = (el, binding) => {
  if (binding.arg === 'group') {
    // if (images && images !== binding.value) {
    //   instance = createInstance(images)
    //   console.log('group')
    // } else {
    //   // images = binding.value
    // }
    images = binding.value
  } else {
    images = [el.src]
  }

  if (!images) {
    // console.error('Binding element missing images!')
    return
  }

  if (!instance) {
    instance = createInstance(binding.value)
  }

  el.onclick = () => {
    const currentIndex = instance.images.indexOf(el.src)
    instance.index = instance.currentIndex = currentIndex
    instance.open()
  }
}

const createInstance = (images) => {
  const container = document.createElement('div')
  container.id = 'v-img-view'
  document.body.appendChild(container)

  const instance = new Lightbox().$mount('#v-img-view')
  instance.images = images

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
