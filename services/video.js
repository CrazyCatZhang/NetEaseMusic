import request from '../utils/request'

async function getVideoTabList() {
    return await request('/video/group/list')
}

async function getVideoListData({ id }) {
    const result = await request('/video/group', { id, time: new Date().getTime() })
    const newArr = result.datas.map(async item => {
        const value = await request('/video/url', { id: item.data.vid })
        item.urlInfo = value.urls[0]
        item.vid = item.data.vid
        return item
    })
    wx.hideLoading()
    return newArr
}

async function getVideoUrl({ id }) {
    return await request('/video/url', { id })
}

export { getVideoTabList, getVideoListData, getVideoUrl }
