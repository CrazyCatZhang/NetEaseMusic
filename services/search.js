import request from '../utils/request'

async function getDefaultSearch() {
    return await request('/search/default')
}

export { getDefaultSearch }
