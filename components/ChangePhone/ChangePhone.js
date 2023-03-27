import '../../utils/lodash-fix'
import _ from '../../utils/lodash'
import { isNewUser, sendCode, register, verifyCode } from '../../services/user'

Component({
  options: {
    multipleSlots: true,
    styleIsolation: 'shared'
  },
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    send: true,
    alreadySend: false,
    isShow: false,
    disabled: true,
    newUser: false,
    phone: '',
    captcha: '',
    password: '',
    repassword: '',
    nickname: '',
    seconds: 60
  },

  /**
   * Component methods
   */
  methods: {
    showView() {
      this.setData({
        isShow: true
      })
    },
    closeView() {
      this.setData({
        isShow: false
      })
    },
    validatePhone(phone) {
      const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      return phoneReg.test(phone)
    },
    handleInput: _.debounce(function (e) {
      const type = e.currentTarget.id
      const value = e.detail.value
      if (value && type === 'phone') {
        this.setData({
          disabled: false
        })
      } else {
        this.setData({
          disabled: true
        })
      }
      this.setData({
        [type]: value
      })
    }, 500),
    handleItemChange() {
      const { phone, captcha, password, repassword, nickname, newUser } = this.data
      if (newUser) {
        if (captcha && password && repassword && nickname) {
          verifyCode({ phone, captcha }).then(result => {
            if (result.code === 200) {
              if (password === repassword) return register({ phone, captcha, password, nickname })
              else {
                wx.showToast({
                  title: '密码不一致',
                  icon: 'none'
                })
              }
            } else {
              wx.showToast({
                title: '验证码输入错误',
                icon: 'none'
              })
            }
          }).then(result => {
            console.log(result);
          }).catch(error => {
            console.log(error);
          })
        }
        return
      }
      isNewUser({ phone }).then(result => {
        if (result.exist === -1) {
          wx.showToast({
            title: '手机号尚未注册',
            icon: 'none'
          })
          this.setData({
            newUser: true,
            disabled: true
          })
        } else {
          this.triggerEvent("changePhone", { phone })
          this.setData({
            isShow: false
          })
        }
      }, error => {
        console.log(error);
      })
    },
    timer() {
      let promise = new Promise((resolve, reject) => {
        let setTimer = setInterval(
          () => {
            this.setData({
              seconds: this.data.seconds - 1,
            })
            if (this.data.seconds <= 0) {
              this.setData({
                seconds: 60,
                alreadySend: false,
                send: true,
              })
              resolve(setTimer)
            }
          }, 1000)
      })
      promise.then((setTimer) => {
        clearInterval(setTimer)
      })
    },
    async getCode() {
      const { phone } = this.data

      this.setData({
        alreadySend: true,
        send: false
      })
      this.timer()

      return sendCode({ phone })
    }
  }
})
