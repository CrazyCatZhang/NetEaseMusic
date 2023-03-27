// pages/login/login.js
import request from '../../utils/request'
import { sendCode, verifyCode, loginWithPhone } from '../../services/user'


Page({

  /**
   * Page initial data
   */
  data: {
    phoneNumber: '18223955386',
    serectNumber: '182****5386',
    code: '',
    access_token: '',
  },

  loginWithQrCode() {
    const _this = this
    _this.qrcode.showView()
  },

  getPhoneNumber(e) {
    this.setData({
      code: e.detail.code
    })
    wx.request({
      url: "https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=" + this.data.access_token,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        code: this.data.code
      },
      success: (res) => {
        console.log(res);
        this.setData({
          phoneNumber: res.data.phone_info.phoneNumber,
          appid: res.data.phone_info.watermark.appid
        })
      }
    })
  },

  login() {
    const { phoneNumber } = this.data
    // sendCode({ phone: phoneNumber })
    this.openVerifyCodeView()
  },

  async verifyCode(phoneCode) {
    const { phoneNumber } = this.data

    const result = await request('/captcha/verify', { phone: phoneNumber, captcha: phoneCode }, "POST")

    return result
  },

  openVerifyCodeView() {
    const _this = this
    const { phoneNumber } = _this.data
    _this.verifycode.showView({
      phone: _this.data.phoneNumber,
      inputSuccess: function (phoneCode) {
        verifyCode({
          phone: phoneNumber,
          captcha: phoneCode
        }).then(result => {
          if (result.code === 200) {
            _this.verifycode.closeView()
            return loginWithPhone({ phone: phoneNumber, captcha: phoneCode })
          } else {
            _this.verifycode.clearInputValue()
            wx.showToast({
              title: result.message,
              icon: 'error'
            })
          }
        }).then(result => {
          const { code } = result
          if (code === 200) {

          } else if (code === -462) {
            wx.showToast({
              title: '网盾验证，请使用二维码登录',
              icon: 'none'
            })
          }
        }).catch(error => {

        })
      }
    })
  },

  handleItemChane(e) {
    const { phone } = e.detail;
    this.setData({
      phoneNumber: phone,
      serectNumber: phone.substr(0, 3) + '****' + phone.substr(7)
    })
  },

  changePhone() {
    const _this = this
    _this.changephone.showView()
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      data: {
        grant_type: "client_credential",
        appid: "wx53226e485dc76a22",
        secret: "8aef80ed79d92404c3087da0dab3ea91"
      },
      success: (res) => {
        this.setData({
          access_token: res.data.access_token
        })
      }
    })

    this.verifycode = this.selectComponent("#verifycode")
    this.changephone = this.selectComponent("#changephone")
    this.qrcode = this.selectComponent("#qrcode")
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})