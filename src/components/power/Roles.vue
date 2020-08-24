<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
           <!--添加角色按钮区域-->
           <el-row>
               <el-col>
                   <el-button type="primary">添加角色</el-button>
               </el-col>
           </el-row>
           <el-table :data="roleList" border stripe>
               <el-table-column type="expand">
                   <template slot-scope="scope">
                       <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                           <!--渲染一级权限-->
                           <el-col :span="5">
                               <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                               <i class="el-icon-caret-right"></i>
                           </el-col>
                           <!--渲染二级以及三级权限-->
                           <el-col :span="19">
                               <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="7">
                                        <el-tag closable type="success" @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="17">
                                        <el-col>
                                            <el-tag type="warning" closable v-for="(item3, i3) in item2.children" :key="item3.id" @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                                        </el-col>
                                    </el-col>
                               </el-row>
                           </el-col>
                       </el-row>
                   </template>
               </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-tooltip  effect="dark" content="编辑" placement="top-start" :enterable="false">
                            <el-button type="primary" @click="showEditDialog(scope.row.id)" icon="el-icon-edit" size="mini">编辑</el-button>
                        </el-tooltip>
                        <el-tooltip  effect="dark" content="删除" placement="top-start" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
                        </el-tooltip>
                        <el-tooltip  effect="dark" content="分配权限" placement="top-start" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog
        title="分配用户权限"
        :visible.sync="rightsdialogVisible"
        @close="setRightDialogClosed"
        width="50%"
        v-dialogDrag
        draggable>
        <el-tree show-checkbox :data="rightsList" :props="defaultProps" node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef">
        </el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="rightsdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            roleList: [],
            rightsdialogVisible: false,
            rightsList: [],
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            defKeys: []
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        async showEditDialog(id) {
            // console.log(id)
            const { data: res } = await this.$http.get('users/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('查询用户信息失败！')
            }
            this.$message.success('查询用户信息成功！')
            this.editForm = res.data
            this.editDialogVisible = true
        },
        async getRolesList() {
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败')
            }
            this.roleList = res.data
        },
        async removeRightById(role, rightId) {
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            if (confirmResult !== 'confirm') {
                return this.$message.info('取消了删除！')
            }

            const { data: res } = await this.$http.delete(
                `roles/${role.id}/rights/${rightId}`
            )

            if (res.meta.status !== 200) {
                return this.$message.error('删除权限失败！')
            }

            // this.getRolesList()
            role.children = res.data
        },
        async showSetRightDialog(role) {
            this.roleId = role.id
            const { data: res } = await this.$http.get('rights/tree')
            if (res.meta.status !== 200) {
                this.$message.error('获取权限失败')
            }
            console.log(res)
            
            this.rightsList = res.data
                  // 递归获取三级节点的Id
            this.getLeafKeys(role, this.defKeys)
            this.rightsdialogVisible = true
        },
        // 通过递归形式，获取角色下所有的三级权限的id，保存到defKeys中
        getLeafKeys(node, arr) {
            // 如果当前 node 节点不包含 children 属性，则是三级节点
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item => this.getLeafKeys(item, arr))
        },
        setRightDialogClosed() {
            this.defKeys = []
        },
        // 点击为角色分配权限
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]

            const idStr = keys.join(',')

            const { data: res } = await this.$http.post(
                `roles/${this.roleId}/rights`,
                { rids: idStr }
            )

            if (res.meta.status !== 200) {
                return this.$message.error('分配权限失败！')
            }

            this.$message.success('分配权限成功！')
            this.getRolesList()
            this.rightsdialogVisible = false
        }
    }
}
</script>
<style lang="less" scoped>
.el-table {
    margin-top: 10px;
}
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
