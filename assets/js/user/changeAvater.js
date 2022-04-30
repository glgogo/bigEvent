$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    // var $image = new Cropper($('#image'), {
    //     aspectRatio: 1,
    //     preview: '.img-preview'
    // })

    // 给上传按钮绑定事件，模拟点击 隐藏 input 文件框
    $('.btnUpload').on('click', function () {

        $('.avaterFile').click();
    })

    // 当文件选择框中的文件发生变化时，触发更换裁剪的图片事件
    $('.avaterFile').on('change', function (e) {
        // 获取文件框中文件列表
        var filelist = e.target.files;
        console.log(filelist[0])
        // 判断用户是否选择了待上传的文件
        if (filelist.length === 0) {
            return layer.msg('请选择头像照片')
        }
        // alert(11)
        // 获取用户上传的头像文件
        var file = e.target.files[0];


        // 根据选择的文件，创建一个对应的url地址
        var newImgURL = URL.createObjectURL(file);


        // 先销毁待裁剪区的旧文件，再重新设定新图片的图片路径，并创建至裁剪区
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 当点击了 确认修改头像的按钮后 ，发起 ajax 请求修改头像
    $('.btnSure').on('click', function () {

        // 将裁剪后的图片，输出为 base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', {// 创建一个 Canvas 画布
                width: 100,
                height: 100,
                minWith: 50,
                minHeight: 50,
                maxWith: 100,
                maxHeight: 100
            })
            .toDataURL('image/png')// 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        console.log(dataURL)
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                window.parent.getUserInfo();
                return layer.msg('头像更换成功！')
            }
        })
    })
})