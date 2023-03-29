// pages/search/search.js
import '../../utils/lodash-fix'
import _ from '../../utils/lodash'
import { getHotPopularList, getHotTopicList, getHotSearchList } from '../../services/rank'
import { getDefaultSearch, searchKeywords } from '../../services/search'
import Dialog from '@vant/weapp/dialog/dialog'
import PubSub from 'pubsub-js'

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
        historyList: [],
        index: 0
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

    toSongDetail(e) {
        const { song, index } = e.currentTarget.dataset
        this.setData({
            index
        })
        wx.navigateTo({
            url: '/pages/songdetail/songdetail?musicId=' + song.id
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

        PubSub.subscribe('switchType', (_, type) => {
            let { searchList, index } = this.data
            if (type === 'prev') {
                index === 0 && (index = searchList.length)
                index -= 1
            } else {
                index === searchList.length - 1 && (index = -1)
                index += 1
            }

            this.setData({
                index
            })
            const musicId = searchList[index].id
            PubSub.publish('musicId', musicId)
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
