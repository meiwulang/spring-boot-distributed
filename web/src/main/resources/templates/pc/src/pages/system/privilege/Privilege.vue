<template>
    <div class="jdy-content jdy-transfer fleft noborder">
        <div class="jdy-content-inner-trip">
            <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="100px" class="mt45">
                <el-row>
                    <el-form-item label="所属单位：" prop="subordinate"> 
                        <el-select v-model="ruleForm.subordinate" placeholder="请选择">
                            <el-option v-for="item in subordinate" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="快速搜索：" prop="quickSearch">
                        <el-input placeholder="编号、角色名称等" icon="search" v-model="searchInput" :on-icon-click="handleIconClick">
                        </el-input>
                    </el-form-item>
                    <el-button type="default" icon="plus" class="btnbg">
                        <router-link to="/#" class="inlineblock" style='color: #1f2d3d'>添加</router-link>
                    </el-button>
                    <el-button type="default" class="btnbg">日志</el-button>
                    <el-button type="default" class="btnbg">刷新</el-button>
                </el-row>
            </el-form>
        </div>
        <div class="jdy-table">
            <el-table :data="tableData" border class="mt20" style='width: 812px'>
                <el-table-column label="序号" type="index" width="60">
                </el-table-column>
                <el-table-column prop='perNumber' label="角色编号" width="100">
                </el-table-column>
                <el-table-column prop='sort' label="排序" width="100">
                </el-table-column>
                <el-table-column label="备注说明" width="300">
                </el-table-column>
                <el-table-column label="操作" width="250">
                    <template scope="scope">
                        <el-button type="default" size="mini">
                            编辑
                        </el-button>
                        <el-button type="default" size="mini">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <!--jdy-content end-->
</template>

<script>
export default {
    name: 'pivilege',
    data() {
        return {
            msg: 'pivilege',
            ruleForm: {
                "subordinate": "",
            },
            searchInput: '',
            rules: {},
            subordinate: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }, {
                value: '选项3',
                label: '蚵仔煎'
            }],
            tableData: [{
                perNumber: '管理公司',
                sort: '3'
            }, {
                perNumber: '分销商',
                sort: '1'
            }]
        }
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleIconClick(ev) {
            console.log(ev);
        }
    }
}
</script>

