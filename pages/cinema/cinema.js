//cinema.js
/*Page({
  data: {
    films: [],
    citys: [],
    city: '武汉',
    index: 0,
    loading: false,
    windowHeight: 0,
    windowWidth: 0
  },
  onLoad: function () {
    wx.getUserInfo({
      success: function(res){
        console.log(res)
      }
    })
    wx.showToast({ title: '加载中', icon: 'loading' })
    this.setData({
      loading: true
    })
    this.getCinemas()
    this.getCitys()
  },
  getCinemas: function () {
    var that = this
    wx.request({
      url: 'http://platform.mobile.meituan.com/open/maoyan/v1/cinemas.json?ct=' + that.data.city,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          films: res.data.data,
          loading: true
        })
      }
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
  getCitys: function () {
    const that = this
    wx.request({
      url: 'http://platform.mobile.meituan.com/open/maoyan/v1/cities.json',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        const citys =[]
        for (let i = 0; i < res.data.data.length; i++) {
          citys.push(res.data.data[i].nm)
        }
        that.setData({
          citys
        })
      },
      fail: function () {
        wx.showToast({
          title: '网络开小差了',
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      city: this.data.citys[e.detail.value],
      loading: true
    });
    this.getCinemas();
  }
})*/
// pages/cinema/cinema.js
Page({
  data: {
    cinemadata: [],
    citys: [],
    city: '武汉',
    cityindex: 0,
    value: '北京',
    loading: true
  },
  onLoad: function (options) {
    //调用getCinemas函数请求影院数据
    this.getCinemas()
    //调用getCitys函数获取城市列表
    this.getCitys()
  },
  //获取城市列表
  getCitys: function () {
    const that = this
    wx.request({
      url: 'http://platform.mobile.meituan.com/open/maoyan/v1/cities.json',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 由于获取到的数据不是很友好，所以对其进行遍历将其中城市名都存在一个新的数组中
        const citys = []
        for (let i = 0; i < res.data.data.length; i++) {
          citys.push(res.data.data[i].nm)
        }
        // 保存城市名数组
        that.setData({
          citys,
        })
      },
      fail: function () {
        wx.showToast({
          title: '网络开小差了',
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  //请求城市影院数据
  getCinemas: function () {
    const that = this
    wx.request({
      url:'http://platform.mobile.meituan.com/open/maoyan/v1/cinemas.json?ct=' + that.data.city,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //调用sortCinema函数对得到的数据进行整理并返回
        const cinemadata = that.sortCinema(res.data.data)
        that.setData({
          cinemadata,
          loading: false
        })
      },
      fail: function () {
        wx.showToast({
          title: '网络开小差了',
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  //对影院数据进行整理
  sortCinema: function (data) {
    let sdata = []
    for (let i = 0; i < data.length; i++) {
      if (i == 0) {
        // 在sdata空数组中添加一个对象元素，id为for循环key准备，
        //open控制下拉列表的开闭，area保存地区名，cinemas保存特定地区名中的电影院信息
        sdata.push({ "id": i, "open": true, "area": data[i].area, "cinemas": [] })
        sdata[i].cinemas.push(data[i])
      }
       else {
        let flag = true
        for (let j = 0; j < sdata.length; j++) {
          //如果sdata中存在此时data遍历到的影院信息所处地区，那么将该影院信息添加到sdata相应的项中
          //并将flag变为false，结束遍历
          if (data[i].area == sdata[j].area) {
            sdata[j].cinemas.push(data[i])//将data[]中相同的area添加到此时的sdata中
            flag = false
            break
          }
        }
        //如果flag为true，则说明data遍历到了一个新的地区
        if (flag) {
          //在sdata中新增一个对象元素，该对象元素包含此时遍历到的地区影院信息
          sdata.push({ "id": i, "open": false, "area": data[i].area, "cinemas": [] })
          sdata[sdata.length - 1].cinemas.push(data[i])
        }
      }
    }
    return sdata
  },
  //使用picker组件选择城市并请求相应数据
  chooseCity: function (e) {
    this.setData({
      cityindex: e.detail.value,
      city: this.data.citys[e.detail.value],
      loading:true
    })
    this.getCinemas()//再次调用方法重新获取数据
  },
  //使用表单搜索相应城市并请求相应数据
  searchCity: function (e) {
    //find方法在手机上有问题
    // const city = this.data.citys.find(function(city) {
    //   return city === e.detail.value.city
    // })
    let flag = false
    const that = this
    //查询输入城市是否在城市列表中
    for (let i = 0; i < that.data.citys.length; i++) {
      if (that.data.citys[i] == e.detail.value.city) {
        flag = true
        break
      }
    }
    if (flag) {
      this.setData({
        city: e.detail.value.city,
        value: '',
        loading:true
      })
      this.getCinemas()//再次调用方法重新获取数据
    } else {
      wx.showToast({
        title: '未找到该城市',
        icon: 'loading',
        duration: 2000
      })
    }
  },
  //控制下拉列表开闭
  cinemasToggle: function (e) {
    const {area} = e.currentTarget.dataset
    let {cinemadata} = this.data
    //使用map方法找到对应地区的open属性，改变其值
    cinemadata = cinemadata.map(x => {//x是每一项
      if (x.area === area) {
        x.open = !x.open
      }
      return x
    })
    this.setData({
      cinemadata,
    })
  }
})