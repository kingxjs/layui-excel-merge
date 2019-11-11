/**
 * @Description: 菜单配置
 * @Copyright: 2017 wueasy.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.8.2
 * @License：MIT
 */
layui.define(['element'], function (exports) {

    var menuConfig = {
        dataType: "local", //获取数据方式，local本地获取，server 服务端获取
        loadUrl: "", //加载数据地址
        method: "post",//请求类型，默认post
        rootMenuId: "0", //根目录菜单id
        defaultSelectTopMenuId: "1", //默认选中头部菜单id
        defaultSelectLeftMenuId: "111", //默认选中左边菜单id
        menuIdField: "menuId", //菜单id
        menuNameField: "menuName", //菜单名称
        menuIconField: "menuIcon", //菜单图标，图标必须用css
        menuHrefField: "menuHref", //菜单链接
        parentMenuIdField: "parentMenuId",//父菜单id
        data: [], //本地数据
        topdata: [] //本地数据
    };

    var element = layui.element,
        xMenu = function () {

        };
    xMenu.prototype.setData = function (data, topdata) {
        if (!$.isEmpty(data)) {
            menuConfig.data = data;
        }
        if (!$.isEmpty(topdata)) {
            menuConfig.topdata = topdata;
        }
    };

    xMenu.prototype.render = function (data, topdata) {
        if (!$.isEmpty(data)) {
            menuConfig.data = data;
        }
        if (!$.isEmpty(topdata)) {
            menuConfig.topdata = topdata;
        }
        this.loadData();

        this.showMenu();

    };

	/**
	 * 加载数据
	 */
    xMenu.prototype.loadData = function () {

        if (menuConfig.dataType == "server") {//服务端拉取数据

            var url = menuConfig.loadUrl;
            if ($.isEmpty(url)) {
                return;
            }

            //fsCommon.invoke(url,{},function(data){
            //		if(data[statusName] == successNo)
            //		{
            //			menuConfig.data = $.result(data,dataName);
            //		}
            //		else
            //		{
            //			//提示错误消息
            //			fsCommon.errorMsg(data[msgName]);
            //		}
            //},false,menuConfig.method);

        }

    }


	/**
	 * 获取图标
	 */
    xMenu.prototype.getIcon = function (menuIcon) {

        if (!$.isEmpty(menuIcon)) {

            if (menuIcon.indexOf("<i") == 0) {
                return menuIcon;
            } else if (menuIcon.indexOf("&#") == 0) {
                return '<i class="layui-icon">' + menuIcon + '</i>';
            } else if (menuIcon.indexOf("fa-") == 0) {
                return '<i class="fa ' + menuIcon + '"></i>';
            } else {
                return '<i class="' + menuIcon + '"></i>';
            }
        }
        return "";
    };

	/**
	 * 清空菜单
	 */
    xMenu.prototype.cleanMenu = function () {
        $("#fsTopMenu").html("");
        $("#fsLeftMenu").html("");
    }
	/**
	 * 显示菜单
	 */
    //xMenu.prototype.showMenu = function () {
    //    var thisMenu = this;
    //    var data = menuConfig.data;
    //    var topdata = menuConfig.topdata;
    //    if (!$.isEmpty(data)) {
    //        var _index = 0;
    //        //显示顶部一级菜单
    //        var fsLeftMenu = $("#nav");
    //        //显示二级菜单，循环判断是否有子栏目
    //        $.each(data, function (i2, v2) {
    //            if (menuConfig.rootMenuId === v2[menuConfig.parentMenuIdField]) {

    //                var menuRow = '<li class="';
    //                if (!$.isEmpty(menuConfig.defaultSelectLeftMenuId) && menuConfig.defaultSelectLeftMenuId == v2[menuConfig.menuIdField]) {//默认选中处理
    //                    menuRow += ' layui-this';
    //                }
    //                //显示三级菜单，循环判断是否有子栏目
    //                var menuRow3 = "";
    //                $.each(data, function (i3, v3) {
    //                    if (v2[menuConfig.menuIdField] === v3[menuConfig.parentMenuIdField]) {
    //                        if ($.isEmpty(menuRow3)) {
    //                            menuRow3 = '<ul class="sub-menu">';
    //                        }
    //                        menuRow3 += '<li';
    //                        if (!$.isEmpty(menuConfig.defaultSelectLeftMenuId) && menuConfig.defaultSelectLeftMenuId == v3[menuConfig.menuIdField]) {//默认选中处理
    //                            menuRow3 += ' class="layui-this"';
    //                            //menuRow += ' layui-nav-itemed';//默认展开二级菜单
    //                        }

    //                        menuRow3 += '><a href="javascript:;" menuId="' + v3[menuConfig.menuIdField] + '" _href="' + v3[menuConfig.menuHrefField] + '">' + thisMenu.getIcon(v3[menuConfig.menuIconField]) + ' <cite>' + v3[menuConfig.menuNameField] + '</cite></a></li>';

    //                    }

    //                });

    //                menuRow += '"><a href="javascript:;" _href="' + v2[menuConfig.menuHrefField] + '">' + thisMenu.getIcon(v2[menuConfig.menuIconField]) + ' <cite>' + v2[menuConfig.menuNameField] + '</cite>';
    //                if (!$.isEmpty(menuRow3)) {
    //                    menuRow += '<i class="fa fa-angle-left nav_right"></i>';
    //                }
    //                menuRow += '</a>';


    //                if (!$.isEmpty(menuRow3)) {
    //                    menuRow3 += '</ul>';

    //                    menuRow += menuRow3;
    //                }

    //                menuRow += '</li>';

    //                fsLeftMenu.append(menuRow);
    //            }

    //        });
    //    }
    //    if (!$.isEmpty(topdata)) {
    //        var _index = 0;
    //        //显示顶部一级菜单
    //        var fsTopMenuElem = $("#fsTopMenu");

    //        $.each(topdata, function (i, v) {
    //            if (menuConfig.rootMenuId === v[menuConfig.parentMenuIdField]) {
    //                var topStr = '<li class="layui-nav-item';
    //                //if ($.isEmpty(menuConfig.defaultSelectTopMenuId) && _index === 0) {//为空默认选中第一个
    //                //    topStr += ' layui-this';
    //                //} else if (!$.isEmpty(menuConfig.defaultSelectTopMenuId) && menuConfig.defaultSelectTopMenuId == v[menuConfig.menuIdField]) {//默认选中处理
    //                //    topStr += ' layui-this';
    //                //}
    //                _index++;
    //                topStr += '"><a href="javascript:;">' + thisMenu.getIcon(v[menuConfig.menuIconField]) + ' <cite>' + v[menuConfig.menuNameField] + '</cite></a>';

    //                var menuRow3 = "";
    //                $.each(data, function (i3, v3) {
    //                    if (v[menuConfig.menuIdField] === v3[menuConfig.parentMenuIdField]) {
    //                        if ($.isEmpty(menuRow3)) {
    //                            menuRow3 = '<dl class="layui-nav-child layui-anim layui-anim-upbit">';
    //                        }
    //                        menuRow3 += '<dd><a href="javascript:;" _href="' + v3[menuConfig.menuHrefField] + '">' + thisMenu.getIcon(v3[menuConfig.menuIconField]) + ' <cite>' + v3[menuConfig.menuNameField] + '</cite></a></dd>';

    //                    }

    //                });
    //                if (!$.isEmpty(menuRow3)) {
    //                    menuRow3 += '</ul>';

    //                    topStr += menuRow3;
    //                }


    //                topStr +='</li> ';
    //                fsTopMenuElem.append(topStr);
    //            }
    //        });
    //        element.render("nav","fsTopMenu");
    //    }
    //    element.render("nav");
    //};

    xMenu.prototype.showMenu = function (parentMenuIdField) {
        if (!parentMenuIdField) {
            parentMenuIdField = menuConfig.rootMenuId;
        }
        var thisMenu = this;
        var data = menuConfig.data;
        var topdata = menuConfig.topdata;
        var menuRow = '';
        if (!$.isEmpty(data)) {
            var _index = 0;
            //显示顶部一级菜单
            var fsLeftMenu = $("#nav");

            $.each(data, function (i2, v2) {
                if (parentMenuIdField === v2[menuConfig.parentMenuIdField]) {
                    var menuRow2 = '<li><a href="javascript:;" ';
                    if (v2[menuConfig.menuHrefField]) {
                        menuRow2 += '_href="' + v2[menuConfig.menuHrefField] + '"';
                    }
                    menuRow2 += '>' + thisMenu.getIcon(v2[menuConfig.menuIconField]) + ' <cite>' + v2[menuConfig.menuNameField] + '</cite>';

                    var menuRow3 = xMenu.showMenu(v2[menuConfig.menuIdField]);

                    if (!$.isEmpty(menuRow3)) {
                        menuRow2 += '<i class="fa fa-angle-left nav_right"></i>';
                    }
                    menuRow2 += '</a>';


                    if (menuRow3) {
                        menuRow2 += '<ul class="sub-menu">';
                        menuRow2 += menuRow3;
                        menuRow2 += '</ul>';
                    }
                    menuRow2 += '</li>';
                    menuRow += menuRow2;
                }
            });
            if (parentMenuIdField != menuConfig.rootMenuId) {
                return menuRow;
            }
        }
        if (parentMenuIdField == menuConfig.rootMenuId) {
            fsLeftMenu.append(menuRow);
            element.render("nav");
        }
    };

    var xMenu = new xMenu();
    exports("xMenu", xMenu);
});
