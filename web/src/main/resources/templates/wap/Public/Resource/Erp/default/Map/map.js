/**
 * Created by zhushaolei on 15-1-28.
 */
// 百度地图API功能
var map = new BMap.Map("allmap");
map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);
map.enableScrollWheelZoom();
var polyline = new BMap.Polyline([
    new BMap.Point(116.399, 39.910),
    new BMap.Point(116.405, 39.920),
    new BMap.Point(116.423493, 39.907445)
], { strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});   //创建折线
map.addOverlay(polyline);   //增加折线

var polygon = new BMap.Polygon([
    new BMap.Point(116.387112,39.920977),
    new BMap.Point(116.385243,39.913063),
    new BMap.Point(116.394226,39.917988),
    new BMap.Point(116.401772,39.921364),
    new BMap.Point(116.41248,39.927893)
], { strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});  //创建多边形
map.addOverlay(polygon);   //增加多边形

var index = 0;
var myGeo = new BMap.Geocoder();
var adds = [
    "包河区金寨路1号（金寨路与望江西路交叉口）",
    "庐阳区凤台路209号（凤台路与蒙城北路交叉口）",
    "蜀山区金寨路217号(近安医附院公交车站)",
    "蜀山区梅山路10号(近安徽饭店) ",
    "蜀山区 长丰南路159号铜锣湾广场312室",
    "合肥市寿春路93号钱柜星乐町KTV（逍遥津公园对面）",
    "庐阳区长江中路177号",
    "新站区胜利路89"
];
function bdGEO(){
    var add = adds[index];
    geocodeSearch(add);
    index++;
}
function geocodeSearch(add){
    if(index < adds.length){
        setTimeout(window.bdGEO,400);
    }
    myGeo.getPoint(add, function(point){
        if (point) {
            document.getElementById("result").innerHTML +=  index + "、" + add + ":" + point.lng + "," + point.lat + "</br>";
            var address = new BMap.Point(point.lng, point.lat);
            addMarker(address,new BMap.Label(index+":"+add,{offset:new BMap.Size(20,-10)}));
        }
    }, "合肥市");
}
// 编写自定义函数,创建标注
function addMarker(point,label){
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
    marker.setLabel(label);
}