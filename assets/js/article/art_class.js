$(function () {

    // 引入layui中form模块
    var form = layui.form;
    // 调用获取文章分类列表
    getArtClass()

    // 为 添加分类按钮添加事件 
    $('.addClass').on('click', function () {
        console.log('ok')
        // layer.open 默认有一个返回值 index
        var addIndex = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#add_dialog').html(),
            area: ['500px', '250px']
        });

        // 当新增分类 按钮 被触发点击事件时，发起ajax请求
        $('.form_addCate').on('submit', function (e) {
            // 阻止表单默认提交行为
            e.preventDefault();
            // 调用 ajax请求 新增分类
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('新增文章分类失败！')
                    }
                    // 调用渲染文章分类函数，重新渲染页面结构
                    getArtClass();
                    // 渲染成功后关闭 open 层
                    layer.close(addIndex, function () {
                        return layer.msg('新增文章分类成功！')
                    });

                }
            })


        })
    })

    // 修改文章分类
    $('tbody').on('click', '#updateCate', function () {
        // console.log('ok')
        var editIndex = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#art_updateCate').html(),
            area: ['500px', '250px']
        });

        // 获取点击分类行的 id值
        var id = $(this).attr('data-id');
        // console.log(id)
        // 发起请求，获取点击分类信息
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('update_form', res.data);
            }
        })

        // 点击 确认修改 按钮后，发起请求，更新分类信息数据
        $('#btnEditDialog').on('click', function (e) {
            // 阻止表单的默认提交行为
            e.preventDefault()
            // 发起更改分类的ajax请求
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $('.form_editCate').serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('分类信息更改失败！')
                    }
                    // 重新渲染分类列表
                    getArtClass()
                    layer.close(editIndex, function () {
                        return layer.msg('分类信息更改成功！')
                    });

                }
            })
        })

    })

    // 删除分类
    $('tbody').on('click', '#deleCate', function () {
        // 获取要删除分类的id
        var id = $(this).attr('data-id');

        layer.confirm('确定删除此分类?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('文章分类删除失败！')
                    }

                    getArtClass();
                    return layer.msg('文章分类删除成功！')
                }
            })

            layer.close(index);
        });
    })


})

// 定义获取 文章分类列表 并渲染至页面中
function getArtClass() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            // console.log(res)
            // Id: 2, name: '新闻', alias: 'News', is_delete: 0
            var artClassHTML = template('art_class', res);
            $('#art_class_body').html(artClassHTML);
        }

    })
}

