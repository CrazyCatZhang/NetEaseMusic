import request from '../utils/request'

async function getHotSearchList() {
    const result = await request('/search/hot/detail')
    result.title = '热搜榜'
    return result
}

async function getHotTopicList() {
    const result = await request('/hot/topic')
    result.title = '话题榜'
    return result
}

async function getHotPopularList() {
    const result = await request('/dj/toplist/popular', { limit: 20 })
    result.title = '主播榜'
    return result
}

export { getHotSearchList, getHotTopicList, getHotPopularList }
