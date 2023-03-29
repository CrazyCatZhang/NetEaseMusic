// pages/search/search.js
import '../../utils/lodash-fix'
import _ from '../../utils/lodash'
import { getHotPopularList, getHotTopicList, getHotSearchList } from '../../services/rank'
import { getDefaultSearch, searchKeywords } from '../../services/search'
import Dialog from '@vant/weapp/dialog/dialog'

Page({
    /**
     * Page initial data
     */
    data: {
        hotSearchList: {},
        topicList: {},
        popularList: {},
        defaultKeyword: '',
        searchContent: '',
        searchList: [],
        historyList: []
    },

    clearHistory() {
        Dialog.confirm({
            title: '删除',
            message: '是否删除历史记录'
        })
            .then(() => {
                this.setData({
                    historyList: []
                })
                wx.removeStorageSync('searchHistory')
            })
            .catch(() => {
                // 取消
            })
    },

    handleInput: _.debounce(function (e) {
        this.setData({
            searchContent: e.detail.value.trim()
        })

        let { searchContent, historyList } = this.data

        if (searchContent) {
            searchKeywords({ keywords: searchContent }).then(result => {
                this.setData({
                    searchList: result.result.songs
                })
                if (historyList.includes(searchContent)) {
                    historyList = historyList.filter(item => item !== searchContent)
                }
                historyList.unshift(searchContent)
                this.setData({
                    historyList
                })
                wx.setStorageSync('searchHistory', historyList)
            })
        } else {
            this.setData({
                searchList: []
            })
        }
    }, 500),

    clearSearch() {
        this.setData({
            searchContent: '',
            searchList: []
        })
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        const historyList = wx.getStorageSync('searchHistory')
        if (_.isArray(historyList)) {
            this.setData({
                historyList
            })
        }
        getHotSearchList().then(result => {
            this.setData({
                hotSearchList: result
            })
        })
        getHotTopicList().then(result => {
            this.setData({
                topicList: result
            })
        })
        getHotPopularList().then(result => {
            this.setData({
                popularList: result
            })
        })
        getDefaultSearch().then(result => {
            this.setData({
                defaultKeyword: result.data.showKeyword
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
