<template>
	<div class="jdy-content fleft">
		<div class="jdy-content-inner">
			<div class="jdy-tab">
				<el-button type="default" class="fright mt10 mr10" @click="goback()">返回</el-button>
			</div>

			<div class="jdy-table-wrap pt20 pb20">
				<table width="100%" cellpadding="0" cellspacing="0" class="table-custom">
					<tr>
						<th>真实姓名</th>
						<td>{{ tableData.realName }}</td>
					</tr>
					<tr>
						<th>员工编号</th>
						<td>{{ tableData.userNo }}</td>
					</tr>
					<tr>
						<th>单位名称</th>
						<td>{{ tableData.unitName }}</td>
					</tr>
					<tr>
						<th>部门名称</th>
						<td>{{ tableData.departmentName }}</td>
					</tr>
					<tr>
						<th>职务</th>
						<td>{{ tableData.dutyName }}</td>
					</tr>
					<tr>
						<th>权限等级</th>
						<td>{{ tableData.privilegeLevel | chargeReloType }}</td>
					</tr>
					<tr>
						<th class="roleth">角色权限</th>
						<td class="role">
							<div class="rolename">{{roleName}}</div>
							<div class="power">
								<div class="rolepower">
									<el-tree :data="tableData.moduleStr" :props="defaultProps" default-expand-all @node-click="handleNodeClick"></el-tree>
								</div>
							</div>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</template>
<script>
	import ApiSystem from '@/pages/system/api/index';
	export default {
		name : 'authenticDetail',
	 	data() {
      		return {
      			tableData : {},
      			roleName : '',
	        	defaultProps: {
	          		children: 'children',
	          		label: 'text'
        		}

	      	};
	    },
		mounted (){
			this.getTableData();
		},
		filters : {
			chargeReloType : function (value){
				const val = Number(value);
				let returnVal = '';
				if ( value == 0) {
					returnVal = '用户级'
				} else if ( value == 1) {
					returnVal = '部门级'
				} else if ( value == 2) {
					returnVal = '单位级'
				} else if ( value == 3) {
					returnVal = '系统级'
				}

				return returnVal;
			}
		},
		methods : {
			goback (url){
				window.history.go(-1);
			},
			//获取列表数据
			getTableData (){
				const vm = this;
				let sendData = {
					userId : this.$route.query.id,
					type : '2',
				};
				sendData = filterSendData(sendData);
				ApiSystem.getAuthenticDetail(sendData).then((response) => {
					if ( response.data.code == '200') {
						let data = response.data.data;
						if (data) {
							vm.tableData = data;
							let dataTree = eval('(' + data.moduleStr + ')');

							vm.tableData.moduleStr = dataTree.children;

							if (vm.tableData.rolePrivilegeList && vm.tableData.rolePrivilegeList.length > 0) {
								vm.roleName = vm.tableData.rolePrivilegeList[0].roleName;
							}
							
						} else{
							vm.tableData.moduleStr = [];
						}
						
					} else {
						if (response.data.message) {
							vm.$alert(response.data.message);
						} else{
							vm.$alert('code' + response.data.code);
						}
						
					}
					
				})
			},
			handleNodeClick(data) {
		    }
		}
	}
</script>
<style scoped lang='less'>
	.table-custom th{
		width : 15%;
	}
	.roleth{
		vertical-align: top;
	}
	.role{
		padding: 0;
		.rolename{
			border-bottom: 1px solid #d1dbe5;
			padding: 8px 18px;
		}
		.power{
			padding: 0px 0px 8px;
			.rolepower{
				min-width: 20%;

			}
		}
		
	}
	
	div.el-tree{
		border: 0;

	}
	.el-tree-node__expand-icon{
			margin-left: 18px;
		}

</style>