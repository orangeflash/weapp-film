//cmdetail.js
Page({
  data: {
    films: {},
    loading: true,
    title: '正在热映',
    windowWidth: 0,
    tel: '',
    movies: [],
    addr: '',
    movieIndex: 0,
    dateIndex: 0,
    scrollLeft: 0,
    colors:['#B0E2FF','#FFFF00','#EEAEEE','','#FF8C69','#C0FF3E'],
    index:0
  },
  onLoad: function (options) {
    var that=this
    wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    left: res.windowWidth / 2 - 48
                })
            }
        })
    var id = 'http://platform.mobile.meituan.com/open/maoyan/v1/cinema/' + options.cinemaid + '/movies/shows.json';
    this.setData({
      title: options.titles,//能不访问服务器就不访问
      tel: options.tel,
      addr: options.addr
    })
    var that = this
    wx.request({
      url: id, //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          films: res.data.data,
          loading: true
        })
        let movies = []//定义块级变量
        //使用map方法对每一部电影的图片进行相应的处理并返回一个新的数组
        movies = res.data.data.movies.map(movie => {
          const arr = movie.img.split('/')//斜杠分割截取图片路径
          const str = arr[arr.length - 1]
          movie.img = 'http://p0.meituan.net/165.220/movie/' + str
          return movie
        })
        that.setData({
          movies,//与data中movies名称相同省略写法
          loading: false
        })
      },
      fail: function () {
        wx.showToast({
          title: '网络开小差了',
          icon: 'loading'
        })
      }
    })
  },
  onReady: function () {
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
  //获取选中电影的索引并保存
  chooseMovie: function (e) {
    //改变图片廊背景色
    if(this.data.index>=this.data.colors.length){
      this.setData({
        index:0
      })
    }
    const {index} = e.currentTarget.dataset
    this.setData({
      movieIndex: index,
      scrollLeft: 83 * index,
      index:this.data.index+1
    })
  },
  //获取选中日期的索引并保存
  chooseDate: function (e) {
    const {index} = e.currentTarget.dataset
    this.setData({
      dateIndex: index
    })
  },
  //滚动时中间图片放大
  scrollmd:function(e){
    const {scrollLeft} = e.detail
        const movieIndex = Math.round(scrollLeft / 83)
        this.setData({
            movieIndex,
            scrollLeft: 83 * movieIndex
        })
  }
})
