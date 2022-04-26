
/* 每次调用 $.get()\$.post()\$ajax()时，都会先调用
$.ajaxPrefilter(callback)函数，在这个函数中，我们可以拿到
提交数据的配置对象内容，并可以对其进行改造*/

// 这里的 options 形参 对应的是 发送请求时 请求对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url)
    let baseURL = 'http://www.liulongbin.top:3007';
    // 拼接 请求 url 地址
    options.url = baseURL + options.url;

    // 将请求头添加到自定义 api 中
    // 1.判断是否需要访问权限
    if (options.url.indexOf('/my') !== -1) {
        // 在请求对象中田间 headers 属性
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 将 complete 函数挂在到 API 中，可以简化每次书写代码的问题
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空 token
            localStorage.removeItem('token');

            // 2.强制跳转至 登录 页面
            location.href = '../../login.html';

        }
    }
})