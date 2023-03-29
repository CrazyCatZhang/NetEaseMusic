import request from '../utils/request'

async function getDefaultSearch() {
    return await request('/search/default')
}

async function searchKeywords({ keywords }) {
    return await request('/cloudsearch', { keywords, limit: 10 })
}

export { getDefaultSearch, searchKeywords }
