(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('popper.js')) :
  typeof define === 'function' && define.amd ? define(['popper.js'], factory) :
  (global.VuePopper = factory(global.Popper));
}(this, (function (Popper) { 'use strict';

  Popper = Popper && Popper.hasOwnProperty('default') ? Popper['default'] : Popper;

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  //

  function on(element, event, handler) {
    if (element && event && handler) {
      document.addEventListener ? element.addEventListener(event, handler, false) : element.attachEvent('on' + event, handler);
    }
  }

  function off(element, event, handler) {
    if (element && event) {
      document.removeEventListener ? element.removeEventListener(event, handler, false) : element.detachEvent('on' + event, handler);
    }
  }

  var script = {
    props: {
      trigger: {
        type: String,
        default: 'hover',
        validator: function validator(value) {
          return ['click', 'hover'].indexOf(value) > -1;
        }
      },
      delayOnMouseOver: {
        type: Number,
        default: 10
      },
      delayOnMouseOut: {
        type: Number,
        default: 10
      },
      disabled: {
        type: Boolean,
        default: false
      },
      content: String,
      enterActiveClass: String,
      leaveActiveClass: String,
      boundariesSelector: String,
      reference: {},
      forceShow: {
        type: Boolean,
        default: false
      },
      dataValue: {
        default: null
      },
      appendToBody: {
        type: Boolean,
        default: false
      },
      visibleArrow: {
        type: Boolean,
        default: true
      },
      transition: {
        type: String,
        default: ''
      },
      options: {
        type: Object,
        default: function _default() {
          return {};
        }
      }
    },

    data: function data() {
      return {
        referenceElm: null,
        popperJS: null,
        showPopper: false,
        currentPlacement: '',
        popperOptions: {
          placement: 'bottom',
          computeStyle: {
            gpuAcceleration: false
          }
        }
      };
    },


    watch: {
      showPopper: function showPopper(value) {
        if (value) {
          this.$emit('show', this);
          if (this.popperJS) {
            this.popperJS.enableEventListeners();
          }
          this.updatePopper();
        } else {
          if (this.popperJS) {
            this.popperJS.disableEventListeners();
          }
          this.$emit('hide', this);
        }
      },


      forceShow: {
        handler: function handler(value) {
          this[value ? 'doShow' : 'doClose']();
        },

        immediate: true
      },

      disabled: function disabled(value) {
        if (value) {
          this.showPopper = false;
        }
      }
    },

    created: function created() {
      this.appendedArrow = false;
      this.appendedToBody = false;
      this.popperOptions = _extends(this.popperOptions, this.options);
    },
    mounted: function mounted() {
      this.referenceElm = this.reference || this.$slots.reference[0].elm;
      this.popper = this.$slots.default[0].elm;

      switch (this.trigger) {
        case 'click':
          on(this.referenceElm, 'click', this.doToggle);
          on(document, 'click', this.handleDocumentClick);
          break;
        case 'hover':
          on(this.referenceElm, 'mouseover', this.onMouseOver);
          on(this.referenceElm, 'focus', this.onMouseOver);
          on(this.popper, 'mouseover', this.onMouseOver);
          on(this.popper, 'focus', this.onMouseOver);
          on(this.referenceElm, 'mouseout', this.onMouseOut);
          on(this.referenceElm, 'blur', this.onMouseOut);
          on(this.popper, 'mouseout', this.onMouseOut);
          on(this.popper, 'blur', this.onMouseOut);
          break;
      }
    },


    methods: {
      doToggle: function doToggle() {
        if (!this.forceShow) {
          this.showPopper = !this.showPopper;
        }
      },
      doShow: function doShow() {
        this.showPopper = true;
      },
      doClose: function doClose() {
        this.showPopper = false;
      },
      doDestroy: function doDestroy() {
        if (this.showPopper) {
          return;
        }

        if (this.popperJS) {
          this.popperJS.destroy();
          this.popperJS = null;
        }

        if (this.appendedToBody) {
          this.appendedToBody = false;
          document.body.removeChild(this.popper.parentElement);
        }
      },
      createPopper: function createPopper() {
        var _this = this;

        this.$nextTick(function () {
          if (_this.visibleArrow) {
            _this.appendArrow(_this.popper);
          }

          if (_this.appendToBody && !_this.appendedToBody) {
            _this.appendedToBody = true;
            document.body.appendChild(_this.popper.parentElement);
          }

          if (_this.popperJS && _this.popperJS.destroy) {
            _this.popperJS.destroy();
          }

          if (_this.boundariesSelector) {
            var boundariesElement = document.querySelector(_this.boundariesSelector);

            if (boundariesElement) {
              _this.popperOptions.modifiers = _extends({}, _this.popperOptions.modifiers);
              _this.popperOptions.modifiers.preventOverflow = _extends({}, _this.popperOptions.modifiers.preventOverflow);
              _this.popperOptions.modifiers.preventOverflow.boundariesElement = boundariesElement;
            }
          }

          _this.popperOptions.onCreate = function () {
            _this.$emit('created', _this);
            _this.$nextTick(_this.updatePopper);
          };

          _this.popperJS = new Popper(_this.referenceElm, _this.popper, _this.popperOptions);
        });
      },
      destroyPopper: function destroyPopper() {
        off(this.referenceElm, 'click', this.doToggle);
        off(this.referenceElm, 'mouseup', this.doClose);
        off(this.referenceElm, 'mousedown', this.doShow);
        off(this.referenceElm, 'focus', this.doShow);
        off(this.referenceElm, 'blur', this.doClose);
        off(this.referenceElm, 'mouseout', this.onMouseOut);
        off(this.referenceElm, 'mouseover', this.onMouseOver);
        off(document, 'click', this.handleDocumentClick);

        this.showPopper = false;
        this.doDestroy();
      },
      appendArrow: function appendArrow(element) {
        if (this.appendedArrow) {
          return;
        }

        this.appendedArrow = true;

        var arrow = document.createElement('div');
        arrow.setAttribute('x-arrow', '');
        arrow.className = 'popper__arrow';
        element.appendChild(arrow);
      },
      updatePopper: function updatePopper() {
        this.popperJS ? this.popperJS.scheduleUpdate() : this.createPopper();
      },
      onMouseOver: function onMouseOver() {
        var _this2 = this;

        clearTimeout(this._timer);
        this._timer = setTimeout(function () {
          _this2.showPopper = true;
        }, this.delayOnMouseOver);
      },
      onMouseOut: function onMouseOut() {
        var _this3 = this;

        clearTimeout(this._timer);
        this._timer = setTimeout(function () {
          _this3.showPopper = false;
        }, this.delayOnMouseOut);
      },
      handleDocumentClick: function handleDocumentClick(e) {
        if (!this.$el || !this.referenceElm || this.elementContains(this.$el, e.target) || this.elementContains(this.referenceElm, e.target) || !this.popper || this.elementContains(this.popper, e.target)) {
          return;
        }

        this.$emit('documentClick', this);

        if (this.forceShow) {
          return;
        }

        this.showPopper = false;
      },
      elementContains: function elementContains(elm, otherElm) {
        if (typeof elm.contains === 'function') {
          return elm.contains(otherElm);
        }

        return false;
      }
    },

    destroyed: function destroyed() {
      this.destroyPopper();
    }
  };

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function __vue_render__() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("span", [_c("transition", {
      attrs: {
        name: _vm.transition,
        "enter-active-class": _vm.enterActiveClass,
        "leave-active-class": _vm.leaveActiveClass
      },
      on: { "after-leave": _vm.doDestroy }
    }, [_c("span", {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: !_vm.disabled && _vm.showPopper,
        expression: "!disabled && showPopper"
      }],
      ref: "popper"
    }, [_vm._t("default", [_vm._v(_vm._s(_vm.content))])], 2)]), _vm._v(" "), _vm._t("reference")], 2);
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
    if (!inject) return;
    inject("data-v-64b9250b_0", { source: "\n.popper {\n  width: auto;\n  background-color: #fafafa;\n  color: #212121;\n  text-align: center;\n  padding: 2px;\n  display: inline-block;\n  border-radius: 3px;\n  position: absolute;\n  font-size: 14px;\n  font-weight: normal;\n  border: 1px #ebebeb solid;\n  z-index: 200000;\n  -moz-box-shadow: rgb(58, 58, 58) 0 0 6px 0;\n  -webkit-box-shadow: rgb(58, 58, 58) 0 0 6px 0;\n  box-shadow: rgb(58, 58, 58) 0 0 6px 0;\n}\n.popper .popper__arrow {\n  width: 0;\n  height: 0;\n  border-style: solid;\n  position: absolute;\n  margin: 5px;\n}\n.popper[x-placement^=\"top\"] {\n  margin-bottom: 5px;\n}\n.popper[x-placement^=\"top\"] .popper__arrow {\n  border-width: 5px 5px 0 5px;\n  border-color: #fafafa transparent transparent transparent;\n  bottom: -5px;\n  left: calc(50% - 5px);\n  margin-top: 0;\n  margin-bottom: 0;\n}\n.popper[x-placement^=\"bottom\"] {\n  margin-top: 5px;\n}\n.popper[x-placement^=\"bottom\"] .popper__arrow {\n  border-width: 0 5px 5px 5px;\n  border-color: transparent transparent #fafafa transparent;\n  top: -5px;\n  left: calc(50% - 5px);\n  margin-top: 0;\n  margin-bottom: 0;\n}\n.popper[x-placement^=\"right\"] {\n  margin-left: 5px;\n}\n.popper[x-placement^=\"right\"] .popper__arrow {\n  border-width: 5px 5px 5px 0;\n  border-color: transparent #fafafa transparent transparent;\n  left: -5px;\n  top: calc(50% - 5px);\n  margin-left: 0;\n  margin-right: 0;\n}\n.popper[x-placement^=\"left\"] {\n  margin-right: 5px;\n}\n.popper[x-placement^=\"left\"] .popper__arrow {\n  border-width: 5px 0 5px 5px;\n  border-color: transparent transparent transparent #fafafa;\n  right: -5px;\n  top: calc(50% - 5px);\n  margin-left: 0;\n  margin-right: 0;\n}\n", map: { "version": 3, "sources": ["/Users/igor/projects/vue-popper/src/component/popper.js.vue"], "names": [], "mappings": ";AACA;EACA,YAAA;EACA,0BAAA;EACA,eAAA;EACA,mBAAA;EACA,aAAA;EACA,sBAAA;EACA,mBAAA;EACA,mBAAA;EACA,gBAAA;EACA,oBAAA;EACA,0BAAA;EACA,gBAAA;EACA,2CAAA;EACA,8CAAA;EACA,sCAAA;CACA;AAEA;EACA,SAAA;EACA,UAAA;EACA,oBAAA;EACA,mBAAA;EACA,YAAA;CACA;AAEA;EACA,mBAAA;CACA;AAEA;EACA,4BAAA;EACA,0DAAA;EACA,aAAA;EACA,sBAAA;EACA,cAAA;EACA,iBAAA;CACA;AAEA;EACA,gBAAA;CACA;AAEA;EACA,4BAAA;EACA,0DAAA;EACA,UAAA;EACA,sBAAA;EACA,cAAA;EACA,iBAAA;CACA;AAEA;EACA,iBAAA;CACA;AAEA;EACA,4BAAA;EACA,0DAAA;EACA,WAAA;EACA,qBAAA;EACA,eAAA;EACA,gBAAA;CACA;AAEA;EACA,kBAAA;CACA;AAEA;EACA,4BAAA;EACA,0DAAA;EACA,YAAA;EACA,qBAAA;EACA,eAAA;EACA,gBAAA;CACA", "file": "popper.js.vue", "sourcesContent": ["<style>\n  .popper {\n    width: auto;\n    background-color: #fafafa;\n    color: #212121;\n    text-align: center;\n    padding: 2px;\n    display: inline-block;\n    border-radius: 3px;\n    position: absolute;\n    font-size: 14px;\n    font-weight: normal;\n    border: 1px #ebebeb solid;\n    z-index: 200000;\n    -moz-box-shadow: rgb(58, 58, 58) 0 0 6px 0;\n    -webkit-box-shadow: rgb(58, 58, 58) 0 0 6px 0;\n    box-shadow: rgb(58, 58, 58) 0 0 6px 0;\n  }\n\n  .popper .popper__arrow {\n    width: 0;\n    height: 0;\n    border-style: solid;\n    position: absolute;\n    margin: 5px;\n  }\n\n  .popper[x-placement^=\"top\"] {\n    margin-bottom: 5px;\n  }\n\n  .popper[x-placement^=\"top\"] .popper__arrow {\n    border-width: 5px 5px 0 5px;\n    border-color: #fafafa transparent transparent transparent;\n    bottom: -5px;\n    left: calc(50% - 5px);\n    margin-top: 0;\n    margin-bottom: 0;\n  }\n\n  .popper[x-placement^=\"bottom\"] {\n    margin-top: 5px;\n  }\n\n  .popper[x-placement^=\"bottom\"] .popper__arrow {\n    border-width: 0 5px 5px 5px;\n    border-color: transparent transparent #fafafa transparent;\n    top: -5px;\n    left: calc(50% - 5px);\n    margin-top: 0;\n    margin-bottom: 0;\n  }\n\n  .popper[x-placement^=\"right\"] {\n    margin-left: 5px;\n  }\n\n  .popper[x-placement^=\"right\"] .popper__arrow {\n    border-width: 5px 5px 5px 0;\n    border-color: transparent #fafafa transparent transparent;\n    left: -5px;\n    top: calc(50% - 5px);\n    margin-left: 0;\n    margin-right: 0;\n  }\n\n  .popper[x-placement^=\"left\"] {\n    margin-right: 5px;\n  }\n\n  .popper[x-placement^=\"left\"] .popper__arrow {\n    border-width: 5px 0 5px 5px;\n    border-color: transparent transparent transparent #fafafa;\n    right: -5px;\n    top: calc(50% - 5px);\n    margin-left: 0;\n    margin-right: 0;\n  }\n</style>\n\n<template>\n  <span>\n    <transition :name=\"transition\" :enter-active-class=\"enterActiveClass\" :leave-active-class=\"leaveActiveClass\" @after-leave=\"doDestroy\">\n      <span\n        ref=\"popper\"\n        v-show=\"!disabled && showPopper\">\n        <slot>{{ content }}</slot>\n      </span>\n    </transition>\n    <slot name=\"reference\"></slot>\n  </span>\n</template>\n\n<script>\n  import Popper from 'popper.js';\n\n  function on(element, event, handler) {\n    if (element && event && handler) {\n      document.addEventListener ? element.addEventListener(event, handler, false) : element.attachEvent('on' + event, handler);\n    }\n  }\n\n  function off(element, event, handler) {\n    if (element && event) {\n      document.removeEventListener ? element.removeEventListener(event, handler, false) : element.detachEvent('on' + event, handler)\n    }\n  }\n\n  export default {\n    props: {\n      trigger: {\n        type: String,\n        default: 'hover',\n        validator: value => ['click', 'hover'].indexOf(value) > -1\n      },\n      delayOnMouseOver: {\n        type: Number,\n        default: 10,\n      },\n      delayOnMouseOut: {\n        type: Number,\n        default: 10,\n      },\n      disabled: {\n        type: Boolean,\n        default: false\n      },\n      content: String,\n      enterActiveClass: String,\n      leaveActiveClass: String,\n      boundariesSelector: String,\n      reference: {},\n      forceShow: {\n        type: Boolean,\n        default: false\n      },\n      dataValue: {\n        default: null,\n      },\n      appendToBody: {\n        type: Boolean,\n        default: false\n      },\n      visibleArrow: {\n        type: Boolean,\n        default: true\n      },\n      transition: {\n        type: String,\n        default: ''\n      },\n      options: {\n        type: Object,\n        default() {\n          return {};\n        }\n      }\n    },\n\n    data() {\n      return {\n        referenceElm: null,\n        popperJS: null,\n        showPopper: false,\n        currentPlacement: '',\n        popperOptions: {\n          placement: 'bottom',\n          computeStyle: {\n            gpuAcceleration: false\n          }\n        }\n      };\n    },\n\n    watch: {\n      showPopper(value) {\n        if (value) {\n          this.$emit('show', this);\n          if (this.popperJS) {\n            this.popperJS.enableEventListeners();\n          }\n          this.updatePopper();\n        } else {\n          if (this.popperJS) {\n            this.popperJS.disableEventListeners();\n          }\n          this.$emit('hide', this);\n        }\n      },\n\n      forceShow: {\n        handler(value) {\n          this[value ? 'doShow' : 'doClose']();\n        },\n        immediate: true\n      },\n\n      disabled(value) {\n        if (value) {\n          this.showPopper = false;\n        }\n      }\n    },\n\n    created() {\n      this.appendedArrow = false;\n      this.appendedToBody = false;\n      this.popperOptions = Object.assign(this.popperOptions, this.options);\n    },\n\n    mounted() {\n      this.referenceElm = this.reference || this.$slots.reference[0].elm;\n      this.popper = this.$slots.default[0].elm;\n\n      switch (this.trigger) {\n        case 'click':\n          on(this.referenceElm, 'click', this.doToggle);\n          on(document, 'click', this.handleDocumentClick);\n          break;\n        case 'hover':\n          on(this.referenceElm, 'mouseover', this.onMouseOver);\n          on(this.referenceElm, 'focus', this.onMouseOver);\n          on(this.popper, 'mouseover', this.onMouseOver);\n          on(this.popper, 'focus', this.onMouseOver);\n          on(this.referenceElm, 'mouseout', this.onMouseOut);\n          on(this.referenceElm, 'blur', this.onMouseOut);\n          on(this.popper, 'mouseout', this.onMouseOut);\n          on(this.popper, 'blur', this.onMouseOut);\n          break;\n      }\n    },\n\n    methods: {\n      doToggle() {\n        if (!this.forceShow) {\n          this.showPopper = !this.showPopper;\n        }\n      },\n\n      doShow() {\n        this.showPopper = true;\n      },\n\n      doClose() {\n        this.showPopper = false;\n      },\n\n      doDestroy() {\n        if (this.showPopper) {\n          return;\n        }\n\n        if (this.popperJS) {\n          this.popperJS.destroy();\n          this.popperJS = null;\n        }\n\n        if (this.appendedToBody) {\n          this.appendedToBody = false;\n          document.body.removeChild(this.popper.parentElement);\n        }\n      },\n\n      createPopper() {\n        this.$nextTick(() => {\n          if (this.visibleArrow) {\n            this.appendArrow(this.popper);\n          }\n\n          if (this.appendToBody && !this.appendedToBody) {\n            this.appendedToBody = true;\n            document.body.appendChild(this.popper.parentElement);\n          }\n\n          if (this.popperJS && this.popperJS.destroy) {\n            this.popperJS.destroy();\n          }\n\n          if (this.boundariesSelector) {\n            const boundariesElement = document.querySelector(this.boundariesSelector);\n\n            if (boundariesElement) {\n              this.popperOptions.modifiers = Object.assign({}, this.popperOptions.modifiers);\n              this.popperOptions.modifiers.preventOverflow = Object.assign({}, this.popperOptions.modifiers.preventOverflow);\n              this.popperOptions.modifiers.preventOverflow.boundariesElement = boundariesElement;\n            }\n          }\n\n          this.popperOptions.onCreate = () => {\n            this.$emit('created', this);\n            this.$nextTick(this.updatePopper);\n          };\n\n          this.popperJS = new Popper(this.referenceElm, this.popper, this.popperOptions);\n        });\n      },\n\n      destroyPopper() {\n        off(this.referenceElm, 'click', this.doToggle);\n        off(this.referenceElm, 'mouseup', this.doClose);\n        off(this.referenceElm, 'mousedown', this.doShow);\n        off(this.referenceElm, 'focus', this.doShow);\n        off(this.referenceElm, 'blur', this.doClose);\n        off(this.referenceElm, 'mouseout', this.onMouseOut);\n        off(this.referenceElm, 'mouseover', this.onMouseOver);\n        off(document, 'click', this.handleDocumentClick);\n\n        this.showPopper = false;\n        this.doDestroy();\n      },\n\n      appendArrow(element) {\n        if (this.appendedArrow) {\n          return;\n        }\n\n        this.appendedArrow = true;\n\n        const arrow = document.createElement('div');\n        arrow.setAttribute('x-arrow', '');\n        arrow.className = 'popper__arrow';\n        element.appendChild(arrow);\n      },\n\n      updatePopper() {\n        this.popperJS ? this.popperJS.scheduleUpdate() : this.createPopper();\n      },\n\n      onMouseOver() {\n        clearTimeout(this._timer);\n        this._timer = setTimeout(() => {\n          this.showPopper = true;\n        }, this.delayOnMouseOver);\n      },\n\n      onMouseOut() {\n        clearTimeout(this._timer);\n        this._timer = setTimeout(() => {\n          this.showPopper = false;\n        }, this.delayOnMouseOut);\n      },\n\n      handleDocumentClick(e) {\n        if (!this.$el || !this.referenceElm ||\n          this.elementContains(this.$el, e.target) ||\n          this.elementContains(this.referenceElm, e.target) ||\n          !this.popper || this.elementContains(this.popper, e.target)\n        ) {\n          return;\n        }\n\n        this.$emit('documentClick', this);\n\n        if (this.forceShow) {\n          return;\n        }\n\n        this.showPopper = false;\n      },\n\n      elementContains(elm, otherElm) {\n        if (typeof elm.contains === 'function') {\n          return elm.contains(otherElm);\n        }\n\n        return false;\n      }\n    },\n\n    destroyed() {\n      this.destroyPopper();\n    }\n  }\n</script>\n"] }, media: undefined });
  };
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* component normalizer */
  function __vue_normalize__(template, style, script$$1, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "/Users/igor/projects/vue-popper/src/component/popper.js.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    {
      var hook = void 0;
      if (style) {
        hook = function hook(context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook !== undefined) {
        if (component.functional) {
          // register for functional component in vue file
          var originalRender = component.render;
          component.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context);
          };
        } else {
          // inject component registration as beforeCreate hook
          var existing = component.beforeCreate;
          component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }
    }

    return component;
  }
  /* style inject */
  function __vue_create_injector__() {
    var head = document.head || document.getElementsByTagName('head')[0];
    var styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
    var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

    return function addStyle(id, css) {
      if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

      if (!style.ids.includes(id)) {
        var code = css.source;
        var index = style.ids.length;

        style.ids.push(id);

        if (isOldIE) {
          style.element = style.element || document.querySelector('style[data-group=' + group + ']');
        }

        if (!style.element) {
          var el = style.element = document.createElement('style');
          el.type = 'text/css';

          if (css.media) el.setAttribute('media', css.media);
          if (isOldIE) {
            el.setAttribute('data-group', group);
            el.setAttribute('data-next-index', '0');
          }

          head.appendChild(el);
        }

        if (isOldIE) {
          index = parseInt(style.element.getAttribute('data-next-index'));
          style.element.setAttribute('data-next-index', index + 1);
        }

        if (style.element.styleSheet) {
          style.parts.push(code);
          style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
        } else {
          var textNode = document.createTextNode(code);
          var nodes = style.element.childNodes;
          if (nodes[index]) style.element.removeChild(nodes[index]);
          if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
        }
      }
    };
  }
  /* style inject SSR */

  var VuePopper = __vue_normalize__({ render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ }, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, __vue_create_injector__, undefined);

  return VuePopper;

})));
