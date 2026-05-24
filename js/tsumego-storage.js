// 死活题进度和错题存储管理
const TsumegoStorage = {
  PROGRESS_KEY: 'go_tsumego_progress',
  WRONG_KEY: 'go_tsumego_wrong',
  BEST_KEY: 'go_tsumego_best',
  BEST_STEPS_KEY: 'go_tsumego_best_steps',

  // 保存当前题目进度
  saveProgress(problemId, state) {
    try {
      const progress = this.getProgress();
      progress[problemId] = {
        ...state,
        lastUpdate: Date.now()
      };
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  },

  // 获取所有进度
  getProgress() {
    try {
      const data = localStorage.getItem(this.PROGRESS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  // 获取单个题目进度
  getProblemProgress(problemId) {
    const progress = this.getProgress();
    return progress[problemId];
  },

  // 添加到错题本
  addToWrongList(problemId) {
    try {
      const wrong = this.getWrongList();
      if (!wrong.includes(problemId)) {
        wrong.push(problemId);
        localStorage.setItem(this.WRONG_KEY, JSON.stringify(wrong));
      }
    } catch (e) {
      console.error('Failed to add to wrong list:', e);
    }
  },

  // 从错题本移除
  removeFromWrongList(problemId) {
    try {
      const wrong = this.getWrongList();
      const index = wrong.indexOf(problemId);
      if (index > -1) {
        wrong.splice(index, 1);
        localStorage.setItem(this.WRONG_KEY, JSON.stringify(wrong));
      }
    } catch (e) {
      console.error('Failed to remove from wrong list:', e);
    }
  },

  // 获取错题本
  getWrongList() {
    try {
      const data = localStorage.getItem(this.WRONG_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // 保存最佳成绩（时间）
  saveBestTime(problemId, time) {
    try {
      const best = this.getBestTimes();
      if (!best[problemId] || time < best[problemId]) {
        best[problemId] = time;
        localStorage.setItem(this.BEST_KEY, JSON.stringify(best));
      }
    } catch (e) {
      console.error('Failed to save best time:', e);
    }
  },

  // 获取所有最佳成绩
  getBestTimes() {
    try {
      const data = localStorage.getItem(this.BEST_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  // 获取单个题目最佳成绩
  getBestTime(problemId) {
    const best = this.getBestTimes();
    return best[problemId];
  },

  // 保存最佳步数（多步题用）
  saveBestSteps(problemId, steps) {
    try {
      const best = this.getAllBestSteps();
      if (!best[problemId] || steps < best[problemId]) {
        best[problemId] = steps;
        localStorage.setItem(this.BEST_STEPS_KEY, JSON.stringify(best));
      }
    } catch (e) {
      console.error('Failed to save best steps:', e);
    }
  },

  // 获取所有最佳步数
  getAllBestSteps() {
    try {
      const data = localStorage.getItem(this.BEST_STEPS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  // 获取单个题目最佳步数
  getBestSteps(problemId) {
    const best = this.getAllBestSteps();
    return best[problemId];
  },

  // 格式化时间显示
  formatTime(ms) {
    if (!ms) {return '--';}
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return `${minutes}分${secs}秒`;
    }
    return `${secs}秒`;
  },

  // 获取题目状态
  getStatus(problemId) {
    const progress = this.getProgress();
    return progress[problemId]?.status || null;
  },

  // 获取尝试次数
  getAttempts(problemId) {
    const progress = this.getProgress();
    return progress[problemId]?.attempts || 0;
  },

  // 获取正确次数
  getCorrect(problemId) {
    const progress = this.getProgress();
    return progress[problemId]?.correct || 0;
  },

  // 清空所有数据（重置）
  clearAll() {
    localStorage.removeItem(this.PROGRESS_KEY);
    localStorage.removeItem(this.WRONG_KEY);
    localStorage.removeItem(this.BEST_KEY);
    localStorage.removeItem(this.BEST_STEPS_KEY);
  }
};
