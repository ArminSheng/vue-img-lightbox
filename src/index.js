import ImgFull from './ImgFull'

// Vue install
export default Vue => {
  const Lightbox = Vue.extend(ImgFull)
  const instance

  Vue.directive('v-img-view', {
    bind (el, binding) {
      const src = el.src || binding.expression

      if (!src) {
        console.warn('Binding elment must be Image!')
        return
      }

      el.onclick(() => {
        if (!instance) {
          const container = document.createElement('div')
          instance = new Lightbox().$mount(container)
          document.body.appenChild(container)
        }

        instance.src = el.src
        instance.open()
      })
    }
  })
}