// pages/my/my.js
import { getUserDetails, getLikeList, getPlayList } from '../../services/user'

Page({
    /**
     * Page initial data
     */
    data: {
        userInfo: {},
        userDetails: {},
        favoriteList: [],
        createList: [],
        collectList: []
    },

    toLogin() {
        wx.navigateTo({
            url: '/pages/login/login'
        })
    },

    toRecentlyPlay() {
        wx.navigateTo({
            url: '/pages/recentlyplay/recentlyplay'
        })
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        if (wx.getStorageSync('userInfo')) {
            this.setData({
                userInfo: JSON.parse(wx.getStorageSync('userInfo'))
            })
            getUserDetails({ uid: this.data.userInfo.userId }).then(result => {
                this.setData({
                    userDetails: result
                })
            })
            getPlayList({ uid: this.data.userInfo.userId }).then(result => {
                this.setData({
                    favoriteList: result.playlist[0],
                    createList: result.playlist.filter(item => item.userId === this.data.userInfo.userId).slice(1),
                    collectList: result.playlist.filter(item => item.userId !== this.data.userInfo.userId)
                })
            })
        }
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady() {},

    /**
     * Lifecycle function--Called when page show
     */
    onShow() {
        this.getTabBar().init()
    },

    /**
     * Lifecycle function--Called when page hide
     */
    onHide() {},

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload() {},

    /**
     * Page event handler function--Called when user drop down
     */
    onPullDownRefresh() {},

    /**
     * Called when page reach bottom
     */
    onReachBottom() {},

    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage() {}
})
