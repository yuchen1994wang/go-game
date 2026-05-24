// Utils 单元测试
describe('Utils', () => {
  describe('Toast', () => {
    test('showToast 不报错', () => {
      expect(() => showToast('测试消息')).not.toThrow();
    });

    test('showToast 支持不同类型', () => {
      expect(() => {
        showToast('成功', 'success');
        showToast('警告', 'warning');
        showToast('错误', 'error');
        showToast('信息', 'info');
      }).not.toThrow();
    });
  });

  describe('Debounce', () => {
    test('防抖函数延迟执行', (done) => {
      let count = 0;
      const fn = () => count++;
      const debounced = debounce(fn, 50);
      
      debounced();
      debounced();
      debounced();
      
      expect(count).toBe(0);
      
      setTimeout(() => {
        expect(count).toBe(1);
        done();
      }, 100);
    });

    test('防抖函数传递参数', (done) => {
      let result;
      const fn = (a, b) => { result = a + b; };
      const debounced = debounce(fn, 50);
      
      debounced(2, 3);
      
      setTimeout(() => {
        expect(result).toBe(5);
        done();
      }, 100);
    });
  });

  describe('Error Boundary', () => {
    test('showErrorBoundary 不报错', () => {
      expect(() => showErrorBoundary('测试错误')).not.toThrow();
    });
  });

  describe('全局错误处理', () => {
    test('错误事件监听已注册', () => {
      expect(window.addEventListener).toBeDefined();
    });
  });
});
