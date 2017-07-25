(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('popper.js')) :
	typeof define === 'function' && define.amd ? define(['popper.js'], factory) :
	(global.VuePopper = factory(global.Popper));
}(this, (function (Popper) { 'use strict';

Popper = 'default' in Popper ? Popper['default'] : Popper;

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

var VuePopper$1 = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('span', [_c('transition', { attrs: { "name": _vm.transition, "enter-active-class": _vm.enterActiveClass, "leave-active-class": _vm.leaveActiveClass }, on: { "after-leave": _vm.doDestroy } }, [_c('span', { directives: [{ name: "show", rawName: "v-show", value: !_vm.disabled && _vm.showPopper, expression: "!disabled && showPopper" }], ref: "popper" }, [_vm._t("default", [_vm._v(_vm._s(_vm.content))])], 2)]), _vm._t("reference")], 2);
  }, staticRenderFns: [],
  props: {
    trigger: {
      type: String,
      default: 'hover',
      validator: function validator(value) {
        return ['click', 'hover'].indexOf(value) > -1;
      }
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
        gpuAcceleration: false
      }
    };
  },


  watch: {
    showPopper: function showPopper(value) {
      if (value) {
        this.$emit('show');
        this.updatePopper();
      } else {
        this.$emit('hide');
      }
    },


    forceShow: {
      handler: function handler(value) {
        this[value ? 'doShow' : 'doClose']();
      },

      immediate: true
    }
  },

  created: function created() {
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
        on(this.popper, 'mouseover', this.onMouseOver);
        on(this.referenceElm, 'mouseout', this.onMouseOut);
        on(this.popper, 'mouseout', this.onMouseOut);
        break;
    }

    this.createPopper();
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
      if (this.showPopper || !this.popperJS) {
        return;
      }

      this.popperJS.destroy();
      this.popperJS = null;
    },
    createPopper: function createPopper() {
      var _this = this;

      this.$nextTick(function () {
        if (_this.visibleArrow) {
          _this.appendArrow(_this.popper);
        }

        if (_this.appendToBody) {
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

      this.popperJS = null;
    },
    appendArrow: function appendArrow(element) {
      if (this.appended) {
        return;
      }

      this.appended = true;

      var arrow = document.createElement('div');
      arrow.setAttribute('x-arrow', '');
      arrow.className = 'popper__arrow';
      element.appendChild(arrow);
    },
    updatePopper: function updatePopper() {
      this.popperJS ? this.popperJS.update() : this.createPopper();
    },
    onMouseOver: function onMouseOver() {
      this.showPopper = true;
      clearTimeout(this._timer);
    },
    onMouseOut: function onMouseOut() {
      var _this2 = this;

      this._timer = setTimeout(function () {
        _this2.showPopper = false;
      }, this.delayOnMouseOut);
    },
    handleDocumentClick: function handleDocumentClick(e) {
      if (!this.$el || !this.referenceElm || this.$el.contains(e.target) || this.referenceElm.contains(e.target) || !this.popper || this.popper.contains(e.target) || this.forceShow) {
        return;
      }

      this.showPopper = false;
    }
  },

  destroyed: function destroyed() {
    this.destroyPopper();
  }
};

return VuePopper$1;

})));
