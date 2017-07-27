<template>
  <transition name="fade" mode="out-in">
    <div
      class="bbc-img-full"
      flex="main:center cross:center"
      @touchmove.stop.prevent
      v-show="visible">
      <div
        flex
        ref="container"
        @touchmove.stop.prevent="onMove($event)"
        @touchstart="onStart($event)"
        @touchend="onTouchEnd($event)"
        :style="{
          transform: translate,
          transition: 'all ' + duration + 'ms'
        }"
        class="content">
          <div
            :style="{
              transform: 'scale(' + scale + ')',
              transition: 'all ' + duration + 'ms'
            }"
            v-for="src in images"
            flex-box="0"
            class="touch-item">
            <img :src="src">
          </div>
      </div>
      <div class="modal"></div>
    </div>
  </transition>
</template>

<script>
  let startX = 0
  let startY = 0

  let offsetY = 0
  let offsetX = 0

  let absX = 0
  let absY = 0

  let direction
  let touchStartTime
  const FAST_CLICK_T = 200
  const TRANSITION_T = 300

  export default {
    name: 'img-full',
    props: {
      images: Array,
      index: 0
    },
    data () {
      return {
        visible: false,
        offsetY: 0,
        offsetX: 0,
        scale: 1,
        duration: 0,
        currentIndex: this.index,
        isSlide: false,
        clientWidth: document.body.clientWidth
      }
    },

    computed: {
      translate () {
        let { offsetX, offsetY } = this
        return `translate(${offsetX}px, ${offsetY}px)`
      },

      length () {
        return this.images.length || 0
      }
    },

    methods: {
      open () {
        this.visible = true
        this.initParams(this.index)
        this.resetTransformation()
      },

      close () {
        this.visible = false
      },

      onFastClick () {
        this.isSlide = true
        this.close()
      },

      // TODO
      onDoubleClick () {
      },

      next () {
        if (this.hasNext()) {
          this.slide(++this.currentIndex)
        }
      },

      prev () {
        if (this.hasPrev()) {
          this.slide(--this.currentIndex)
        }
      },

      slide (index) {
        let { clientWidth, addTransitionTime } = this
        this.isSlide = true
        this.offsetX = -index * clientWidth
        addTransitionTime(() => {
          this.isSlide = false
        })
      },

      hasPrev () {
        return this.currentIndex > 0
      },

      hasNext () {
        return this.currentIndex < this.length - 1
      },

      doSlideClose () {
        this.isSlide = true
        this.duration = 200
        this.offsetY = this.$el.clientHeight
        this.addTransitionTime(this.close, this.duration)
      },

      resetTransformation () {
        let { currentIndex, clientWidth } = this
        this.offsetY = 0
        this.offsetX = -currentIndex * clientWidth

        direction = undefined
        this.scale = 1
        this.isSlide = false

        offsetX = 0
        offsetY = 0
        absX = 0
        absY = 0

        this.addTransitionTime()
      },

      initParams (index) {
        this.currentIndex = index || 0
        this.scale = 1
        this.isSlide = false

        direction = undefined
        offsetX = 0
        offsetY = 0
        absX = 0
        absY = 0
      },

      addTransitionTime (callback, time = TRANSITION_T) {
        this.duration = time
        setTimeout(() => {
          this.duration = 0
          callback && callback()
        }, time)
      },

      onStart (e) {
        startX = e.touches[0].pageX
        startY = e.touches[0].pageY

        absX = 0
        absY = 0

        touchStartTime = new Date()
      },

      onTouchEnd (e) {
        const endT = new Date()
        if (endT - touchStartTime < FAST_CLICK_T &&
          absX === 0 &&
          absY === 0) {
          this.onFastClick()
          return
        }

        if (direction === 'horizontal') {
          if (absX > 50) {
            offsetX > 0 ? this.prev() : this.next()
          }
        } else {
          if (absY > 100) {
            this.doSlideClose()
            return
          }
        }

        if (!this.isSlide) {
          this.resetTransformation()
        }
      },

      onMove (e) {
        let {touches} = e

        if (touches.length !== 1) {
          return
        }

        if (this.isSlide) {
          return
        }

        offsetY = touches[0].pageY - startY
        offsetX = touches[0].pageX - startX
        absX = Math.abs(offsetX)
        absY = Math.abs(offsetY)

        if (!direction && absY > absX) {
          direction = 'vertical'
        } else if (!direction && absY < absX) {
          direction = 'horizontal'
        }

        if (direction === 'horizontal') {
          this.offsetMove(offsetX)
        } else {
          this.offsetY = offsetY
          if (offsetY > 0) {
            // Do scale
            this.scale = 1 - Math.abs(offsetY / 1000)
          }
        }
      },

      offsetMove (offset) {
        let {
          currentIndex,
          clientWidth
        } = this

        this.offsetX = currentIndex === 0
          ? offset
          : (-currentIndex * clientWidth) + offset
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
    }
    .content {
      z-index: 1000;
      opacity: 1;
      width: 100%;
      position: relative;
      transition-property: transform;
      box-sizing: content-box;
      overflow: visible;
      .touch-item {
        width: 100%;
        height: 100%;
      }
      img {
        width: 100%;
      }
    }
  }
</style>