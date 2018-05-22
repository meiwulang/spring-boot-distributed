<template>
  <div class="jdy-table el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition " 
  :class="tbClassName">
        <div class="el-table__header-wrapper">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" >
                <colgroup>
                    <col :name="item.colname" :width="item.width" v-for="item in theadData" >
                </colgroup>
                <thead>
                    <tr>
                        <th colspan="1" rowspan="1" 
                            class="is-leaf" 
                            :class="item.colname"
                            v-for="item in theadData">
                            <div class="cell">{{item.caption}}</div>
                        </th>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="el-table__body-wrapper">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 501px;">
                <colgroup>
                    <col :name="item.colname" :width="item.width" v-for="item in theadData">
                </colgroup>
                <tbody>
                    <slot name="tbody"></slot>
                    
                </tbody>
            </table>
        </div>
  </div>
</template>

<script>
export default {
    props: {
        tbClassName: String,
        theadData: Array,
        tbodyData:Array
    }
}
</script>

