package com.jdy.b2b.web.product.vo;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotBlank;

/**
 * @Description 保存产品vo
 * @author 王斌
 * @date 2017年7月3日 下午5:48:23
 * @version V1.0
 */
public class SaveProductVO {
	private Integer pId;

	private Byte pDays;
	@NotBlank
	private String pNum;
	@NotBlank
	private String pName;
	private String pNameShort;
	@NotBlank
	private String pSiteName;

	private Boolean pGroom;

	private String pType;

	private String pDepartCity;

	private String pDepartPort;

	private String pDepartName;

	private String pDestinationProvince;

	private String pDestinationCity;

	private String pBigTraffic;

	private Integer pTime;

	private String pLocal;

	private String pStatus;

	private Integer pOrgId;

	private String pOrgName;

	private String pPym;

	private Integer pUid;

	private String pLinkman;

	private String pManQq;

	private String pMeetTel;

	private String pSceneId;

	private String pSbId;

	private String pSelfKey;

	private String pSystemKey;

	private Integer pLastDate;
	@NotBlank
	private String pCover;
	@NotBlank
	private String pStay;

	private String pTraffic;

	private String pOrgMarket;

	private Integer pCid;

	private String pAttach;

	private String pRenege;

	private Byte pConfirm;

	private Integer pSales;

	private Float pClusterRate;

	private String pBackPort;

	private String pBackName;

	private String pBackId;
	@NotNull
	private String pSeries;

	private Integer pEndtime;

	private Integer pEnduid;
	// ditail信息
	private Integer pdId;
	private Integer pdProductId;
	private Integer pdVersion;
	private PdContentVO pdContent;
	private Integer pdEndDate;
	private Integer pdOldId;
	private Integer pdOperateTime;
	private Byte pdOrder;
	private String pdProductName;
	private Integer pdStartDate;
	private String pdStatus;
	private String pdTitle;

	public Integer getpId() {
		return pId;
	}

	public void setpId(Integer pId) {
		this.pId = pId;
	}

	public Byte getpDays() {
		return pDays;
	}

	public void setpDays(Byte pDays) {
		this.pDays = pDays;
	}

	public String getpNum() {
		return pNum;
	}

	public void setpNum(String pNum) {
		this.pNum = pNum;
	}

	public String getpName() {
		return pName;
	}

	public void setpName(String pName) {
		this.pName = pName;
	}

	public String getpNameShort() {
		return pNameShort;
	}

	public void setpNameShort(String pNameShort) {
		this.pNameShort = pNameShort;
	}

	public String getpSiteName() {
		return pSiteName;
	}

	public void setpSiteName(String pSiteName) {
		this.pSiteName = pSiteName;
	}

	public Boolean getpGroom() {
		return pGroom;
	}

	public void setpGroom(Boolean pGroom) {
		this.pGroom = pGroom;
	}

	public String getpType() {
		return pType;
	}

	public void setpType(String pType) {
		this.pType = pType;
	}

	public String getpDepartCity() {
		return pDepartCity;
	}

	public void setpDepartCity(String pDepartCity) {
		this.pDepartCity = pDepartCity;
	}

	public String getpDepartPort() {
		return pDepartPort;
	}

	public void setpDepartPort(String pDepartPort) {
		this.pDepartPort = pDepartPort;
	}

	public String getpDepartName() {
		return pDepartName;
	}

	public void setpDepartName(String pDepartName) {
		this.pDepartName = pDepartName;
	}

	public String getpDestinationProvince() {
		return pDestinationProvince;
	}

	public void setpDestinationProvince(String pDestinationProvince) {
		this.pDestinationProvince = pDestinationProvince;
	}

	public String getpDestinationCity() {
		return pDestinationCity;
	}

	public void setpDestinationCity(String pDestinationCity) {
		this.pDestinationCity = pDestinationCity;
	}

	public String getpBigTraffic() {
		return pBigTraffic;
	}

	public void setpBigTraffic(String pBigTraffic) {
		this.pBigTraffic = pBigTraffic;
	}

	public Integer getpTime() {
		return pTime;
	}

	public void setpTime(Integer pTime) {
		this.pTime = pTime;
	}

	public String getpLocal() {
		return pLocal;
	}

	public void setpLocal(String pLocal) {
		this.pLocal = pLocal;
	}

