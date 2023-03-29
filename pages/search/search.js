// pages/search/search.js
import '../../utils/lodash-fix'
import _ from '../../utils/lodash'
import { getHotPopularList, getHotTopicList, getHotSearchList } from '../../services/rank'
import { getDefaultSearch, searchKeywords } from '../../services/search'

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
        searchList: []
    },

    handleInput: _.debounce(function (e) {
        this.setData({
            searchContent: e.detail.value.trim()
        })
        if (this.data.searchContent) {
            searchKeywords({ keywords: this.data.searchContent }).then(result => {
                this.setData({
                    searchList: result.result.songs
                })
            })
        } else {
            this.setData({
                searchList: []
            })
        }
    }, 500),

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
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