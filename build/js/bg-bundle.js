(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chromeApiOmnibox = require('../chrome-api/omnibox');

var _chromeApiOmnibox2 = _interopRequireDefault(_chromeApiOmnibox);

var _chromeApiAlarm = require('../chrome-api/alarm');

var _chromeApiAlarm2 = _interopRequireDefault(_chromeApiAlarm);

var _chromeApiNotification = require('../chrome-api/notification');

var _chromeApiNotification2 = _interopRequireDefault(_chromeApiNotification);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

console.log('background script ready!!');

_chromeApiAlarm2['default'].setup();
_chromeApiNotification2['default'].title = 'Reminder';

var parseContentFrom = function parseContentFrom(text) {
  var parts = text.split(' ');
  parts.shift();
  return parts.join(' ');
};

var parseTimeFrom = function parseTimeFrom(text) {
  return {
    delayInMinutes: Number(text.split(' ')[0])
  };
};

var handleAlarm = function handleAlarm(name, message) {
  new Audio('../media/alarm.mp3').play();
  _chromeApiAlarm2['default'].clear(name);
  _chromeApiNotification2['default'].create({ message: message }, function () {});
};

_chromeApiOmnibox2['default'].onChange(function (text, suggest) {
  suggest([{ content: '10 alarmName', description: 'time | text' }]);
});

_chromeApiOmnibox2['default'].onSubmit(function (text) {
  text = text.trim();
  var content = parseContentFrom(text);
  var alarmName = Date.now().toString();

  _chromeApiAlarm2['default'].create(alarmName, parseTimeFrom(text), _utils2['default'].partial(handleAlarm, alarmName, content));

  var message = 'Alarm ' + content + ' set';
  _chromeApiNotification2['default'].create({ message: message }, function () {});
});

},{"../chrome-api/alarm":2,"../chrome-api/notification":3,"../chrome-api/omnibox":4,"../utils":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Alarm = {
  actions: {},

  create: function create(name, alarmInfo, fn) {
    chrome.alarms.create(name, alarmInfo);
    Alarm.actions[name] = fn;
  },

  listenAll: function listenAll() {
    chrome.alarms.onAlarm.addListener(function (elem) {
      Alarm.actions[elem.name]();
    });
  },

  clearAll: function clearAll(cb) {
    chrome.alarms.clearAll(cb);
  },

  clear: function clear(name) {
    chrome.alarms.clear(name);
  },

  setup: function setup() {
    Alarm.listenAll();
  }

};

exports["default"] = Alarm;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var Notification = {
  iconUrl: '../images/default-128.png',
  title: 'Set a title',
  type: 'basic',

  create: function create(data, cb) {
    data = data || {};
    cb = cb || function () {};
    var id = '' + new Date().getTime();

    chrome.notifications.create(id, {
      type: data.type || Notification.type,
      iconUrl: data.icon || Notification.iconUrl,
      title: data.title || Notification.title,
      message: data.message || ''
    }, cb);
  }
};

exports['default'] = Notification;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Omnibox = {
  onChange: function onChange(fn) {
    chrome.omnibox.onInputChanged.addListener(fn);
  },

  onSubmit: function onSubmit(fn) {
    chrome.omnibox.onInputEntered.addListener(fn);
  }
};

exports["default"] = Omnibox;
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var argsToArray = function argsToArray(args) {
  return args = Array.prototype.slice.call(args);
};

var utils = {
  partial: function partial(fn) {
    var pastArgs = argsToArray(arguments).slice(1);
    return function () {
      var newArgs = argsToArray(arguments);
      return fn.apply(null, pastArgs.concat(newArgs));
    };
  }
};

exports["default"] = utils;
module.exports = exports["default"];

},{}]},{},[1]);
