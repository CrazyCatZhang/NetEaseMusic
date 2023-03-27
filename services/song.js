import request from '../utils/request'

async function getSongDetail({ ids }) {
    return await request('/song/detail', { ids })
}

async function getSongUrl({ id }) {
    return await request('/song/url/v1', { id, level: 'lossless' })
}

export { getSongDetail, getSongUrl }
