var api="http://platform.mobile.meituan.com/open/maoyan";
//下文=号后需获取实时数据
module.exports={
    apiList:{
        //获取城市列表
        city:api+"/v1/cities.json",
        //获取所选城市的电影院列表和该影院id
        cinemas:api+"/v1/cinemas.json",
        //根据影院id获取该影院的电影信息
        movies:api+"/v1/cinema/",
        //选择对应的放映时间后可得到对应的showId和showDate用来获取该场次的座次表
        chose:"http://m.maoyan.com/show/seats?showId="+"&showDate="
    }
}