$(function () {

    // 引入 layui form模块
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义查询参数 query 
    var query = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    // 渲染文章列表区域
    getArtLists();
    // 渲染筛选分类下拉框内容
    getArtCate();

    // 定义时间格式化函数补零函数
    function addZero(num) {
        return num < 10 ? '0' + num : num;
    }
    // 定义时间格式化函数
    template.defaults.imports.dateFormat = function (date) {
        var date = new Date(date);

        let y = date.getFullYear();
        let m = addZero(date.getMonth() + 1);
        let d = addZero(date.getDate());

        let hh = addZero(date.getHours());
        let mm = addZero(date.getMinutes());
        let ss = addZero(date.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 封装获取文章列表函数,因为后期还会反复调用
    function getArtLists() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: query,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var artLists = template('art_lists', res);
                $('tbody').html(artLists);

                // 调用分页渲染函数
                renderPage(res.total);
                // return layer.msg('获取文章列表成功！')

            }
        })
    }

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
                var artClass = template('art_class', res)

                $('[name="cate_id"]').html(artClass);
                // 重新渲染筛选分类列表
                form.render();
            }
        })
    }

    // 点击筛选按钮，重新定义筛选条件，并发起ajax请求，重新渲染数据
    $('#cate_search').on('click', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();

        // 获取筛选表单数据  并重新定义ajax中query数据
        var cate_id = $('[name="cate_id"]').val();
        var state = $('[name="state"]').val();

        // 重新定义ajax中query数据
        query.cate_id = cate_id;
        query.state = state;

        // 重新调用渲染文章列表函数，重新渲染文章列表
        getArtLists();
    })

    // 点击编辑，获取id值
    $('tbody').on('click', '#edit_art', function () {
        layer.confirm('确定重新编辑?', { icon: 3, title: '提示' }, (index) => {
            // 获取到要编辑文档的 id
            var id = $(this).attr('data-id');
            // 将修改文章的id存储到localStorage
            localStorage.setItem('id', id);
            // 跳转至文章发布页面
            location.href = '../../../article/edit_art.html';

            layer.close(index);
        });


    })


    // 删除文章
    $('tbody').on('click', '#del_art', function () {

        layer.confirm('确定删除?', { icon: 3, title: '提示' }, (index) => {
            // 获取到要删除文章的 id
            var id = $(this).attr('data-id');

            // 发起 ajax 请求 ，删除对应 id 的文章
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('文章删除失败！');
                    }

                    // 重新渲染文章列表
                    getArtLists();
                }
            })

            layer.close(index);
        });

    })

    // 封装显示页码函数
    function renderPage(total) {
        laypage.render({
            elem: 'renderPage',//注意，这里的 renderPage 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: query.pagesize,//每页显示条数
            curr: query.pagenum, //默认展示哪一页
            limits: [2, 3, 5, 10], //下拉选项，可以变换每页显示条数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                query.pagenum = obj.curr;
                query.pagesize = obj.limit;
                // getArtLists()
                if (!first) {
                    getArtLists();
                }
            }

        });
    }
})

