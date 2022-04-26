$(function () {
    // 控制登陆及注册页面的切换---开始
    $('#link_toreg').on('click', function () {
        $('.reg_area').show();
        $('.login_area').hide();
    });

    $('#link_tologin').on('click', function () {
        $('.reg_area').hide();
        $('.login_area').show();
    });
    // 控制登陆及注册页面的切换---结束

    // 使用layui获取form对象
    var form = layui.form;
    // 使用form.verify()方法设置校验规则
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 确认两次密码框输入密码是否一致
        repass: function (val) {
            var psw = $('.reg_area [name=password]').val();

            if (psw != val) {
                return '两次输入的密码不一致！'
            }
        }
    })

    // 登录功能开发
    $("#login_btn").on('click', function (e) {
        e.preventDefault();
        const data = {
            username: $("#login_username").val(),
            password: $("#login_password").val()
        }
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: data,
            success: function (res) {
                layer.msg(res.message);
                localStorage.setItem('token', res.token);
                setTimeout(() => {
                    location.href = "./index.html"
                }, 2000);
            }
        })
    })

    // 注册功能开发
    $("#reg_btn").on('click', function (e) {
        e.preventDefault();
        const data = {
            username: $("#reg_username").val(),
            password: $("#reg_password").val()
        }
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: data,
            success: function (res) {
                // alert(res.message)
                layer.msg(res.message);
                $('.reg_area').hide();
                $('.login_area').show();
            }
        })
    })
})

