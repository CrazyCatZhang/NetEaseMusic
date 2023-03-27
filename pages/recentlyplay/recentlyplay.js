import {
    getRecentlySong,
    getRecentlyVideo,
    getRecentlyPlaylist,
    getRecentlyAlbum,
    getRecentlyVoice,
    getRecentlyPodcast
} from '../../services/user'

import { shiftTimeStamp } from '../../utils/base'

Page({
    /**
     * Page initial data
     */
    data: {
        songs: [],
        voice: [],
        video: [],
        playlist: [],
        album: [],
        podcast: []
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        getRecentlySong().then(result => {
            result.data.list.map(item => {
                for (const iterator of item.data.ar) {
                    item.singer += '/' + iterator.name
                }
                item.singer = item.singer.substr(10).concat(' - ', item.data.al.name)
            })
            this.setData({
                songs: result.data.list
            })
        })
        getRecentlyVoice().then(result => {
            this.setData({
                voice: result.data.list
            })
        })
        getRecentlyVideo().then(result => {
            result.data.list.map(item => {
                item.time = shiftTimeStamp(item.data.duration).split('.')[0]
            })
            this.setData({
                video: result.data.list
            })
        })
        getRecentlyPlaylist().then(result => {
            this.setData({
                playlist: result.data.list
            })
        })
        getRecentlyAlbum().then(result => {
            this.setData({
                album: result.data.list
            })
        })
        getRecentlyPodcast().then(result => {
            this.setData({
                podcast: result.data.list
            })
        })
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady() {},

    /**
     * Lifecycle function--Called when page show
     */
    onShow() {},

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
