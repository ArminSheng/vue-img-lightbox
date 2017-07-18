import ImgFull from './ImgFull'

let instance

// Vue install
const install = (Vue) => {
  const Lightbox = Vue.extend(ImgFull)

  Vue.directive('img-view', {
    bind (el, binding) {
      const src = binding.value || el.src

      if (!src) {
        console.error('Binding element missing src!')
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
  })
}

export default install
