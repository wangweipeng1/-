<template>
  <el-card>
    <!-- 面包屑 -->
    <cus-bread leave1="权限管理" leave2="角色列表"></cus-bread>
    <el-button @click="showDiaAddUser()" type="primary" plain class="btn">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%" height="400px">
      <!-- 表格-展开框 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row class="tag_one" v-for="(item1, i) in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag @close="deleRights(scope.row,item1)" closable>
                {{ item1.authName }}
              </el-tag>
                <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="tag_one" v-for="(item2, i) in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag @close="deleRights(scope.row,item2)" type="success" closable>
                    {{ item2.authName }}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag @close="deleRights(scope.row,item3)" type="danger" closable v-for="(item3, i) in item2.children" :key="item3.id">
                    {{ item3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <span v-if="scope.row.children.length === 0">未分配权限</span>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="250"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="250"></el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-button
            @click="showDiaEditUser(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            @click="showMsgBox(scope.row)"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
          <!-- 分配角色按钮 -->
          <el-button
            @click="showDiaSetRole(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加按钮对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="formdata" label-position="left" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="formdata.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="formdata.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑按钮对话框 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="formdata" label-position="left" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="formdata.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="formdata.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogTableVisibleRole">
      <el-tree
        ref="treeDom"
        :data="treedata"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrCheck"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
    
<script>
export default {
  data() {
    return {
      list: [],
      dialogFormVisibleEdit: false,
      dialogFormVisibleAdd: false,
      dialogTableVisibleRole: false,
      formdata: {
        roleId: "",
        roleName: "",
        roleDesc: ""
      },
      treedata: [],
      arrCheck: [],
      currRoleId: -1,
      defaultProps: {
        children: "children",
        label: "authName"
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async setRights () {
      const arr1 = this.$refs.treeDom.getCheckedKeys()
      const arr2 = this.$refs.treeDom.getHalfCheckedKeys()
      const arr = [...arr1, arr2]
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(',')
      })
      const {meta: {status, msg}} = res.data
      if (status === 200) {
        this.dialogTableVisibleRole = false
        this.$message.success(msg)
        this.getTableData()
      }
    },
    //   分配按钮-显示对话框
    async showDiaSetRole(role) {
       this.currRoleId = role.id
      this.dialogTableVisibleRole = true;
      const res = await this.$http.get(`rights/tree`);
      // console.log(res);
      const {
        meta: { status, msg },
        data
      } = res.data;
      if (status === 200) {
        this.treedata = data;
      }

      // 默认显示当前角色的权限
      // console.log(role)
      const temp = []
      role.children.forEach((item1) => {
        item1.children.forEach((item2) => {
          item2.children.forEach((item3) => {
            temp.push(item3.id)
          })
        })
      })
      this.arrCheck = temp
    },
    //   添加按钮-添加角色信息
    async addUser() {
      const res = await this.$http.post(`roles`, this.formdata);
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 201) {
        this.dialogFormVisibleAdd = false;
        this.$message.success(msg);
        this.getTableData();
      }
    },
    //   添加按钮-显示对话框
    async showDiaAddUser() {
      this.dialogFormVisibleAdd = true;
      this.formdata = {};
    },
    //   编辑按钮-修改用户角色信息
    async editUser() {
      const res = await this.$http.put(
        `roles/${this.formdata.roleId}`,
        this.formdata
      );
      // console.log(res)
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleEdit = false;
        this.getTableData();
        this.$message.success("修改成功");
      }
    },
    //   编辑按钮-显示编辑提示框
    async showDiaEditUser(user) {
      this.dialogFormVisibleEdit = true;
      // console.log(user)
      const res = await this.$http.get(`roles/${user.id}`);
      // console.log(res)
      const {
        meta: { status, msg },
        data
      } = res.data;
      if (status === 200) {
        this.formdata = data;
      }
    },
    //   删除按钮-显示删除提示框
    showMsgBox(user) {
      this.$confirm("确认要删除该用户角色吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // console.log(user)
          const res = await this.$http.delete(`roles/${user.id}`);
          const {
            meta: { status, msg }
          } = res.data;
          if (status === 200) {
            this.getTableData();
            this.$message.success(msg);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //   获取角色列表
    async getTableData() {
      const res = await this.$http.get(`roles`);
      //   console.log(res)
     
      const {
        data,
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.list = data;
        console.log(data, '获取角色列表所有信息---')
      }
    },
    // 关闭el-tag 删除角色指定权限
    async deleRights (role, rights) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rights.id}`)
      const {meta: {status, msg}, data} = res.data
      if (status === 200) {
        this.$message.success(msg)
        role.children = data
      }
    }
  }
};
</script>

<style>
.btn {
  margin-top: 20px;
}
.tag_one {
  margin-bottom: 10px;
}
</style>

