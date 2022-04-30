$(function () {
    // 引入layui中form模块
    const form = layui.form;

    // 引入layui中layer模块
    const layer = layui.layer;

    // 定义用户名验证
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '用户昵称为1-6位！';
            }
        }
    })
    // 调用获取用户信息函数
    getUserInfo(form);

    // 将更改用户信息的表单信息进行重置
    $('.layui-btn-primary').on('click', function (e) {
        // 阻止按钮默认行为
        e.preventDefault();
        // 点击重置按钮后将用户信息重新渲染
        getUserInfo(form);
    })

    // 调用修改用户信息函数
    $('.layui-form').on('submit', function (e) {
        // 使用jQuery中serialize() 方法快速获取表单中的所有数据
        var data = $(this).serialize();
        // 阻止按钮默认行为
        e.preventDefault();
        // 调用修改用户信息函数
        setUserInfo(data);
    })

})

// 获取用户信息函数
function getUserInfo(form) {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            // console.log(res)
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            }

            form.val('formUserInfo', res.data)
        }
    })
}

// 修改用户信息函数
function setUserInfo(data) {
    $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        data: data,
        success: function (res) {
            console.log(res)
            if (res.status !== 0) {
                return layer.msg('修改用户信息失败！')
            }
            // 重新调用头像渲染函数
            window.parent.getUserInfo();

            return layer.msg('修改用户信息成功！')


        }
    })
}