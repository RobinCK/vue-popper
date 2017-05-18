<p align="center">
  <a href="https://travis-ci.org/RobinCK/vue-popper"><img src="https://img.shields.io/travis/RobinCK/vue-popper.svg?style=flat-square"></a><a href="https://codeclimate.com/github/RobinCK/vue-popper"><img src="https://img.shields.io/codeclimate/github/RobinCK/vue-popper.svg?style=flat-square"></a><a href="https://www.npmjs.com/package/vue-popperjs"><img src="https://img.shields.io/npm/dt/vue-popperjs.svg?style=flat-square"></a><a href="https://david-dm.org/RobinCK/vue-popper"><img src="https://david-dm.org/RobinCK/vue-popper.svg?style=flat-square"></a><a href="https://david-dm.org/RobinCK/vue-popper#info=devDependencies&view=table"><img src="https://david-dm.org/RobinCK/vue-popper/dev-status.svg?style=flat-square"></a><a href="https://github.com/RobinCK/vue-popper"><img src="https://img.shields.io/bower/v/vue-popperjs.svg?style=flat-square"></a><a href="https://github.com/RobinCK/vue-popper"><img src="https://img.shields.io/npm/v/vue-popperjs.svg?style=flat-square"></a><a href="https://github.com/RobinCK/vue-popper/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/vue-popperjs.svg?style=flat-square"></a>

</p>

# vue-popperjs
VueJS popover component based <a href="https://popper.js.org/">popper.js</a>

## Install
#### CDN

Recommended: https://unpkg.com/vue-popperjs, which will reflect the latest version as soon as it is published to npm. You can also browse the source of the npm package at https://unpkg.com/vue-popperjs/

#### NPM

``` bash
npm install vue-popperjs --save
```

#### Yarn

``` bash
yarn add vue-popperjs
```

#### Bower

``` bash
bower install vue-popperjs --save
```

## Development Setup

``` bash
# install dependencies
npm install

# build dist files
npm run build
```

## Usage

### Webpack and vueJS single file
```html
<template>
  <popper trigger="click" :options="{placement: 'top'}">
    <div class="popper">
      Popper Content
    </div>

    <button slot="reference">
      Reference Element
    </button>
  </popper>
</template>

<script>
  import Popper from 'vue-popperjs';
  import 'vue-popperjs/dist/css/vue-popper.css';
  
  export default {
    components: {
      'popper': Popper
    },
  }
</script> 
```
