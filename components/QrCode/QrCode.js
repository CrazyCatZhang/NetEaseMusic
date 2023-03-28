// components/QrCode/QrCode.js
import { generateQRCodeKey, generateQRCode, checkSacnQRCode, getLoginStatus } from '../../services/user'
Component({
    /**
     * Component properties
     */
    properties: {},

    /**
     * Component initial data
     */
    data: {
        isShow: false,
        key: '',
        imgUrl: ''
    },

    /**
     * Component methods
     */
    methods: {
        showView() {
            this.generateQrCode()
            this.setData({
                isShow: true
            })
        },
        generateQrCode() {
            let timer
            generateQRCodeKey()
                .then(result => {
                    this.setData({
                        key: result.data.unikey
                    })
                    return generateQRCode({ key: result.data.unikey })
                })
                .then(result => {
                    this.setData({
                        imgUrl: result.data.qrimg
                    })
                })
                .catch(error => {
                    console.log(error)
                })
            timer = setInterval(() => {
                checkSacnQRCode({ key: this.data.key })
                    .then(result => {
                        if (result.code === 800) {
                            wx.showToast({
                                title: '二维码已过期,请重新获取',
                                icon: 'none'
                            })
                            clearInterval(timer)
                        }
                        if (result.code === 803) {
                            wx.setStorageSync('cookie', result.cookie)
                            clearInterval(timer)
                            return getLoginStatus({ cookie: result.cookie })
                        }
                    })
                    .then(result => {
                        if (result) {
                            this.setData({
                                isShow: false
                            })
                            wx.setStorageSync('userInfo', JSON.stringify(result.data.profile))
                            wx.reLaunch({
                                url: '/pages/my/my'
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }, 3000)
        }
    },
    options: {
        styleIsolation: 'shared',
        multipleSlots: true
    }
})
