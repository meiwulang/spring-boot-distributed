/**
 * jQuery XTemplate
 * Author: Sunline
 * E-mail: as.cn@139.com
 *
 * Copyright 2013 Sunline Digital Corp.
 * Date: 13-11-6
 */
(function ($) {
    $.extend({XTemplate:function (args) {
        var html = '', tmp_html = '';
        for (var i = 0; i < arguments.length; i++) {
            html += arguments[i];
        };
        this.html = '';
        this.apply = function (data) {
            var tmp_html = '', index= 1;
            $.each(data, function (key, value) {
                value['index'] = index;
                value['rowIndex'] = key;
                tmp_html += $.Template(html).apply(value);
                index++;
            });
            this.html = tmp_html;
            return this.html;
        };
        this.append = function (data, element) {
            var html = this.apply(data);
            $(element).append(html);
        };
        this.rewrite = function (data, element) {
            var html = this.apply(data);
            $(element).html(html);
        };
        return this;
    }, Template:function (tpl) {
        var html = '', tmp_html = '';
        var reg = /\{(.+?)\}/gm;
        for (var i = 0; i < arguments.length; i++) {
            html += arguments[i];
        }
        ;
        this.tpl = tmp_html = html;
        this.html = '';
        this.apply = function (data) {
            var _type = $.type(data);
            if (_type == 'object') {
                $.each(data, function (key, value) {
                    var preg = new RegExp('{' + key + '}', 'gm');
                    tmp_html = tmp_html.replace(preg, value);
                });
                tmp_html = tmp_html.replace(reg, '');
                this.html = tmp_html;
            } else if (_type == 'array') {
                $.each(data, function (key, value) {
                    var preg = /\{(.+?)\}/gm;
                    tmp_html = tmp_html.replace(preg, function ($0, $1) {
                        return data[$1];
                    });
                });
                tmp_html = tmp_html.replace(reg, '');
                this.html = tmp_html;
            } else {
                this.html = '';
            }
            ;
            return this.html;
        };
        this.append = function (data, element) {
            var html = this.apply(data);
            $(element).append(html);
        };
        this.rewrite = function (data, element) {
            var html = this.apply(data);
            $(element).html(html);
        };
        return this;
    }});
})(jQuery);
