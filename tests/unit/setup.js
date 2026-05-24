// Jest 测试环境设置
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = String(value); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};

global.sessionStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = String(value); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// 模拟 DOM 方法
global.document = {
  createElement: (tag) => ({
    tagName: tag.toUpperCase(),
    className: '',
    classList: {
      classes: [],
      add(c) { this.classes.push(c); },
      remove(c) { this.classes = this.classes.filter(x => x !== c); },
      contains(c) { return this.classes.includes(c); },
      toggle(c, force) {
        if (force !== undefined) {
          if (force) this.add(c);
          else this.remove(c);
          return force;
        }
        if (this.contains(c)) { this.remove(c); return false; }
        else { this.add(c); return true; }
      }
    },
    style: {},
    appendChild: () => {},
    remove: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    setAttribute: () => {},
    getAttribute: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    textContent: '',
    innerHTML: '',
    dataset: {}
  }),
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  body: {
    appendChild: () => {},
    removeChild: () => {},
    classList: { add: () => {}, remove: () => {} }
  },
  addEventListener: () => {},
  removeEventListener: () => {}
};

// 模拟 window
global.window = {
  location: { href: 'http://localhost:8000', search: '' },
  addEventListener: () => {},
  removeEventListener: () => {},
  localStorage: global.localStorage,
  sessionStorage: global.sessionStorage
};

// 加载被测模块
global.GoEngine = require('../../js/go-engine.js');
global.GoGame = require('../../js/game.js');
global.Storage = require('../../js/storage.js');
const utils = require('../../js/utils.js');
global.showToast = utils.showToast;
global.debounce = utils.debounce;
global.showErrorBoundary = utils.showErrorBoundary;

// 加载被测模块前清理缓存
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});
