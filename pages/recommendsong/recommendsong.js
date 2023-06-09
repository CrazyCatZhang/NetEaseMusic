// pages/recommendsong/recommendsong.js
import { getRecommendSong } from '../../services/user'
import PubSub from 'pubsub-js'

Page({
    /**
     * 页面的初始数据
     */
    data: {
        day: '',
        month: '',
        recommendSontList: [],
        index: 0
    },

    toSongDetail(event) {
        const { song, index } = event.currentTarget.dataset
        this.setData({
            index
        })
        wx.navigateTo({
            url: '/pages/songdetail/songdetail?musicId=' + song.id
        })
    },

    navigateBack() {
        wx.navigateBack()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            day: new Date().getDate(),
            month: new Date().getMonth() + 1
        })
        getRecommendSong().then(result => {
            result.data.dailySongs.map(item => {
                for (const iterator of item.ar) {
                    item.singer += '/' + iterator.name
                }
                item.singer = item.singer.substr(10).concat(' - ', item.al.name)
            })
            this.setData({
                recommendSontList: result.data.dailySongs
            })
        })

        PubSub.subscribe('switchType', (_, type) => {
            let { recommendSontList, index } = this.data
            if (type === 'prev') {
                index === 0 && (index = recommendSontList.length)
                index -= 1
            } else {
                index === recommendSontList.length - 1 && (index = -1)
                index += 1
            }

            this.setData({
                index
            })
            const musicId = recommendSontList[index].id
            PubSub.publish('musicId', musicId)
        })
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
