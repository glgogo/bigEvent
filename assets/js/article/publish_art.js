$(function () {
    var form = layui.form;

    // 调用获取文章分类列表函数
    getArtCate()

    // 初始化富文本编辑器
    initEditor()

    // 获取分类列表函数
    function getArtCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败！');
                }
                // 调用template函数
                let artClass = template('art_class', res)

                $('[name="cate_id"]').html(artClass);
                // 重新渲染筛选分类列表
                form.render();
                // return layer.msg('获取分类列表成功！');

            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 给选择封面绑定点击事件
    $('.layui-btn-danger').on('click', function () {
        $('#art_cover').click();
    })

    // 给文件选择框绑定 change事件
    $('#art_cover').on('change', function (e) {
        // 获取选择文件
        var file = e.target.files[0];

        // 判断用户是否选择了文件
        if (file.length === 0) {
            return layer.msg('请选择封面！')
        }
        //根据选择的文件，创建一个对应的url地址
        var newImgURL = URL.createObjectURL(file);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义发布文章时的发布装填，默认为 ‘发布’
    var art_state = '已发布';

    // 如果用户点了 存为草稿 按钮，将发布文章的装填更改为 ‘草稿’
    $('.artSave2').on('click', function () {
        art_state = '草稿';
    })

    // 监听表单的submit 事件，并将表单内容转化为 formData 对象
    $('.form_pub').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();

        // 基于 form 表单，快速创建一个formData 对象
        var fd = new FormData($(this)[0]);

        // 将文件的发布状态追加到 FormData 对象中
        fd.append('state', art_state);

        // 将裁剪后的图片，输出为文件,并将文件追加到 FormData 对象中
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 将文件追加到 FormData 对象中
                fd.append('cover_img', blob);
                // 发起 ajax 请求，发布文章
                publishArticle(fd);
                // fd.forEach(function (k, v) {
                //     console.log(k, v)
                // })
            })


        // 定义发布文章的方法
        function publishArticle(fd) {
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                // 注意：如果向服务器提交的时 FormData数据格式时
                // 需要加上下面两个配置，否则会请求失败
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('文章发布失败！');
                    }
                    layer.msg('文章发布成功！');
                    // 发布成功后应跳转到文章列表页面
                    location.href = '../../article/art_lists.html'
                }

            })
        }
    })
})