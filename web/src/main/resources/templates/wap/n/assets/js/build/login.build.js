webpackJsonp([3],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__("./assets/less/develop/login.less");

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _common = __webpack_require__("./assets/js/common/common.js");

	var _common2 = _interopRequireDefault(_common);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {
		this.Init();
	}

	Start.prototype = {
		Init: function Init() {
			var _this = this;
			_this.Rem();
			(0, _jquery2.default)('#submit').on('click', function () {
				_this.Submit();
			});
		},
		Rem: function Rem() {
			(0, _jquery2.default)('.username input').val('');
			(0, _jquery2.default)('.password input').val('');

			(0, _jquery2.default)(".reme").on("click", function () {
				(0, _jquery2.default)(".reme").toggleClass("active");
			});
			var name = localStorage.getItem("b-uname");
			var pass = localStorage.getItem("b-upass");
			if (name && pass) {
				(0, _jquery2.default)('.username input').val(name);
				(0, _jquery2.default)('.password input').val(pass);
				(0, _jquery2.default)(".reme").addClass("active");
			}
		},
		Submit: function Submit() {
			var uname = _jquery2.default.trim((0, _jquery2.default)('.username input').val()),
			    upass = _jquery2.default.trim((0, _jquery2.default)('.password input').val());

			if (!uname) {
				_global2.default.Popup.Tip('请输入正确的用户名');
				return false;
			}

			if (!_global2.default.RegEx.Password(upass)) {
				_global2.default.Popup.Tip('请输入正确的密码');
				return false;
			}
			_global2.default.Ajax({
				url: '/user/distAdminLogin',
				type: 'post',
				data: {
					uAccount: uname,
					uPassword: upass
				},
				success: function success(res) {
					if (res.code == 200) {
						console.log(res);
						if ((0, _jquery2.default)(".reme").hasClass("active")) {
							localStorage.setItem("b-uname", uname);
							localStorage.setItem("b-upass", upass);
						} else {
							localStorage.setItem("b-uname", '');
							localStorage.setItem("b-upass", '');
						}
						localStorage.setItem('uDataLimit', res.data.uDataLimit.toString()); //0:用户级 1:部门级2:单位级3:系统级
						localStorage.setItem('uDepartmentId', res.data.uDepartmentId);
						localStorage.setItem('uRealName', res.data.uRealName);
						localStorage.setItem('uPic', res.data.uPic);
						localStorage.setItem('uPost', res.data.uPost);
						localStorage.setItem('cName', res.data.cName);
						localStorage.setItem('dName', res.data.dName);
						localStorage.setItem('uRealName', res.data.uRealName);
						window.location.href = 'list.html';
					} else {
						_global2.default.Popup.Tip(res.message);
					}
				}
			});
		}
	};

	_common2.default.Ready(function () {
		new Start();
	});

/***/ }),

