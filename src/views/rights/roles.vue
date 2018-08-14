<template>
	<el-card class="card">
		<!-- 面包屑组件 -->
		<my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
		<!-- 添加角色按钮 -->
		<el-row class="add-row">
			<el-col :span="24">
				<el-button type="primary">主要按钮</el-button>
			</el-col>
		</el-row>
		<!-- 表格部分 -->
		<el-table
			border
			stripe
			v-loading="loading"
      :data="data"
      style="width: 100%">
			<el-table-column
			type="expand">
				<template slot-scope="scope">
					<!-- scope.row -当前行的角色对象，roleName, roleDesc, children -->
					<el-row
						class="row"
						v-for="level1 in scope.row.children"
						:key="level1.id">
						<!-- 一级权限 -->
						<el-col
						:span="4">
						<el-tag
						@close="handleDelRights(scope.row,level1.id)"
						closable>
							{{ level1.authName}}
						</el-tag>
						</el-col>
						<el-col :span="20">
							<el-row
							style="margin-bottom:5px"
							v-for="level2 in level1.children"
							:key="level2.id">
								<!-- 二级权限 -->
								<el-col :span="4">
									<el-tag
									@close="handleDelRights(scope.row,level2.id)"
									type="success"
									closable>
										{{ level2.authName}}
									</el-tag>
								</el-col>
								<!-- 三级权限 -->
								<el-col :span="20">
									<el-tag
									@close="handleDelRights(scope.row,level3.id)"
									style="margin-bottom:5px;margin-right:10px"
									v-for="level3 in level2.children"
									:key="level3.id"
									closable
									type="warning"
									>
									{{ level3.authName }}
									</el-tag>
								</el-col>
							</el-row>
						</el-col>
					</el-row>
					<!-- 如果角色没有权限显示 -->
					<el-row>
						<el-col
						v-if="scope.row.children.length===0"
						:span="24">该角色没有对应的权限</el-col>
					</el-row>
				</template>
			</el-table-column>
			<el-table-column type="index">

			</el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="300">
      </el-table-column>
      <el-table-column
        label="操作">
				<template slot-scope="scope">
					<el-row>
						<el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
						<el-button type="success" icon="el-icon-check" size="mini" plain></el-button>
					</el-row>
				</template>
      </el-table-column>
    </el-table>
	</el-card>
</template>

<script>
export default {
	data() {
		return {
			data: [],
			loading: true
		}
	},
	created () {
		this.loadData()
	},
	methods: {
		// 加载页面角色列表
		async loadData() {
			const res = await this.$http.get('roles');
			// 当响应结束关闭缓存图标
			this.loading = false;
			const {meta: {status, msg}} = res.data;
			if(status === 200) {
				this.data = res.data.data;
			}else{
				this.$message.error(msg);
			}
		},
		async handleDelRights(role, rightId) {
			const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
			const {meta: {status, msg}} = res.data;
			if(status === 200) {
				role.children = res.data.data;
				this.$message.success(msg)
			}else{
				this.$message.error(msg);
			}
		}
	}
}
</script>

<style>
.add-row{
	margin: 10px 0;
}
.row{
	margin: 10px;
}
</style>
