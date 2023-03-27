// pages/podcast/podcast.js
import { getVideoTabList, getVideoListData, getVideoUrl } from '../../services/video'

Page({
    /**
     * Page initial data
     */
    data: {
        videoTabList: [],
        videoList: [],
        active: '',
        videoId: '',
        videoUpdateTime: [],
        currentTime: '',
        isTriggered: false
    },

    onChange(event) {
        this.setData({
            active: event.detail.name,
            videoList: []
        })
        wx.showLoading({
            title: '加载中...'
        })

        getVideoListData({ id: this.data.active }).then(result => {
            result.map(item => {
                item.then(value => {
                    this.setData({
                        videoList: [...this.data.videoList, value]
                    })
                })
            })
        })
    },

    handlePlay(event) {
        const vid = event.currentTarget.id
        this.setData({
            videoId: vid
        })
        this.videoContext = wx.createVideoContext(vid)
        let { videoUpdateTime } = this.data
        let videoItem = videoUpdateTime.find(item => item.vid === vid)
        if (videoItem) {
            this.setData({
                currentTime: videoItem.currentTime
            })
        }
        this.videoContext.play()
    },

    handleEnded(event) {
        let { videoUpdateTime } = this.data
        this.setData({
            videoUpdateTime: videoUpdateTime.filter(item => item.vid !== event.currentTarget.id)
        })
    },

    handleTimeUpdate(event) {
        let videoTimeObj = { vid: event.currentTarget.id, currentTime: event.detail.currentTime }
        let { videoUpdateTime } = this.data
        let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
        if (videoItem) {
            videoItem.currentTime = videoTimeObj.currentTime
        } else {
            videoUpdateTime.push(videoTimeObj)
        }

        this.setData({
            videoUpdateTime
        })
    },

    handleRefresher(event) {
        this.setData({
            videoList: []
        })
        getVideoListData({ id: this.data.active }).then(result => {
            result.map(item => {
                item.then(value => {
                    this.setData({
                        videoList: [...this.data.videoList, value]
                    })
                })
            })
            this.setData({
                isTriggered: false
            })
        })
    },

    handleToLower() {
        getVideoListData({ id: this.data.active }).then(result => {
            result.map(item => {
                item.then(value => {
                    this.setData({
                        videoList: [...this.data.videoList, value]
                    })
                })
            })
        })
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        getVideoTabList()
            .then(result => {
                if (result.code === 200) {
                    this.setData({
                        videoTabList: result.data.slice(0, 14),
                        active: result.data[0].id
                    })
                    this.selectComponent('#tabs').resize()

                    return getVideoListData({ id: this.data.active })
                }
            })
            .then(result => {
                result.map(item => {
                    item.then(value => {
                        this.setData({
                            videoList: [...this.data.videoList, value]
                        })
                    })
                })
            })
            .catch(error => {
                throw new Error(error.message)
            })
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