/***/ "./assets/less/develop/login.less":
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/login.less");
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__("./node_modules/style-loader/addStyles.js")(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/login.less", function() {
				var newContent = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/login.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/login.less":
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")();
	// imports


	// module
	exports.push([module.id, "/*\n\tauthor : zhupinglei,\n\tdesc : 浏览器重置\n*/\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n}\nbody {\n  font-family: -apple-system, SF UI Text, Helvetica Neue, Helvetica, Arial, sans-serif;\n  margin: 0;\n  padding: 0;\n  color: #333;\n  font-size: 14px;\n  line-height: 1.4;\n  -webkit-text-size-adjust: 100%;\n  text-size-adjust: 100%;\n  -webkit-user-select: none;\n  /* 禁止选中文本（如无文本选中需求，此为必选项） */\n  user-select: none;\n  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);\n  background-color: #f3f5f9;\n}\nbody div,\nbody dl,\nbody dt,\nbody dd,\nbody ul,\nbody ol,\nbody li,\nbody h1,\nbody h2,\nbody h3,\nbody h4,\nbody h5,\nbody h6,\nbody pre,\nbody form,\nbody fieldset,\nbody input,\nbody p,\nbody a,\nbody blockquote,\nbody th,\nbody i,\nbody u,\nbody span {\n  margin: 0;\n  padding: 0;\n  font-weight: normal;\n}\nbody ol,\nbody ul {\n  list-style: none;\n}\nbody u,\nbody i {\n  font-weight: normal;\n  font-style: normal;\n}\nbody a {\n  color: #333;\n  text-decoration: none;\n}\nbody a,\nbody img {\n  -webkit-touch-callout: none;\n  /* 禁止长按链接与图片弹出菜单 */\n}\nbody input,\nbody select,\nbody button,\nbody textarea {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  -o-appearance: none;\n  border: none;\n  background-color: #fff;\n  margin: 0;\n  padding: 0;\n  resize: none;\n  outline: none;\n  border-radius: 0;\n}\nbody table {\n  border-collapse: collapse;\n  border-spacing: 0px;\n}\nbody .clearfix {\n  *zoom: 1;\n}\nbody .clearfix:after {\n  display: block;\n  overflow: hidden;\n  clear: both;\n  height: 0;\n  visibility: hidden;\n  content: \".\";\n}\nbody {\n  background-color: #f3f5f9;\n}\n/*----------用来移除向下箭头----------*/\n/*input[type=\"date\"]::-webkit-calendar-picker-indicator {\n   display: none;\n}*/\n/*----------用来移除叉叉按钮----------*/\n/*input[type=\"date\"]::-webkit-clear-button{\n   display:none;\n}*/\n#popup-loading {\n  width: 60px;\n  height: 60px;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  margin-left: -30px;\n  margin-top: -50px;\n  z-index: 100;\n  background: url(" + __webpack_require__("./assets/img/loading.gif") + ") center center no-repeat;\n  background-size: 30px 30px;\n  background-color: rgba(255, 255, 255, 0.6);\n  border-radius: 10px;\n}\n#popup-mask {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.1);\n  z-index: 99;\n}\n#popup-tip {\n  width: 180px;\n  line-height: 16px;\n  color: #fff;\n  background-color: #000000;\n  border-radius: 5px;\n  overflow: hidden;\n  font-size: 14px;\n  padding: 15px;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  margin-left: -105px;\n  margin-top: -30px;\n  z-index: 100;\n  text-align: center;\n}\n#popup-info {\n  word-wrap: break-word;\n  width: 200px;\n  line-height: 20px;\n  color: #333;\n  background-color: #fff;\n  border-radius: 5px;\n  overflow: hidden;\n  font-size: 14px;\n  padding: 15px;\n  position: fixed;\n  left: 50%;\n  top: 30%;\n  margin-left: -115px;\n  z-index: 100;\n  box-shadow: 0px 0px 2px #ccc;\n}\n#popup-info .popup-confirm .popup-content {\n  height: 100px;\n  background: url(" + __webpack_require__("./assets/img/guide/warr.png") + ") center 30% no-repeat;\n  background-size: 52px auto;\n}\n#popup-info .popup-confirm .popup-content .popup-txt {\n  position: relative;\n  top: 80px;\n  text-align: center;\n}\n#popup-info .popup-confirm .popup-foot {\n  position: relative;\n  height: 43px;\n}\n#popup-info .popup-confirm .popup-foot .popup-cancel,\n#popup-info .popup-confirm .popup-foot .popup-ok {\n  line-height: 43px;\n  font-size: 14px;\n  text-align: center;\n  height: 43px;\n  width: 57%;\n  position: absolute;\n  box-sizing: border-box;\n  bottom: -16px;\n}\n#popup-info .popup-confirm .popup-foot .popup-cancel {\n  color: #666;\n  left: -15px;\n  border-top: 1px solid #e7e7e7;\n}\n#popup-info .popup-confirm .popup-foot .popup-ok {\n  color: #fff;\n  background: #fc2a35;\n  right: -15px;\n}\nbody {\n  background-color: #fff;\n  height: 100%;\n}\n#wrap .main {\n  height: 100%;\n  width: 100%;\n}\n#wrap .main .logo {\n  height: 230px;\n  width: 100%;\n  text-align: center;\n}\n#wrap .main .logo img {\n  width: 108px;\n  margin-top: 65px;\n}\n#wrap .main .infor {\n  width: 85%;\n  margin: 0 auto;\n}\n#wrap .main .infor .item {\n  border-bottom: 1px solid #c6c7c9;\n}\n#wrap .main .infor .item .label-img {\n  float: left;\n  width: 30px;\n  text-align: center;\n}\n#wrap .main .infor .item .label-img img {\n  width: 14px;\n}\n#wrap .main .infor .item .label-body input {\n  width: 80%;\n  color: #333;\n  font-size: 14px;\n}\n#wrap .main .infor .item.username .label-img img {\n  width: 17px;\n}\n#wrap .main .infor .item.password {\n  margin-top: 35px;\n}\n#wrap .main .reme {\n  width: 85%;\n  margin: 15px auto 0;\n  box-sizing: border-box;\n  padding-left: 30px;\n  height: 22px;\n  line-height: 24px;\n  font-size: 12px;\n  color: #999;\n  background: url(" + __webpack_require__("./assets/img/login/w1.png") + ") 8px center no-repeat;\n  background-size: 15px 15px;\n}\n#wrap .main .reme.active {\n  background: url(" + __webpack_require__("./assets/img/login/w2.png") + ") 8px center no-repeat;\n  background-size: 15px 15px;\n}\n#wrap .main .submit {\n  width: 85%;\n  height: 40px;\n  background-color: #269ee7;\n  color: #fff;\n  font-size: 17px;\n  text-align: center;\n  line-height: 40px;\n  margin: 45px auto 0;\n  border-radius: 5px;\n}\n", ""]);

	// exports


/***/ }),

