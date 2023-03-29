// index.js
import request from '../../utils/request'

Page({
    /**
     * 页面的初始数据
     */
    data: {
        bannerList: [],
        recommendList: [],
        topList: []
    },

    toRecommendSong() {
        wx.navigateTo({
            url: '/pages/recommendsong/recommendsong'
        })
    },

    toSearch() {
        wx.navigateTo({
            url: '/pages/search/search'
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        const bannerListDate = await request('/banner', { type: 2 })
        const recommendListData = await request('/personalized', { limit: 10 })
        const topListData = await request('/toplist/detail')
        const topListItems = topListData.list
            .filter(item => item.name.includes('云音乐'))
            .sort((a, b) => b.subscribedCount - a.subscribedCount)
        let resultArr = []
        for (let i = 0; i < 10; i++) {
            const result = await request('/playlist/detail', { id: topListItems[i].id })
            let toplistDetail = { name: result.playlist.name, tracks: result.playlist.tracks.slice(0, 3) }
            resultArr.push(toplistDetail)
        }
        this.setData({
            bannerList: bannerListDate.banners,
            recommendList: recommendListData.result,
            topList: resultArr
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getTabBar().init()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {}
})
