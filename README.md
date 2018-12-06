<p align="center">
<img width="250" src="https://cdn.rawgit.com/RobinCK/vue-popper/4431e4cc/doc/logo.png">
</p>

<p align="center">
  <a href="https://travis-ci.org/RobinCK/vue-popper"><img src="https://img.shields.io/travis/RobinCK/vue-popper.svg?style=flat-square"></a>
  <a href="https://github.com/RobinCK/vue-popper"><img src="https://img.shields.io/badge/vuejs-2.x-brightgreen.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/vue-popperjs"><img src="https://img.shields.io/npm/dt/vue-popperjs.svg?style=flat-square"></a>
  <a href="https://david-dm.org/RobinCK/vue-popper"><img src="https://david-dm.org/RobinCK/vue-popper.svg?style=flat-square"></a>
  <a href="https://david-dm.org/RobinCK/vue-popper?type=dev"><img src="https://david-dm.org/RobinCK/vue-popper/dev-status.svg?style=flat-square"></a>
</p>  
  
<p align="center">
  <a href="https://github.com/RobinCK/vue-popper"><img src="https://img.shields.io/bower/v/vue-popperjs.svg?style=flat-square"></a>
  <a href="https://github.com/RobinCK/vue-popper"><img src="https://img.shields.io/npm/v/vue-popperjs.svg?style=flat-square"></a>
  <a href="https://github.com/RobinCK/vue-popper/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/vue-popperjs.svg?style=flat-square"></a>

</p>

# vue-popperjs

[![Greenkeeper badge](https://badges.greenkeeper.io/RobinCK/vue-popper.svg)](https://greenkeeper.io/)
VueJS popover component based on <a href="https://popper.js.org/">popper.js</a>

## Example

[jsFiddle](https://jsfiddle.net/Robin_ck/1espngy1/)

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

### VueJS single file (ECMAScript 2015)
```html
<template>
  <popper
    trigger="click"
    :options="{
      placement: 'top',
      modifiers: { offset: { offset: '0,10px' } }
    }">
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

### Browser (ES5)
```html
<link rel="stylesheet" href="vue-popper.css">
<script type="text/javascript" src="popper.js"></script>
<script type="text/javascript" src="vue.js"></script>
<script type="text/javascript" src="vue-popper.js"></script>

<div id="app">
  <popper
    trigger="click"
    :options="{
      placement: 'top',
      modifiers: { offset: { offset: '0,10px' } }
    }">
    <div class="popper">
      Popper Content
    </div>

    <button slot="reference">
      Reference Element
    </button>
  </popper>
</div>

<script type="text/javascript">
  new Vue({
    el: '#app',
    components: {
      'popper': VuePopper
    }
  });
</script>
```

## Props

| Props               | Type      | Default                                         | Description  |
| --------------------|:----------| ------------------------------------------------|--------------|
| disabled            | Boolean   | false                                           |   |
| delay-on-mouse-over | Number    | 10                                              | Delay in ms before showing popper during a mouse over |
| delay-on-mouse-out  | Number    | 10                                              | Delay in ms before hiding popper during a mouse out |
| append-to-body      | Boolean   | false                                           |   |
| visible-arrow       | Boolean   | true                                            |   |
| force-show          | Boolean   | false                                           |   |
| trigger             | String    | hover                                           | Optional value: hover or click  |
| content             | String    | null                                            |   |
| enter-active-class  | String    | null                                            |   |
| leave-active-class  | String    | null                                            |   |
| boundaries-selector | String    | null                                            |   |
| transition          | String    | empty                                           |   |
| options             | Object    | { placement: 'bottom', gpuAcceleration: false } | [popper.js](https://popper.js.org/popper-documentation.html) options  |
| data-value          | Any       | null                                            | data of popper  |


## Events
| Name            | Params                   | Description  |
| ----------------|:-------------------------|--------------|
| created         | context[Object]          | Created popper component |
| show            |                          | Show popover |
| hide            |                          | Hide popover |
| document-click  |                          | |

## Other my Vue JS plugins

| Project | Status | Description |
|---------|--------|-------------|
| [vue-ls](https://github.com/RobinCK/vue-ls)                | ![npm](https://img.shields.io/npm/v/vue-ls.svg)      | Vue plugin for work with local storage, session storage and memory storage from Vue context |
| [vue-gallery](https://github.com/RobinCK/vue-gallery)      | ![npm](https://img.shields.io/npm/v/vue-gallery.svg) | Responsive and customizable image and video gallery, carousel and lightbox, optimized for both mobile and desktop web browsers |

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2FRobinCK%2Fvue-popper.svg?type=large)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2FRobinCK%2Fvue-popper?ref=badge_large)

MIT © [Igor Ognichenko](https://github.com/RobinCK)
