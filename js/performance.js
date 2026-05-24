// 性能优化工具
const PerformanceOptimizer = {
  cache: new Map(),
  debounceTimers: {},
  lazyLoadQueue: [],

  debounce(func, wait, key) {
    if (this.debounceTimers[key]) {
      clearTimeout(this.debounceTimers[key]);
    }
    
    this.debounceTimers[key] = setTimeout(() => {
      func.apply(this, arguments);
      delete this.debounceTimers[key];
    }, wait);
  },

  throttle(func, wait, key) {
    if (this.cache.has(key)) return;
    
    this.cache.set(key, true);
    func.apply(this, arguments);
    
    setTimeout(() => {
      this.cache.delete(key);
    }, wait);
  },

  memoize(func, keyGenerator) {
    const cache = new Map();
    
    return function(...args) {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = func.apply(this, args);
      cache.set(key, result);
      
      if (cache.size > 100) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      
      return result;
    };
  },

  lazyLoad(element, callback, options = {}) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          if (!options.keep) {
            observer.unobserve(entry.target);
          }
        }
      });
    }, {
      rootMargin: options.rootMargin || '50px',
      threshold: options.threshold || 0
    });

    observer.observe(element);
    return observer;
  },

  prefetch(url, options = {}) {
    if (document.readyState === 'complete') {
      const link = document.createElement('link');
      link.rel = options.as || 'script';
      link.href = url;
      document.head.appendChild(link);
    }
  },

  optimizeImages(container) {
    const images = container.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
      this.lazyLoad(img, (target) => {
        target.src = target.dataset.src;
        target.removeAttribute('data-src');
      }, { rootMargin: '100px' });
    });
  },

  batchDOMUpdates(callback) {
    requestAnimationFrame(() => {
      callback();
    });
  },

  measurePerformance(label, func) {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    
    console.log(`${label} 执行时间: ${(end - start).toFixed(2)}ms`);
    return result;
  },

  createVirtualList(container, items, renderItem, options = {}) {
    const itemHeight = options.itemHeight || 50;
    const bufferSize = options.bufferSize || 5;
    let scrollTop = 0;
    let containerHeight = container.clientHeight;

    const content = document.createElement('div');
    content.style.cssText = `height: ${items.length * itemHeight}px; position: relative;`;
    container.appendChild(content);

    const renderRange = () => {
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
      const endIndex = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / itemHeight) + bufferSize);

      content.innerHTML = '';
      
      for (let i = startIndex; i < endIndex; i++) {
        const itemEl = renderItem(items[i], i);
        itemEl.style.cssText = `position: absolute; top: ${i * itemHeight}px; width: 100%;`;
        content.appendChild(itemEl);
      }
    };

    container.addEventListener('scroll', () => {
      scrollTop = container.scrollTop;
      this.debounce(renderRange, 16, 'virtualList');
    });

    renderRange();
    return { refresh: renderRange };
  }
};

// 内存管理
const MemoryManager = {
  maxCacheSize: 50,
  caches: new Map(),

  registerCache(name, maxSize = this.maxCacheSize) {
    this.caches.set(name, {
      data: new Map(),
      maxSize,
      hits: 0,
      misses: 0
    });
  },

  set(name, key, value) {
    const cache = this.caches.get(name);
    if (!cache) return;

    if (cache.data.size >= cache.maxSize) {
      const firstKey = cache.data.keys().next().value;
      cache.data.delete(firstKey);
    }

    cache.data.set(key, value);
  },

  get(name, key) {
    const cache = this.caches.get(name);
    if (!cache) return null;

    if (cache.data.has(key)) {
      cache.hits++;
      return cache.data.get(key);
    }

    cache.misses++;
    return null;
  },

  clear(name) {
    const cache = this.caches.get(name);
    if (cache) {
      cache.data.clear();
    }
  },

  clearAll() {
    this.caches.forEach(cache => cache.data.clear());
  },

  getStats() {
    const stats = {};
    this.caches.forEach((cache, name) => {
      stats[name] = {
        size: cache.data.size,
        maxSize: cache.maxSize,
        hits: cache.hits,
        misses: cache.misses,
        hitRate: cache.hits + cache.misses > 0 
          ? (cache.hits / (cache.hits + cache.misses) * 100).toFixed(2) + '%'
          : '0%'
      };
    });
    return stats;
  }
};

// Canvas 优化
class CanvasOptimizer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', {
      alpha: options.alpha !== undefined ? options.alpha : false,
      desynchronized: options.desynchronized || true
    });
    this.layers = new Map();
    this.dirty = false;
  }

  createLayer(name) {
    const offscreen = document.createElement('canvas');
    offscreen.width = this.canvas.width;
    offscreen.height = this.canvas.height;
    
    const ctx = offscreen.getContext('2d', {
      alpha: true,
      desynchronized: true
    });

    this.layers.set(name, { canvas: offscreen, ctx, dirty: true });
    return ctx;
  }

  invalidate(name) {
    const layer = this.layers.get(name);
    if (layer) {
      layer.dirty = true;
      this.dirty = true;
    }
  }

  invalidateAll() {
    this.layers.forEach(layer => {
      layer.dirty = true;
    });
    this.dirty = true;
  }

  render() {
    if (!this.dirty) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.layers.forEach(layer => {
      if (layer.dirty) {
        this.ctx.drawImage(layer.canvas, 0, 0);
        layer.dirty = false;
      }
    });

    this.dirty = false;
  }

  dispose() {
    this.layers.forEach(layer => {
      layer.canvas.width = 0;
      layer.canvas.height = 0;
    });
    this.layers.clear();
  }
}
