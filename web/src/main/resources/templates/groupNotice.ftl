<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>出团通知书</title>
    <style>
        .groupNoticeBody{  background-color: #edf4f8;  }
        .groupNotice *{  padding: 0;margin: 0;font-size: 14px;font-family: Microsoft YaHei, verdana, SimHei, sans-serif ;}
        .groupNotice{ width: 1000px;  margin: 20px auto;  background-color: #fff;  border: 1px solid #d7dfe3;padding: 10px;}
        a{  text-decoration: none; text-underline: none;}
        .btn{  display: inline-block;  line-height: 1;  white-space: nowrap;  cursor: pointer;  background: #fff;  border: 1px solid #c4c4c4;  color: #1f2d3d;  margin: 0;  padding: 10px 15px;  border-radius: 4px;margin-left: 10px;  }
        .fr{  float:right;  }
        .mt10{margin-top: 10px;}
        .groupNotice h1{  font: 28px Microsoft YaHei, verdana, SimHei, sans-serif, '\9ED1\4F53';  padding-bottom: 5px;}
        .groupNotice h3{  font: 18px Microsoft YaHei, verdana, SimHei, sans-serif, '\9ED1\4F53';  padding-bottom: 5px;}
        .page-header p {
            padding-bottom: 5px;
            line-height: 20px;
        }
        #ptintHtml {  padding-top: 30px;  }
        .table-custom{
            width: 100%;
            border-top:1px solid #d7dfe3;
            border-left:1px solid #d7dfe3;
            table-layout:fixed;
        }
        .table-custom th,.table-custom td{
            border-right:1px solid #d7dfe3;
            border-bottom:1px solid #d7dfe3;
            padding: 8px 18px;
            line-height: 24px;
            color:#475669;
            vertical-align: top;
            word-break:break-all;
        }
        .table-custom td img{
            max-width:100%;
        }
        .table-custom th {
            background-color: #edf4f8;
        }
        .page-header img {
            width: 125px;
            height: 125px;
            vertical-align: top;
            margin-bottom: 10px;
        }
        .table-wrap {
            padding-bottom: 10px;
        }
        .table-wrap .blue-font {
            color: #3f96f7;
        }
        .table-wrap th {
            font-weight: bold;
        }
        .table2 th {
            text-align: left;
        }
        .table-wrap .alignR {
            text-align: right;
        }
        .table-wrap .borderR {
            border-right: 1px solid #d7dfe3;
        }
        .table-wrap .borderStyle {
            border-top: 1px solid #d7dfe3;
            border-bottom: 1px dashed #d7dfe3;
        }
        .table-custom td {
            vertical-align: middle;
            word-break: break-all;
        }
        .table-custom td.div2 {
            overflow: hidden;
            padding: 0 18px;
        }
        .table-custom td.div2 div {
            box-sizing: border-box;
            width: 50%;
            float: left;
            padding: 8px 0;
        }
        table th, table td {
            padding: 3px 5px;
            font-size: 13px;
        }
        p {
            font-size: 13px;
        }
    </style>
</head>
<body class="groupNoticeBody">

<div class="groupNotice w1000">
    <div id="ptintHtml">
        <div class="page-header">
            <div>
                <h1>出团通知书</h1>
                <h3>${(resultBean.oBuyerCompanyName)!}</h3>
                <p>电话：${(resultBean.buyerCompanyTel)!}</p>
                <p>地址：${(resultBean.salerCompanyAddress)!}</p>
            </div>
        </div>
        <div class="table-wrap">
            <table class="table-custom" cellspacing="0" cellpadding="0">
                <tr>
                    <th>线路名称</th>
                    <td colspan="3">${(resultBean.pName)!}</td>
                </tr>
                <tr>
                    <th>组团社名称</th>
                    <td>${(resultBean.oBuyerCompanyName)!}</td>
                    <th>组团联系人</th>
                    <td>${(resultBean.oBuyerName)!}</td>
                </tr>
                <tr>
                    <th>组团社电话</th>
                    <td>${(resultBean.buyerCompanyTel)!}</td>
                    <th>组团社手机</th>
                    <td>${(resultBean.buyerPhone)!}</td>
                </tr>
                <tr>
                    <th>出发日期</th>
                    <td>${(resultBean.sCalendar?string("yyyy-MM-dd"))!}</td>
                    <th>返程日期</th>
                    <td>${(resultBean.sCalendarBack?string("yyyy-MM-dd"))!}</td>
                </tr>
                <tr>
                    <th>游客名单</th>
                    <td colspan="3">
                        <#if resultBean.tourists?exists && (resultBean.tourists?size>0)>
                            <#list resultBean.tourists as tourist>
                                <#if tourist?exists>
                                    <p>${(tourist.otName)!} - ${(tourist.otLincese)!}
                                        <#if tourist.otType == 0><span>（成人票）</span></#if>
                                        <#if tourist.otType == 1><span>（儿童票）</span></#if>- ${(tourist.otPhone)!}
                                    </p>
                                </#if>
                            </#list>
                        </#if>
                    </td>
                </tr>
                <tr>
                    <th>游客明细</th>
                    <td colspan="3">${(resultBean.touristsNumInfo)!}</td>
                </tr>
                <tr>
                    <th>座位分布</th>
                    <td colspan="3">
                        <#if resultBean.sSitType==0><span>不对号入座</span></#if>
                        <#if resultBean.sSitType==1><span>对号入座(系统随机)</span></#if>
                        <#if resultBean.sSitType==2><span>对号入座(人工选择)</span></#if>
                    </td>
                </tr>
                <tr>
                    <th>当团导游</th>
                    <td colspan="3">导游提前一天通知 　</td>
                </tr>
                <tr>
                    <th>全陪信息</th>
                    <td colspan="3">导游提前一天通知 </td>
                </tr>
                <tr>
                    <th>接送信息(去)</th>
                    <td colspan="3">${(resultBean.lvStopsTouristsNumInfo)!}</td>
                </tr>
                <tr>
                    <th>接送信息(返)</th>
                    <td colspan="3">${(resultBean.rtStopsTouristsNumInfo)!}</td>
                </tr>
                <tr>
                    <th>游客联系人</th>
                    <td colspan="3">
                    <#if resultBean.tourists?exists && (resultBean.tourists?size>0)>
                        <#list resultBean.tourists as tourist>
                            <#if tourist_index == 0>
                              ${(tourist.otName)!} -- ${(tourist.otPhone)!}
                            </#if>
                        </#list>
                    </#if>
                    </td>
                </tr>
            </table>
        </div>
        <div class="table-wrap table2">
            <table class="table-custom" cellspacing="0" cellpadding="0">
            <#if resultBean.trips?exists && (resultBean.trips?size>0)>
                <#list resultBean.trips as trip>
                        <tr>
                            <th class="blue-font">
                                <strong>${((trip.tcEffectDay?string("MM月dd日")))!} ${(trip.tFromTo)!}</strong>
                            </th>
                        </tr>
                            <tr>
                                <td>${(trip.tDetailTrip)!}</td>
                            </tr>
                        <tr>
                            <td class="div2">
                                <div class="borderR">
                                    <strong>用餐：</strong> ${(trip.mealsInfo)!}  <strong class="ml20">[用餐备注]</strong>${(trip.tMealsRemark)!}</div>
                                <div>
                                    <strong>住宿：</strong> ${(trip.hotelNames)!} <strong class="ml20">[住宿备注]</strong>${(trip.tHotelRemark)!}</div>
                            </td>
                        </tr>
                </#list>
            </#if>
                <tr>
                    <th>线路特色</th>
                </tr>
                <tr>
                    <td>
                        <p>${(resultBean.pSpecial)!}</p>
                    </td>
                </tr>
                <tr>
                    <th>预订须知</th>
                </tr>
                <tr>
                    <td>
                        <p>${(resultBean.pNotes)!}</p>
                    </td>
                </tr>
                <tr>
                    <th>费用说明</th>
                </tr>
                <tr>
                    <td>
                        <p>
                            <strong>【费用包含】</strong>
                        </p>
                        <p><p>${(resultBean.pCostInclude)!}</p></p>
                        <p>
                            <strong>【费用不含】</strong>
                        </p>
                        <p><p>${(resultBean.pCostExclude)!}</p></p>
                    </td>
                </tr>
                <tr>
                    <th>温馨提醒</th>
                </tr>
                <tr>
                    <td>
                        <p>1.游客报名时，请务必提供准确姓名及身份证号码，以免产生不必要的经济损失。机票因享受团队折扣，一经确认出票，不予签改。火车票确认后就会立即出票，如取消行程或更换他人，会产生损失费，请自行承担。</p>
                        <p>2.70周岁以上老年人预定出游，须出示健康证明并有年轻的家属或朋友陪同出游。</p>
                        <p>3.出行期间，请随身携带本人有效身份证原件（出行前请务必检查自己证件的有效期），未满16周岁者请携带户口本原件。超过16周岁的游客若没有办理身份证，请在户籍所在地派出所开具相关身份证明，以免影响登机。</p>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</div>
</body>
</html>