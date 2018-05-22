webpackJsonp([4],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(98);

	var _common = __webpack_require__(22);

	var _common2 = _interopRequireDefault(_common);

	var _jquery = __webpack_require__(23);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__(80);

	var _global2 = _interopRequireDefault(_global);

	var _artTemplate = __webpack_require__(85);

	var _artTemplate2 = _interopRequireDefault(_artTemplate);

	var _userinfo = __webpack_require__(93);

	var _userinfo2 = _interopRequireDefault(_userinfo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Index = function () {
		function Index() {
			(0, _classCallCheck3.default)(this, Index);

			this.Render();
		}

		(0, _createClass3.default)(Index, [{
			key: 'Render',
			value: function Render() {
				var viewpdf_url = decodeURIComponent(_global2.default.GetUrlPara('viewpdf_url')),
				    download_url = decodeURIComponent(_global2.default.GetUrlPara('download_url'));
				if (download_url) {
					//下载合同
					(0, _jquery2.default)(".btns .to-index").attr("href", download_url);
				};
				if (viewpdf_url) {
					//查看合同
					(0, _jquery2.default)(".btns .to-order").attr("href", viewpdf_url);
				}
			}
		}]);
		return Index;
	}();

	_userinfo2.default.Ready(function () {
		new Index();
	});

/***/ }),

/***/ 98:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

});