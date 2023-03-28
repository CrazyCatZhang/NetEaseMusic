// pages/songdetail/songdetail.js
import { getSongDetail, getSongUrl } from '../../services/song'
import PubSub from 'pubsub-js'
import moment from 'moment'

const appInstance = getApp()

const max = 250

Page({
    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,
        song: {},
        musicLink: '',
        currentTime: '00:00',
        durationTime: '',
        percentage: 0,
        slotLeft: 0,
        startPoint: {},
        currentSeconds: 0
    },

    handleMusicPlay() {
        const isPlay = !this.data.isPlay
        this.musicControl(isPlay, this.data.song.id, this.data.musicLink)
    },

    musicControl(isPlay, musicId, musicLink) {
        if (isPlay) {
            if (musicLink) {
                this.backgroundAudioManager.src = musicLink
                this.backgroundAudioManager.title = this.data.song.name
            } else {
                getSongUrl({ id: musicId }).then(result => {
                    musicLink = result.data[0].url
                    this.setData({
                        musicLink
                    })
                    this.backgroundAudioManager.src = musicLink
                    this.backgroundAudioManager.title = this.data.song.name
                })
            }
        } else {
            this.backgroundAudioManager.pause()
        }
    },

    navigateBack() {
        wx.navigateBack()
    },

    handleSwitch(event) {
        const type = event.currentTarget.id
        this.backgroundAudioManager.stop()
        PubSub.subscribe('musicId', (_, musicId) => {
            this.getMusicInfo(musicId)
            this.musicControl(true, musicId)
            PubSub.unsubscribe('musicId')
        })
        PubSub.publish('switchType', type)
    },

    getMusicInfo(ids) {
        getSongDetail({ ids }).then(result => {
            result.songs.map(item => {
                for (const iterator of item.ar) {
                    item.singer += '/' + iterator.name
                }
                item.singer = item.singer.substr(10)
            })
            let durationTime = moment(result.songs[0].dt).format('mm:ss')
            this.setData({
                song: result.songs[0],
                durationTime
            })
        })
    },

    slotMove(e) {
        let endPoint = e.touches[e.touches.length - 1]
        let translateX = endPoint.clientX - this.data.startPoint.clientX
        let slotLeft = this.data.slotLeft + translateX
        if (slotLeft > max) {
            slotLeft = max
        }
        if (slotLeft < 0) {
            slotLeft = 0
        }
        const currentSeconds = ((this.data.percentage / 100) * this.data.song.dt) / 1000
        const currentTime = moment(currentSeconds * 1000).format('mm:ss')
        this.setData({
            startPoint: endPoint,
            slotLeft,
            percentage: parseInt((slotLeft / max) * 100),
            currentTime,
            currentSeconds
        })
    },

    slotStart(e) {
        this.backgroundAudioManager.pause()
        this.setData({
            startPoint: e.touches[0]
        })
    },

    slotEnd() {
        this.backgroundAudioManager.seek(this.data.currentSeconds)
        const { song, musicLink } = this.data
        if (!musicLink) {
            this.musicControl(true, song.id, musicLink)
            this.backgroundAudioManager.startTime = this.data.currentSeconds
        } else {
            this.backgroundAudioManager.play()
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const { musicId } = options
        this.getMusicInfo(musicId)

        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === +musicId) {
            this.setData({
                isPlay: true
            })
        }

        this.backgroundAudioManager = wx.getBackgroundAudioManager()
        this.backgroundAudioManager.onPlay(() => {
            this.changePlayState(true)
            appInstance.globalData.musicId = this.data.song.id
        })
        this.backgroundAudioManager.onPause(() => {
            this.changePlayState(false)
        })
        this.backgroundAudioManager.onStop(() => {
            this.changePlayState(false)
        })
        this.backgroundAudioManager.onTimeUpdate(() => {
            if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === this.data.song.id) {
                let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
                let percentage = (this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration) * 100
                this.setData({
                    currentTime,
                    percentage,
                    slotLeft: (percentage / 100) * max
                })
            }
        })
        this.backgroundAudioManager.onEnded(() => {
            PubSub.subscribe('musicId', (_, musicId) => {
                this.getMusicInfo(musicId)
                this.musicControl(true, musicId)
                PubSub.unsubscribe('musicId')
            })
            PubSub.publish('switchType', 'next')
            this.setData({
                percentage: 0,
                currentTime: '00:00'
            })
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
