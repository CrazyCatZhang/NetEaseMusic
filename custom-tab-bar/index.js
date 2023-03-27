// custom-tab-bar/index.js
Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    active: '0',
    list: [
      {
        icon: {
          normal: '../static/tabbar/neteasemusic-not-active.png',
          active: '../static/tabbar/neteasemusic-active.png'
        },
        text: '发现',
        name: 'home',
        url: '/pages/index/index'
      },
      {
        icon: {
          normal: '../static/tabbar/podcast-not-active.png',
          active: '../static/tabbar/podcast-active.png'
        },
        text: '播客',
        name: 'podcast',
        url: '/pages/podcast/podcast'
      },
      {
        icon: {
          normal: '../static/tabbar/my-not-active.png',
          active: '../static/tabbar/my-active.png'
        },
        text: '我的',
        name: 'my',
        url: '/pages/my/my'
      },
      {
        icon: {
          normal: '../static/tabbar/follow-not-active.png',
          active: '../static/tabbar/follow-active.png'
        },
        text: '关注',
        name: 'follow',
        url: '/pages/follow/follow'
      },
      {
        icon: {
          normal: '../static/tabbar/community-not-active.png',
          active: '../static/tabbar/community-active.png'
        },
        text: '社区',
        name: 'community',
        url: '/pages/community/community'
      }
    ]
  },

  /**
   * Component methods
   */
  methods: {
    onChange(event) {
      this.setData({
        active: event.detail
      });
      wx.switchTab({
        url: this.data.list[event.detail].url,
      });
    },

    init() {
      const page = getCurrentPages().pop();
      this.setData({
        active: this.data.list.findIndex(item => item.url === `/${page.route}`)
      });
    }
  },
  options: {
    styleIsolation: 'shared'
  }
})
