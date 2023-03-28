import config from './config.js'

export default (url, data = {}, method = 'GET') => {
    return new Promise((resolve, reject) => {
        //初始化promise实例的状态为pending
        wx.request({
            url: config.vercelHost + url, //请求地址
            data: {
                realIP: '192.168.2.124',
                ...data
            }, //请求参数对象
            method: method, //请求方法
            header: {
                cookie: wx.getStorageSync('cookie')
                    ? wx
                          .getStorageSync('cookie')
                          .split('HTTPOnly;')
                          .find(item => item.indexOf('MUSIC_U') !== -1)
                    : ''
            },

            success: res => {
                resolve(res.data)
            },
            fail: err => {
                reject(err)
            }
        })
    })
}
