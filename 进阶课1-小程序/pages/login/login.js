// pages/login/login.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
  },
  naviToCard() {
    const {
      nickName,
      avatarUrl
    } = this.data.userInfo
    if (nickName) {
      wx.navigateTo({
        url: `/pages/index/index?nickname=${nickName}&avatarurl=${avatarUrl}`
      })
    } else {
      wx.showToast({
        title: '请填写您的昵称',
        icon: 'error'
      })
    }

  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
    })
  },
  onInputChange(e) {
    const nickName = e.detail.value
    this.setData({
      "userInfo.nickName": nickName,
    })
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '在贺卡中显示你的个人信息', // 声明获取用户个人信息后的用途
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

})