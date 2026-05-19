/**
 * 数据分析模块
 * 收集用户使用统计，帮助优化产品
 */
class Analytics {
  constructor() {
    this.storageKey = 'go_game_analytics';
    this.sessionStart = Date.now();
    this.pageViews = [];
    this.events = [];
    this.maxEvents = 100;
    
    this.init();
  }

  init() {
    // 页面加载时记录PV
    this.trackPageView();
    
    // 页面卸载时上报数据
    window.addEventListener('beforeunload', () => {
      this.trackEvent('session_end', {
        duration: Date.now() - this.sessionStart
      });
      this.save();
    });

    // 加载历史数据
    this.load();
  }

  // 记录页面访问
  trackPageView() {
    const pageView = {
      type: 'pageview',
      page: window.location.pathname,
      timestamp: Date.now(),
      referrer: document.referrer || null
    };
    
    this.pageViews.push(pageView);
    this.save();
  }

  // 记录自定义事件
  trackEvent(eventName, data = {}) {
    const event = {
      type: 'event',
      name: eventName,
      data,
      timestamp: Date.now(),
      page: window.location.pathname
    };
    
    this.events.push(event);
    
    // 限制事件数量
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    
    this.save();
  }

  // 记录功能使用
  trackFeature(featureName, details = {}) {
    this.trackEvent('feature_use', {
      feature: featureName,
      ...details
    });
  }

  // 记录错误
  trackError(errorType, errorMessage) {
    this.trackEvent('error', {
      errorType,
      errorMessage,
      url: window.location.href
    });
  }

  // 获取统计摘要
  getSummary() {
    const data = this.load();
    
    return {
      totalPageViews: data.pageViews?.length || 0,
      totalEvents: data.events?.length || 0,
      uniquePages: [...new Set(data.pageViews?.map(pv => pv.page) || [])],
      topFeatures: this.getTopFeatures(data.events),
      recentErrors: data.events?.filter(e => e.name === 'error').slice(-10) || []
    };
  }

  getTopFeatures(events) {
    const featureCounts = {};
    
    (events || [])
      .filter(e => e.name === 'feature_use')
      .forEach(e => {
        const feature = e.data?.feature || 'unknown';
        featureCounts[feature] = (featureCounts[feature] || 0) + 1;
      });
    
    return Object.entries(featureCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }

  // 保存到localStorage
  save() {
    try {
      const data = {
        pageViews: this.pageViews,
        events: this.events,
        lastUpdate: Date.now()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.warn('Analytics 保存失败:', e);
    }
  }

  // 从localStorage加载
  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.pageViews = data.pageViews || [];
        this.events = data.events || [];
        return data;
      }
    } catch (e) {
      console.warn('Analytics 加载失败:', e);
    }
    return {};
  }

  // 清除数据
  clear() {
    this.pageViews = [];
    this.events = [];
    localStorage.removeItem(this.storageKey);
  }
}

// 创建全局实例
const analytics = new Analytics();

// 便捷函数
function trackEvent(name, data) {
  analytics.trackEvent(name, data);
}

function trackFeature(feature, details) {
  analytics.trackFeature(feature, details);
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Analytics, analytics, trackEvent, trackFeature };
}
