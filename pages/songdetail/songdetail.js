// pages/songdetail/songdetail.js
import { getSongDetail, getSongUrl } from '../../services/song'

const appInstance = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,
        song: {}
    },

    handleMusicPlay() {
        const isPlay = !this.data.isPlay
        this.musicControl(isPlay)
    },

    musicControl(isPlay) {
        if (isPlay) {
            getSongUrl({ id: this.data.song.id }).then(result => {
                const musicUrl = result.data[0].url
                this.backgroundAudioManager.src = musicUrl
                this.backgroundAudioManager.title = this.data.song.name
            })
        } else {
            this.backgroundAudioManager.pause()
        }
    },

    navigateBack() {
        wx.navigateBack()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const { musicId } = options
        getSongDetail({ ids: musicId }).then(result => {
            result.songs.map(item => {
                for (const iterator of item.ar) {
                    item.singer += '/' + iterator.name
                }
                item.singer = item.singer.substr(10)
            })
            this.setData({
                song: result.songs[0]
            })
        })

        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
            this.setData({
                isPlay: true
            })
        }

        this.backgroundAudioManager = wx.getBackgroundAudioManager()
        this.backgroundAudioManager.onPlay(() => {
            this.changePlayState(true)
            appInstance.globalData.musicId = musicId
        })
        this.backgroundAudioManager.onPause(() => {
            this.changePlayState(false)
        })
        this.backgroundAudioManager.onStop(() => {
            this.changePlayState(false)
        })
    },

    changePlayState(isPlay) {
        this.setData({
            isPlay
        })
        appInstance.globalData.isMusicPlay = isPlay
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {}
})