/***/ "./assets/img/login/w1.png":
/***/ (function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+nhxg7wAAAOpJREFUOI2t1L1NAzEYBuAHKyVZgS4bhAEiUfIzA2wQGoogQUFaUl9DS08oE6hR2IABGICkoqHAJ53Q3fkO+a3sz36fzt4rikLMCaY4xL5u2WKDezxDiAd3eMKkBybenWAZDQMcY9YDacoMbwGXGbAy04BxRnAcMMwIDkP6TmNW+P47/C/4gHN8dgE/8JjAbvCCgy4gXMViGzaqKw5qZiOscRT3FxXstg1rAkt0VUFFbN2GtYF1aBJLgVW0XCeTAjtDZQK++hQS2Qa8ZwQ3AYuM4CL4/RznGbA5luVLucYZXrHrgexi5zQafgDB2yvuKeJSlQAAAABJRU5ErkJggg=="

/***/ }),

/***/ "./assets/img/login/w2.png":
/***/ (function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+nhxg7wAAAOVJREFUOI2t1DFOAkEYBtDHxFKuYMcN8AAklopnkBtgY2OihbRyg23thRL0AHADD2CohcrGwtlkY5adXTNfNfPPfK+b6Sl2Yq4wxTlOtcseGzxjCSEePOEVow6YeHeERTT0FLvLOMiRccBtJgymAcOM4DCgnxHsh/Sdo1nh++/wv2CBG3y2AT/wksAe8IazNiDcxWITNqgrntTMBljjIu4nFeyxCTsGluiqgorYuglrAuvQJJYCq2i5TiYFtobKBHx1KSSyD9hmBDcB84zgPPj9C2cZsBkW5Uu5xzXeceiAHGJnHA0/wEAscBVyT5cAAAAASUVORK5CYII="

/***/ })

});