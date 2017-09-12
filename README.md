# vue-img-lightbox (For mobile)

![image](/assets/demo_gif.gif)

## Usage

### Import
```
Import ImgView from 'vue-img-lightbox'
Vue.use(ImgView)

```

### Directive
```
<!-- Single -->
<img :src="src" v-img-view>

<!-- Multi images lightbox -->
<img v-for="src in arr"
  :src="src"
  v-img-view:group="arr">

```
