//index.js
Page({
  data: {
    films: {},
    loading: false,
    title: '正在热映',
    video: 'video-hide',
    datails: '',
    windowWidth: 0,
    area:''
  },
  onLoad: function (options) {
    var id = 'http://m.maoyan.com/movie/' + options.id + '.json'
    this.setData({
      title: options.titles//能不访问服务器就不访问
    })
    var that = this
    wx.request({
      url: id, //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
        that.setData({
          films: res.data.data,
          loading: true
        })
        var pages = that.data.films.MovieDetailModel.dra
        pages = pages.replace(/<.*?>/ig,"")//将符号转化为空字符串
        that.setData({
          details: pages
        })
        console.log(pages)
      }
    })
  },
  onReady: function(){
    var that = this//设置导航栏标题
    wx.setNavigationBarTitle({
      title: that.data.title
    })
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  pay: function(){
    wx.switchTab({
      url: '../cinema/cinema',
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
    // console.log('pay');
    /*wx.requestPayment({
       'timeStamp': '',
       'nonceStr': '',
       'package': '',
       'signType': 'MD5',
       'paySign': '',
       'success':function(res){
          console.log('success');
       },
       'fail':function(res){
          console.log('fail');
       }
    })*/
  },
  vShow: function(){
    this.setData({
      video: 'video-show'
    })
  },
  //视频播放结束隐藏
  vHid: function(){
    this.setData({
      video: 'video-hide'
    })
  }
})
