$(function () {
    // 引入 layui 中 form 模块
    const form = layui.form;
    // 定义表单的匹配原则
    form.verify({
        // 密码位数限制
        password: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 旧密码与新密码对比
        oldCmp: function (value) {
            if (value == $('[name = "oldPwd"]').val()) {
                return "新密码与旧密码相同！"
            }
        },
        // 两次输入新密码对比
        newPwdCmp: function (value) {
            if (value != $('[name = "rePwd"]').val()) {
                return "两次输入密码不相同"
            }
        }
    })
    $('.layui-form').on('submit', function (e) {

        // 阻止表单默认提交行为
        e.preventDefault()
        // 发起修改密码请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('密码修改失败！')
                }
                $('[type="reset"]').click();
                return layer.msg('密码修改成功！')
            }
        })
    })
})