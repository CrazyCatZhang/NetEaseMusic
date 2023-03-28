// components/VerifyCode/VerifyCode.js
Component({
    options: {
        multipleSlots: true
    },
    /**
     * Component properties
     */
    properties: {
        title: {
            type: String,
            value: '请输入验证码'
        },
        content: {
            type: String,
            value: '已发送到手机号:'
        }
    },

    /**
     * Component initial data
     */
    data: {
        phone: '',
        codes: ['', '', '', ''],
        isShow: false,
        isFocus: false,
        inputValue: '',
        src: '../image/close.png'
    },

    /**
     * Component methods
     */
    methods: {
        //展示
        showView({ phone, inputSuccess }) {
            this.inputSuccess = inputSuccess
            var mPhone = phone.substr(0, 3) + '****' + phone.substr(7)
            this.setData({
                isShow: !this.data.isShow,
                phone: mPhone,
                isFocus: true,
                codes: ['', '', '', '']
            })
        },
        clearInputValue() {
            this.setData({
                inputValue: '',
                codes: ['', '', '', '']
            })
        },
        /**
         * 关闭组件
         */
        closeView() {
            this.setData({
                isShow: !this.data.isShow,
                isFocus: false
            })
        },
        /**
         * 点击输入框
         */
        openKeyboard: function () {
            this.setData({
                isFocus: true
            })
        },
        /**
         * 监听键盘输入
         */
        listenKeyInput: function (e) {
            var text = e.detail.value
            var textLength = text.length
            var codeArray = new Array()
            for (var i = 0; i < (textLength > 4 ? 4 : textLength); i++) {
                var code = text.substr(i, 1)
                codeArray[i] = code
            }
            for (var i = codeArray.length; i < 4; i++) {
                codeArray.push('')
            }
            this.setData({
                codes: codeArray
            })
            if (textLength > 3) {
                var returnString = text.substr(0, 4)
                this.inputSuccess(returnString)
                this.setData({
                    inputValue: ''
                })
            }
        }
    }
})
