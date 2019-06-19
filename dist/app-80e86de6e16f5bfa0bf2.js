/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/app.js":
/*!*******************!*\
  !*** ./js/app.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar chartID = 'chart';\nvar socket = io('/monitor');\nvar labelFormater = 'HH:mm';\nvar chartInit = false;\nvar render_data = {};\n\nfunction renderTitle(data) {\n  return \"\".concat(data.title || '', \" <br /> CO2: \").concat(data.co2ppm, \" PPM, TEMP: \").concat(data.temperature, \"\\u2103, \").concat(moment(data.timestamp).format('LTS'));\n}\n\nfunction renderLael(date) {\n  return moment(date).format(labelFormater);\n}\n\nvar tickvals = [moment().add(5, 'minutes').format(labelFormater)];\nvar period = 5;\n\nfor (var index = 1; index <= 60 / period; index++) {\n  var m = moment().subtract(index * period, 'minutes').format(labelFormater);\n  tickvals.push(m);\n}\n\ntickvals = tickvals.reverse();\nsocket.on('lastRecords', function (_ref) {\n  var data = _ref.data,\n      title = _ref.title;\n  render_data = {\n    y: data.map(function (d) {\n      return d.co2ppm;\n    })\n  };\n  var c = Object.assign({}, render_data, {\n    type: 'scatter'\n  });\n  Plotly.plot(chartID, [c], {\n    title: renderTitle(_objectSpread({}, data[0], {\n      title: title\n    })),\n    xaxis: {\n      tickvals: tickvals\n    }\n  }, {\n    responsive: true\n  });\n  socket.on('newRecord', function (data) {\n    // remove last data\n    render_data.y.shift();\n    render_data.y.push(data.co2ppm);\n    Plotly.update(chartID, {\n      y: [render_data.y]\n    }, {\n      title: renderTitle(_objectSpread({}, data, {\n        title: title\n      }))\n    });\n  });\n}); // const chartID = 'chart'\n// const socket = io('/monitor')\n// const labelFormater = 'HH:mm'\n// var chartInit = false\n// var render_data = {}\n// function renderTitle(data) {\n//   return `ROOM MONITOR, lastest 5 mins <br /> CO2: ${data.co2ppm} PPM, TEMP: ${data.temperature}℃, ${moment(data.timestamp).format('LTS')}`\n// }\n// function renderLael(date) {\n//   return moment(date).format(labelFormater)\n// }\n// var tickvals = [\n//   moment().add(5, 'minutes').format(labelFormater)\n// ]\n// var period = 5\n// for (let index = 1; index <= 60/period; index++) {\n//   let m = moment().subtract(index * period, 'minutes').format(labelFormater)\n//   tickvals.push(m)\n// }\n// tickvals = tickvals.reverse()\n// socket.on('lastRecords', socket => {\n//   const { data } = socket\n//   render_data = {\n//     y: data.map(d => { return d.co2ppm}),\n//     // x: data.map(d => {\n//     //   return renderLael(d.timestamp)\n//     // }),\n//   }\n//   let c = Object.assign({}, render_data, {\n//     type: 'scatter'\n//   })\n//   Plotly.plot(chartID, [c],\n//   {\n//     title: renderTitle(data[0]),\n//     xaxis: { tickvals }\n//   },\n//   {\n//     responsive: true\n//   })\n//   chartInit = true\n// })\n// socket.on('newRecord', data => {\n//   if (!chartInit) {\n//     return false\n//   }\n//   // remove last data\n//   render_data.y.shift()\n//   // render_data.x.shift()\n//   let label = renderLael(data.timestamp)\n//   render_data.y.push(data.co2ppm)\n//   // render_data.x.push(label)\n//   let diff = moment().diff(moment(tickvals[tickvals.length-1]), 'minutes')\n//   console.log('moment()', moment(tickvals[tickvals.length-1]))\n//   console.log('diff', diff)\n//   if ( diff >= 15 ) {\n//     let last = tickvals.shift()\n//     tickvals.push(renderLael(label))\n//   }\n//   // console.log('render_data.x', render_data.x)\n//   // console.log('tickvals', tickvals)\n//   Plotly.update(chartID, {\n//     y: [render_data.y],\n//     // x: [render_data.x]\n//   }, {\n//     title: renderTitle(data),\n//     // xaxis: { tickvals }\n//   })\n\n//# sourceURL=webpack:///./js/app.js?");

/***/ })

/******/ });