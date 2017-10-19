<template>
  <transition name="fade" mode="out-in">
    <div
      class="bbc-img-full"
      flex="main:center cross:center"
      @touchmove.stop.prevent
      v-show="visible">
      <div class="swipe-pagination">
        {{ currentIndex + 1 }} / {{ size }}
      </div>
      <div class="img-close" @click="doSlideClose"></div>
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
          v-for="(src, $index) in imagesArr"
          :class="{
            'active': $index === currentIndex,
            'prev': $index === currentIndex - 1,
            'next': $index === currentIndex + 1
          }"
          flex-box="0"
          flex="main:center cross:center"
          class="touch-item">
          <img
          :style="{
            transform: $index === currentIndex
              ? 'scale(' + scale + ')'
              : ''
          }"
          :src="src">
        </div>
      </div>
      <div
        class="modal"
        :style="{
          opacity: opacity
        }">
      </div>
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
  let distance = 0

  const FAST_CLICK_T = 200
  const TRANSITION_T = 300
  const SLIDE_DISTANCE = 50
  const CLOSE_DISTANCE = 100
  const OPACITY_RATIO = 400

  export default {
    name: 'img-lightbox',
    props: {
      images: {
        type: Array,
        default () {
          return []
        }
      },
      index: 0
    },
    data () {
      return {
        opacity: 1,
        visible: false,
        offsetY: 0,
        offsetX: 0,
        scale: 1,
        duration: 0,
        currentIndex: this.index,
        isSlide: false,
        isPinch: false,
        clientWidth: document.body.clientWidth
        // imagesArr: this.images
      }
    },

    computed: {
      translate () {
        let { offsetX, offsetY } = this
        return `translate(${offsetX}px, ${offsetY}px)`
      },

      size () {
        return this.images.length || 0
      },

      imagesArr () {
        return this.images
      }
    },

    methods: {
      open () {
        this.visible = true
        this.initParams(this.currentIndex)
        this.resetTransformation()
      },

      setImages (arr) {
        this.images = arr
      },

      setIndex (idxOrSrc) {
        if (typeof idxOrSrc === 'number') {
          this.currentIndex = idxOrSrc
        } else {
          this.currentIndex = this.imagesArr.indexOf(idxOrSrc)
        }
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

        // Reset
        this.isPinch = false
        this.scale = 1

        this.offsetX = -index * clientWidth
        addTransitionTime(() => {
          this.isSlide = false
        })
      },

      hasPrev () {
        return this.currentIndex > 0
      },

      hasNext () {
        return this.currentIndex < this.size - 1
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

        if (!this.isPinch) {
          this.scale = 1
        }

        direction = undefined
        this.opacity = 1
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

        distance = 0
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
          if (absX > SLIDE_DISTANCE) {
            offsetX > 0 ? this.prev() : this.next()
          }
        } else {
          if (absY > CLOSE_DISTANCE) {
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

        if (this.isSlide) {
          return
        }

        if (touches.length === 2) {
          const x1 = touches[0].pageX
          const y1 = touches[0].pageY
          const x2 = touches[1].pageX
          const y2 = touches[1].pageY

          const curDistance = Math.sqrt((x1 - x2) * (x1 - x2) +
            (y1 - y2) * (y1 - y2))

          if (distance && curDistance - distance) {
            this.doScale((curDistance - distance) / 100)
          }

          distance = Math.sqrt((x1 - x2) * (x1 - x2) +
            (y1 - y2) * (y1 - y2))
          return
        } else {
          this.isPinch = false
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
          this.opacity = 1 - (absY / OPACITY_RATIO)
          if (offsetY > 0) {
            // Do scale
            this.scale = 1 - Math.abs(offsetY / 1000)
          }
        }
      },

      doScale (ratio) {
        this.scale += ratio
        this.isPinch = true

        if (this.scale > 3) {
          this.scale = 3
        }

        if (this.scale < 0.5) {
          this.scale = 0.5
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
    z-index: 2000;
    .modal {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: #000;
    }
    .swipe-pagination {
      position: fixed;
      top: 5px;
      left: 15px;
      color: #fff;
      z-index: 2000;
    }
    .img-close {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 2000;
      width: 30px;
      height: 30px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAABYCAQAAACjBqE3AAAB6klEQVR4Ae3bsWpUQRTG8YkkanwCa7GzVotsI/gEgk9h4Vu4ySLYmMYgbJrc3lrwZbJwC0FMt4j7F6Y4oIZrsXtgxvx/1c0ufEX4cnbmLCmSJEmSJEmSJEmSJP3XCBPvbJU+8doWmDFwyZpLBmYlNJebz0KwzykwsuSYJSNwykEJreV2BaBMaLIQZ2xYcFgqDlmw4ayE/FwL0dDk4Qh4W37DAjgqIT+3HRbigjH+iikVdxgZStgyN0Su2sXIeTwTT+esdpcbIlfNAuZ/TxresG4zV8kYWSZNiKUTokMMSWeIwTNEn4fK2TW3gRNgVkJLuVksROA9G+bEvoATNlBCa7nZXEwdxEZxzpKRKFh+bsv8LmPFmhX1OwfIz81jIRJQ5eeqG9B+riRJkiRJkiRJkiRJkiRJkiRJUkvA/8RQoEpKlJWINFkJ62AlrEP/mNBibnv2yz/A3t7Uq3LcpoxP8COjC1T5vxoAD5VdoEqdDrd5QuW1swtUSaueh3zkiuBiqgtA2OlkeMcP/uDqugsJdbjHF65VdPMKwS0+WQc/MgKvrIOHysB9vgPwk8+85hmPbnQdvHZyDMAFD7L3EOpgMcVdvnHFS0/vlatrXvCVx0U9gt3fxvnA0/hB4nmRJEmSJEmSJEmSJGmHfgFLaDPoMu5xWwAAAABJRU5ErkJggg==) 0 0 no-repeat;
      background-position: -10px -50px
    }
    .content {
      z-index: 1000;
      opacity: 1;
      width: 100%;
      height: 100%;
      position: relative;
      transition-property: transform;
      box-sizing: content-box;
      overflow: visible;
      .touch-item {
        width: 100%;
        margin: 30px 0;
        &.prev {
          transform: translate(-20px, 0) !important;
        }
        &.next {
          transform: translate(20px, 0) !important;
        }
      }
      img {
        width: 100%;
      }
    }
  }
</style>