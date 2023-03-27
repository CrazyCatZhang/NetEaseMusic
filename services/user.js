import request from '../utils/request'

//Login
async function loginWithPhone({ phone, captcha }) {
    return await request('/login/cellphone', { phone, captcha, timestamp: new Date().getTime() }, 'POST')
}

async function sendCode({ phone }) {
    return await request('/captcha/sent', { phone })
}

async function verifyCode({ phone, captcha }) {
    return await request('/captcha/verify', { phone, captcha, timestamp: new Date().getTime() }, 'POST')
}

async function generateQRCodeKey() {
    return await request('/login/qr/key', { timestamp: new Date().getTime() })
}

async function generateQRCode({ key }) {
    return await request('/login/qr/create', { key, qrimg: true, timestamp: new Date().getTime() })
}

async function checkSacnQRCode({ key }) {
    return await request('/login/qr/check', { key, timestamp: new Date().getTime() })
}

async function guestLogin() {
    return await request('/register/anonimous')
}

async function refreshLogin() {
    return await request('/login/refresh', { timestamp: new Date().getTime() }, 'POST')
}

//Register
async function register({ phone, captcha, password, nickname }) {
    return await request(
        '/register/cellphone',
        { phone, captcha, password, nickname, timestamp: new Date().getTime() },
        'POST'
    )
}

async function isNewUser({ phone }) {
    return await request('/cellphone/existence/check', { phone })
}

async function getLoginStatus({ cookie }) {
    return await request('/login/status', { cookie, timestamp: new Date().getTime() }, 'POST')
}

async function getUserDetails({ uid }) {
    return await request('/user/detail', { uid })
}

async function getLikeList({ uid }) {
    return await request('/likelist', { uid })
}

async function getPlayList({ uid }) {
    return await request('/user/playlist', { uid })
}

async function getRecentlySong() {
    return await request('/record/recent/song', { limit: 300 })
}

async function getRecentlyVideo() {
    return await request('/record/recent/video')
}

async function getRecentlyVoice() {
    return await request('/record/recent/voice')
}

async function getRecentlyPlaylist() {
    return await request('/record/recent/playlist')
}

async function getRecentlyAlbum() {
    return await request('/record/recent/album')
}

async function getRecentlyPodcast() {
    return await request('/record/recent/dj')
}

async function getRecommendSong() {
    return await request('/recommend/songs')
}

export {
    loginWithPhone,
    sendCode,
    verifyCode,
    generateQRCodeKey,
    generateQRCode,
    checkSacnQRCode,
    guestLogin,
    refreshLogin,
    register,
    isNewUser,
    getLoginStatus,
    getUserDetails,
    getLikeList,
    getPlayList,
    getRecentlySong,
    getRecentlyVideo,
    getRecentlyVoice,
    getRecentlyPlaylist,
    getRecentlyAlbum,
    getRecentlyPodcast,
    getRecommendSong
}
