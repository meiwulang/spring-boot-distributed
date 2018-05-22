<template>
  <div >
      <span v-show="inputVisable">城市搜索:</span>
      <el-input  @change='theLocation' v-model="cityName"  placeholder="城市名" type="text" style="width:100px; margin-right:10px;"  id="mapInput"/>
    <div id="allmap" v-bind:style="mapStyle"></div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      mapStyle: {
        width: '100%',
        height: this.mapHeight + 'px'
      }, map: new BMap.Map("allmap"),
      cityName: this.bcityName ,
      dMapx: this.bDMapx||116.404,
      dMapy: this.bDMapy||39.915,
      inputVisable:this.bInputVisable
    }
  },
  props: {
    mapHeight: {
      type: Number,
      default: 200
    },
    bDMapx: {
      type: Number,
      default: 116.404
    },
    bDMapy: {
      type: Number,
      default: 39.915
    },
    description: {
      type: String,
      default: '天安门'
    }, 
    bcityName: {type:String,default:""},
    bInputVisable: {type:Boolean,default:true}
  },
  mounted() {
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(this.dMapx, this.dMapy);
    var marker = new BMap.Marker(point);
    // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    map.addOverlay(marker);
    map.centerAndZoom(point, 15);
    let that = this;

    map.addEventListener("click", function(e) {
      that.dMapx = e.point.lng;
      that.dMapy = e.point.lat;
      that.$emit("mapClick", e.point.lng, e.point.lat);
      map.clearOverlays();
      let localPoint = new BMap.Point(e.point.lng, e.point.lat);
      map.centerAndZoom(localPoint, 15);
      let localMarker = new BMap.Marker(localPoint);  // 创建标注
      map.addOverlay(localMarker);               // 将标注添加到地图中
      // localMarker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    });
    map.enableScrollWheelZoom(true);
    map.enableContinuousZoom();
    this.map = map;
  }, 
  // beforeUpdate()
  methods: {
    getPosition(newValue,oldvalue){
      let localPoint =  new BMap.Point(this.bDMapx,this.bDMapy)
      let localmk=new BMap.Marker(localPoint);
      this.map.centerAndZoom(localPoint, 15);
      this.map.addOverlay(localmk);   
    },
    theLocation(a) {
      if (a != "") {
        this.map.clearOverlays();
        this.map.centerAndZoom(a, 11);  
       let localPoint =  new BMap.Point(this.map.zC.lng,this.map.zC.lat)
       let localmk=new BMap.Marker(localPoint)
       this.map.addOverlay(localmk);   
      // localmk.setAnimation(BMAP_ANIMATION_BOUNCE);  
      }
    }
  },watch:{
    "cityName":"theLocation",
    "bDMapx":"getPosition",
  }
}
</script>
<style scoped>

</style>