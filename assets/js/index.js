$(function () {
    // 页面加载前调用获取用户信息函数
    getUserInfo();

    // 退出登录
    $('#btn_logout').on('click', function () {
        // 1.跳转至登录页面
        location.href = '../../login.html';
        // 2.清空localStorage 中 token 属性
        localStorage.removeItem('token');
    })
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头 配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status != 0) {
                return layui.layer.msg('获取用户信息失败！')
            }

            // console.log(res)
            /*获取到的res对象
                data:
                email: ""
                id: 4456
                nickname: ""
                user_pic: null
                username: "g1"
            */
            // 发起获取用户信息ajax请求时，调用渲染头像函数
            renderAvatar(res.data);

        },

        // 不管请求成功与否 ，最终都会调用 complete 回调函数
        // *** 为避免每次请求时都需要写一次这些代码，所以统一将 此处
        // 代码封装到 baseAPI 中
        // complete: function (res) {
        //     console.log(res)
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空 token
        //         localStorage.removeItem('token');

        //         // 2.强制跳转至 登录 页面
        //         location.href = '../../login.html';

        //     }
        // }

    })
}

// 渲染用户头像函数
function renderAvatar(user) {
    // 1.如果有图片地址，将图片地址渲染为头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic);
        $('.head_pic').hide()
    } else {
        // 2.如果没有图片地址，将用户名第一个字母作为头像展示
        $('.layui-nav-img').hide()
        if (user.nickname == "") {
            $('.head_pic').html(user.username.slice(0, 1).toUpperCase());
            $('.head_welcome').html('欢迎 ' + user.username);
        } else {
            $('.head_pic').html(user.nickname.slice(0, 1).toUpperCase())
            $('.head_welcome').html('欢迎 ' + user.nickname);
        }

    }


}