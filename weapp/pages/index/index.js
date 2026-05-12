Page({
  data: {},

  onLoad() {},

  startGame(e) {
    const size = e.currentTarget.dataset.size;
    wx.navigateTo({
      url: `/pages/game/game?size=${size}`
    });
  }
})