	public String getpStatus() {
		return pStatus;
	}

	public void setpStatus(String pStatus) {
		this.pStatus = pStatus;
	}

	public Integer getpOrgId() {
		return pOrgId;
	}

	public void setpOrgId(Integer pOrgId) {
		this.pOrgId = pOrgId;
	}

	public String getpOrgName() {
		return pOrgName;
	}

	public void setpOrgName(String pOrgName) {
		this.pOrgName = pOrgName;
	}

	public String getpPym() {
		return pPym;
	}

	public void setpPym(String pPym) {
		this.pPym = pPym;
	}

	public Integer getpUid() {
		return pUid;
	}

	public void setpUid(Integer pUid) {
		this.pUid = pUid;
	}

	public String getpLinkman() {
		return pLinkman;
	}

	public void setpLinkman(String pLinkman) {
		this.pLinkman = pLinkman;
	}

	public String getpManQq() {
		return pManQq;
	}

	public void setpManQq(String pManQq) {
		this.pManQq = pManQq;
	}

	public String getpMeetTel() {
		return pMeetTel;
	}

	public void setpMeetTel(String pMeetTel) {
		this.pMeetTel = pMeetTel;
	}

	public String getpSceneId() {
		return pSceneId;
	}

	public void setpSceneId(String pSceneId) {
		this.pSceneId = pSceneId;
	}

	public String getpSbId() {
		return pSbId;
	}

	public void setpSbId(String pSbId) {
		this.pSbId = pSbId;
	}

	public String getpSelfKey() {
		return pSelfKey;
	}

	public void setpSelfKey(String pSelfKey) {
		this.pSelfKey = pSelfKey;
	}

	public String getpSystemKey() {
		return pSystemKey;
	}

	public void setpSystemKey(String pSystemKey) {
		this.pSystemKey = pSystemKey;
	}

	public Integer getpLastDate() {
		return pLastDate;
	}

	public void setpLastDate(Integer pLastDate) {
		this.pLastDate = pLastDate;
	}

	public String getpCover() {
		return pCover;
	}

	public void setpCover(String pCover) {
		this.pCover = pCover;
	}

	public String getpStay() {
		return pStay;
	}

	public void setpStay(String pStay) {
		this.pStay = pStay;
	}

	public String getpTraffic() {
		return pTraffic;
	}

	public void setpTraffic(String pTraffic) {
		this.pTraffic = pTraffic;
	}

	public String getpOrgMarket() {
		return pOrgMarket;
	}

	public void setpOrgMarket(String pOrgMarket) {
		this.pOrgMarket = pOrgMarket;
	}

	public Integer getpCid() {
		return pCid;
	}

	public void setpCid(Integer pCid) {
		this.pCid = pCid;
	}

	public String getpAttach() {
		return pAttach;
	}

	public void setpAttach(String pAttach) {
		this.pAttach = pAttach;
	}

	public String getpRenege() {
		return pRenege;
	}

	public void setpRenege(String pRenege) {
		this.pRenege = pRenege;
	}

	public Byte getpConfirm() {
		return pConfirm;
	}

	public void setpConfirm(Byte pConfirm) {
		this.pConfirm = pConfirm;
	}

	public Integer getpSales() {
		return pSales;
	}

	public void setpSales(Integer pSales) {
		this.pSales = pSales;
	}

	public Float getpClusterRate() {
		return pClusterRate;
	}

	public void setpClusterRate(Float pClusterRate) {
		this.pClusterRate = pClusterRate;
	}

	public String getpBackPort() {
		return pBackPort;
	}

	public void setpBackPort(String pBackPort) {
		this.pBackPort = pBackPort;
	}

	public String getpBackName() {
		return pBackName;
	}

	public void setpBackName(String pBackName) {
		this.pBackName = pBackName;
	}

	public String getpBackId() {
		return pBackId;
	}

	public void setpBackId(String pBackId) {
		this.pBackId = pBackId;
	}

	public String getpSeries() {
		return pSeries;
	}

	public void setpSeries(String pSeries) {
		this.pSeries = pSeries;
	}

	public Integer getpEndtime() {
		return pEndtime;
	}

	public void setpEndtime(Integer pEndtime) {
		this.pEndtime = pEndtime;
	}

	public Integer getpEnduid() {
		return pEnduid;
	}

