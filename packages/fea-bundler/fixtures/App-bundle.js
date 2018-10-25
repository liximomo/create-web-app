(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define(['react'], factory) :
  (global.App = factory(global.React));
}(this, (function (React) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  var Test2 = function Test2() {
    _classCallCheck(this, Test2);

    console.log(2);
  };

  var _jsxFileName = "/Users/mymomo/workspace/github/create-website/packages/fea-bundler/fixtures/App.js";

  var App =
  /*#__PURE__*/
  function (_Component) {
    _inherits(App, _Component);

    function App() {
      _classCallCheck(this, App);

      return _possibleConstructorReturn(this, _getPrototypeOf(App).apply(this, arguments));
    }

    _createClass(App, [{
      key: "render",
      value: function render() {
        return React__default.createElement("div", {
          className: "App",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 7
          },
          __self: this
        }, React__default.createElement("header", {
          className: "App-header",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 8
          },
          __self: this
        }, React__default.createElement("img", {
          src: "s",
          className: "App-logo",
          alt: "logo",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 9
          },
          __self: this
        }), React__default.createElement("p", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 10
          },
          __self: this
        }, "Edit ", React__default.createElement("code", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 11
          },
          __self: this
        }, "src/App.js"), " and save to reload."), React__default.createElement("a", {
          className: "App-link",
          href: "https://reactjs.org",
          target: "_blank",
          rel: "noopener noreferrer",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 13
          },
          __self: this
        }, "Learn React")));
      }
    }]);

    return App;
  }(React.Component);

  new App({}, {});
  new Test2();

  return App;

})));
