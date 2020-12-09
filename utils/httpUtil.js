
const productUrl = 'xxxx'; //正式

const isDebug = true;
function logRequest(requestData) {
  if (isDebug) {
    console.log('请求地址', requestData.url, '请求参数', requestData.data)
  }
}
function requestApi(requestData) {
  logRequest(requestData)
  wx.showLoading({
    title: '加载中...',
    mask: true,
  })
  // "Content-Type": "application/x-www-form-urlencoded"
  wx.request({
    url: requestData.url,
    data: requestData.data,
    method:  requestData.method || 'GET',
    header: requestData.header || {
      "Content-Type": "application/json"
    },
    success: (res) => {
      console.log(res)
      res.statusCode != 200 ? toastError('服务器维护中') : res.statusCode == 200 ? requestData.success(res) : toastError(res.data.message)
    },
    fail: (res) => {
      requestData.fail(res)
    },
    complete: (res) => {
      res.statusCode != 200 && toastError('服务器维护中')
      wx.hideLoading()
    }
  })
}

function toastError(msg) {
    wx.showToast({
        title: msg,
        icon: 'none',
        image: '/images/icon-error.png',
        duration: 2000,
        mask: true
    })
}
module.exports = {
  requestApi:requestApi,
  toastError: toastError,
}