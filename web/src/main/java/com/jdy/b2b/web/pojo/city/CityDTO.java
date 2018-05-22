package com.jdy.b2b.web.pojo.city;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(description = "城市")
public class CityDTO {
    @ApiModelProperty(value = "主键id")
    private Integer id;

    @ApiModelProperty(value = "国际域名缩写，如CN")
    private String type;

    @ApiModelProperty(value = "城市编码")
    private String code;

    @ApiModelProperty(value = "城市名称")
    private String name;

    @ApiModelProperty(value = "城市字母")
    private String ename;

    @ApiModelProperty(value = "城市首字母")
    private String fename;

    @ApiModelProperty(value = "父级省市")
    private Integer pid;

    @ApiModelProperty(value = "父级省市名称")
    private String pName;

    @ApiModelProperty(value = "城市等级：1省，2市，3区/县")
    private Integer level;

    @ApiModelProperty(value = "x座标")
    private String mapX;

    @ApiModelProperty(value = "y座标")
    private String mapY;

    @ApiModelProperty(value = "z座标")
    private String mapZ;

    @ApiModelProperty(value = "是否推荐")
    private Boolean istop;

    @ApiModelProperty(value = "是否启用")
    private Boolean status;

    @ApiModelProperty(value = "城市区号")
    private String area;

    @ApiModelProperty(value = "城市是否开放:0不开放，1开放")
    private Boolean isopen;

    @ApiModelProperty(value = "区域")
    private String groupId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type == null ? null : type.trim();
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code == null ? null : code.trim();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getEname() {
        return ename;
    }

    public void setEname(String ename) {
        this.ename = ename == null ? null : ename.trim();
    }

    public String getFename() {
        return fename;
    }

    public void setFename(String fename) {
        this.fename = fename == null ? null : fename.trim();
    }

    public Integer getPid() {
        return pid;
    }

    public void setPid(Integer pid) {
        this.pid = pid;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public String getMapX() {
        return mapX;
    }

    public void setMapX(String mapX) {
        this.mapX = mapX == null ? null : mapX.trim();
    }

    public String getMapY() {
        return mapY;
    }

    public void setMapY(String mapY) {
        this.mapY = mapY == null ? null : mapY.trim();
    }

    public String getMapZ() {
        return mapZ;
    }

    public void setMapZ(String mapZ) {
        this.mapZ = mapZ == null ? null : mapZ.trim();
    }

    public Boolean getIstop() {
        return istop;
    }

    public void setIstop(Boolean istop) {
        this.istop = istop;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area == null ? null : area.trim();
    }

    public Boolean getIsopen() {
        return isopen;
    }

    public void setIsopen(Boolean isopen) {
        this.isopen = isopen;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId == null ? null : groupId.trim();
    }

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }
}