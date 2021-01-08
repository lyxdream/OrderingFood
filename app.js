//app.js
const httpUtil = require('./utils/httpUtil.js') //接口和key文件
import { enums } from './utils/enums'
App({
    globalData: {
        userInfo: null,
        footerHeight: 0,
        openId: '',
        baseUrl: 'https://xxxxxx/', //授权登录的公共路径
        bindBaseUrl: 'https://xxxxx/', //一键绑定公共路径
        
    },
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        this.getScale() //获取高度
        // this.login();//获取登录信息
        // 获取用户信息
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: (res) => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        },
                    })
                }
            },
        })
    },

    login() {
        let that = this
        return new Promise(function (resolve, reject) {
            // 登录
            wx.login({
                success: (res) => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    var code = res.code
                    // console.log(code)
                    if (res.code) {
                        // console.log('获取用户登录凭证：' + code);  通过code获取登录session
                        httpUtil.requestApi({
                            url: that.globalData.baseUrl + 'wechatLogin',
                            method: 'GET',
                            header: {
                                'Content-Type':
                                    'application/x-www-form-urlencoded',
                            },
                            data: {
                                code: code,
                                mediaName: 'WXFWXC',
                            },
                            success: function (data) {
                                if (data && data.data && data.data.code == 0) {
                                    console.log(data.data.data)
                                }
                                that.globalData.openId = data.data.data.openId
                                resolve(data)
                            },
                        })
                    } else {
                        console.log('获取用户登录失败：' + res.errMsg)
                    }
                },
            })
        })
    },
    //导航栏底部加空白
    getScale() {
        var res = wx.getSystemInfoSync()
        console.log(res)
        var isheightnav = false
        console.log(enums)
        for (var i = 0; i < enums.heightnavmode.length; i++) {
            var item = enums.heightnavmode[i]
            if (new RegExp('^' + item).test(res.model)) {
                isheightnav = true
                break
            }
        }
        this.globalData.footerHeight = isheightnav ? 40 : 0
    },
})
