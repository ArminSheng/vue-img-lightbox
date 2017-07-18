<template>
  <transition name="fade" mode="out-in">
    <div
      @click="close"
      class="bbc-img-full"
      @touchmove.stop.prevent
      flex="main:center cross:center"
      v-show="visible">
      <img
        @touchmove.stop.prevent="onMove($event)"
        @touchstart="onStart($event)"
        @touchend="onTouchEnd($event)"
        :style="{
          transform: translate,
          transition: 'all ' + duration + 'ms'
        }"
        :src="src">
      <div class="modal"></div>
    </div>
  </transition>
</template>

<script>
  let startX = 0
  let startY = 0
  let direction
  let needClose = false

  export default {
    name: 'img-full',
    props: {
      src: String
    },
    data () {
      return {
        visible: false,
        offsetY: 0,
        offsetX: 0,
        scale: 1,
        duration: 0
      }
    },

    computed: {
      translate () {
        let { offsetX, offsetY, scale } = this
        return `translate(${offsetX}px, ${offsetY}px) scale(${scale})`
      }
    },

    methods: {
      open () {
        this.visible = true
        this.resetTransformation()
      },

      close () {
        this.visible = false
      },

      onDoubleClick () {
      },

      doSlideClose () {
        this.offsetY = this.$el.clientHeight

        this.duration = 200
        setTimeout(() => {
          this.duration = 0
          this.close()
          // this.resetTransformation()
        }, 200)
      },

      resetTransformation () {
        this.offsetY = this.offsetX = 0
        direction = undefined
        this.scale = 1

        this.duration = 300
        setTimeout(() => {
          this.duration = 0
        }, 300)
      },

      onStart (e) {
        startX = e.touches[0].pageX
        startY = e.touches[0].pageY
      },

      onTouchEnd (e) {
        this.resetTransformation()

        if (needClose) {
          this.doSlideClose()
        }

        needClose = false
      },

      onMove (e) {
        let {touches} = e

        if (touches.length !== 1) {
          return
        }

        let offsetY = touches[0].pageY - startY
        let offsetX = touches[0].pageX - startX
        let absX = Math.abs(offsetX)
        let absY = Math.abs(offsetY)

        if (!direction && absY > absX) {
          direction = 'vertical'
        } else if (!direction && absY < absX) {
          direction = 'horizontal'
        }

        if (direction === 'horizontal') {
          this.offsetX = offsetX / 2
        } else {
          this.offsetY = offsetY / 1.1
          if (offsetY > 0) {
            this.scale = 1 - Math.abs(offsetY / 1000)
            if (absY > 100) {
              needClose = true
            }
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .bbc-img-full {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    .modal {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0.5;
      background: #000;
      padding: 10% 0;
    }
    img {
      z-index: 1000;
      opacity: 1;
      width: 100%;
    }
  }
</style>