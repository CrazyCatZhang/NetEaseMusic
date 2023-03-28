import { result } from 'lodash'
import { verifyCode, loginWithPhone } from '../services/user'

function userLoginWithPhone({ phone, captcha }) {
    verifyCode({ phone, captcha })
        .then(value => {
            if (value.code === 200) {
                return loginWithPhone({ phone, captcha })
            } else {
                wx.showToast({
                    title: '验证码错误',
                    icon: 'none'
                })
            }
        })
        .then(value => {})
        .catch(error => {
            console.log(error)
        })
}

export { userLoginWithPhone }
