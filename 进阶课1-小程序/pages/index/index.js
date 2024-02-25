// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

const backgroundMusic = wx.createInnerAudioContext({
  useWebAudioImplement: true
});
backgroundMusic.src = "https://music.163.com/song/media/outer/url?id=2044958868.mp3";
wx.setInnerAudioOption({
  obeyMuteSwitch: false
});
backgroundMusic.loop = true;
backgroundMusic.autoplay = true;

Page({
  data: {
    cardInfo: {
      toName: '',
      mainText: ''
    },
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: 'Name',
    },
    buttonMessage: '分享给朋友',
    isShare: false,
    isPause: false,
    musicButton: '../../static/pause.png',

  },
  onLoad(options) {
    const {
      nickname,
      avatarurl,
      toname,
      maintext,
      isshare
    } = options;
    backgroundMusic.stop();
    backgroundMusic.play();
    this.setData({
      "cardInfo.mainText": maintext || '',
      "cardInfo.toName": toname || '',
      "userInfo.avatarUrl": avatarurl || defaultAvatarUrl,
      "userInfo.nickName": nickname || '朋友',
      buttonMessage: isshare ? '制作我的贺卡' : '分享给朋友',
      isShare: isshare ? true : false,
    })
  },
  maintextInput(e) {
    //待做：限制字数500字
    const inputtext = e.detail.value;
    this.setData({
      "cardInfo.mainText": inputtext,
    })
  },

  toNameInput(e) {
    const inputtext = e.detail.value;
    this.setData({
      "cardInfo.toName": inputtext,
    })
  },

  tapMake() {
    console.log("jump")
    backgroundMusic.stop();
    this.setData({
      "musicButton": '../../static/play.png',
      isPause: true
    })
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  tapMusic() {
    console.log("tapmusic", this.data.isPause);
    if (this.data.isPause) {
      // this.data.isPause = false;
      backgroundMusic.play();
      this.setData({
        "musicButton": '../../static/pause.png',
        isPause: false
      })
    } else {
      // this.data.isPause = true;
      backgroundMusic.pause();
      this.setData({
        "musicButton": '../../static/play.png',
        isPause: true
      })
    }
    console.log(this.data.isPause);
  },

  tapShare() {
    const {
      toName,
      mainText
    } = this.data.cardInfo;
    if (toName && mainText) {
      onShareAppMessage
    }
  },

  onShareAppMessage() {
    const {
      nickName,
      avatarUrl
    } = this.data.userInfo
    const {
      toName,
      mainText
    } = this.data.cardInfo
    return {
      title: `你收到了来自${nickName}的贺卡~`,
      path: `pages/index/index?nickname=${nickName}&avatarurl=${avatarUrl}&toname=${toName}&maintext=${mainText}&isshare=1`
    }
  },
})