	public void setpEnduid(Integer pEnduid) {
		this.pEnduid = pEnduid;
	}

	public Integer getPdId() {
		return pdId;
	}

	public void setPdId(Integer pdId) {
		this.pdId = pdId;
	}

	public Integer getPdProductId() {
		return pdProductId;
	}

	public void setPdProductId(Integer pdProductId) {
		this.pdProductId = pdProductId;
	}

	public Integer getPdVersion() {
		return pdVersion;
	}

	public void setPdVersion(Integer pdVersion) {
		this.pdVersion = pdVersion;
	}

	public PdContentVO getPdContent() {
		return pdContent;
	}

	public void setPdContent(PdContentVO pdContent) {
		this.pdContent = pdContent;
	}

	public Integer getPdEndDate() {
		return pdEndDate;
	}

	public void setPdEndDate(Integer pdEndDate) {
		this.pdEndDate = pdEndDate;
	}

	public Integer getPdOldId() {
		return pdOldId;
	}

	public void setPdOldId(Integer pdOldId) {
		this.pdOldId = pdOldId;
	}

	public Integer getPdOperateTime() {
		return pdOperateTime;
	}

	public void setPdOperateTime(Integer pdOperateTime) {
		this.pdOperateTime = pdOperateTime;
	}

	public Byte getPdOrder() {
		return pdOrder;
	}

	public void setPdOrder(Byte pdOrder) {
		this.pdOrder = pdOrder;
	}

	public String getPdProductName() {
		return pdProductName;
	}

	public void setPdProductName(String pdProductName) {
		this.pdProductName = pdProductName;
	}

	public Integer getPdStartDate() {
		return pdStartDate;
	}

	public void setPdStartDate(Integer pdStartDate) {
		this.pdStartDate = pdStartDate;
	}

	public String getPdStatus() {
		return pdStatus;
	}

	public void setPdStatus(String pdStatus) {
		this.pdStatus = pdStatus;
	}

	public String getPdTitle() {
		return pdTitle;
	}

	public void setPdTitle(String pdTitle) {
		this.pdTitle = pdTitle;
	}

	@Override
	public String toString() {
		return String.format(
				"SaveProductVO [pId=%s, pDays=%s, pNum=%s, pName=%s, pNameShort=%s, pSiteName=%s, pGroom=%s, pType=%s, pDepartCity=%s, pDepartPort=%s, pDepartName=%s, pDestinationProvince=%s, pDestinationCity=%s, pBigTraffic=%s, pTime=%s, pLocal=%s, pStatus=%s, pOrgId=%s, pOrgName=%s, pPym=%s, pUid=%s, pLinkman=%s, pManQq=%s, pMeetTel=%s, pSceneId=%s, pSbId=%s, pSelfKey=%s, pSystemKey=%s, pLastDate=%s, pCover=%s, pStay=%s, pTraffic=%s, pOrgMarket=%s, pCid=%s, pAttach=%s, pRenege=%s, pConfirm=%s, pSales=%s, pClusterRate=%s, pBackPort=%s, pBackName=%s, pBackId=%s, pSeries=%s, pEndtime=%s, pEnduid=%s, pdId=%s, pdProductId=%s, pdVersion=%s, pdContent=%s, pdEndDate=%s, pdOldId=%s, pdOperateTime=%s, pdOrder=%s, pdProductName=%s, pdStartDate=%s, pdStatus=%s, pdTitle=%s]",
				pId, pDays, pNum, pName, pNameShort, pSiteName, pGroom, pType,
				pDepartCity, pDepartPort, pDepartName, pDestinationProvince,
				pDestinationCity, pBigTraffic, pTime, pLocal, pStatus, pOrgId,
				pOrgName, pPym, pUid, pLinkman, pManQq, pMeetTel, pSceneId,
				pSbId, pSelfKey, pSystemKey, pLastDate, pCover, pStay, pTraffic,
				pOrgMarket, pCid, pAttach, pRenege, pConfirm, pSales,
				pClusterRate, pBackPort, pBackName, pBackId, pSeries, pEndtime,
				pEnduid, pdId, pdProductId, pdVersion, pdContent, pdEndDate,
				pdOldId, pdOperateTime, pdOrder, pdProductName, pdStartDate,
				pdStatus, pdTitle);
	}

}
