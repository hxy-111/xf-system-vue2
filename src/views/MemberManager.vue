<template>
  <div class="member-manager">
    <!-- 操控区 -->
    <div class="handler-box">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="unLockedAll"
      >
        解除禁用
      </el-button>
      <el-button
        type="danger"
        icon="el-icon-delete"
        size="small"
        @click="lockedAll"
      >
        禁用账户
      </el-button>
    </div>

    <!-- 表格区 -->
    <el-table
      :data="tableData"
      v-loading="loading"
      height="100%"
      stripe
      @selection-change="changeSelects"
    >
      <el-table-column type="selection" min-width="10%"></el-table-column>
      <el-table-column
        prop="nickName"
        label="昵称"
        min-width="20%"
      ></el-table-column>
      <el-table-column
        prop="loginName"
        label="登录名"
        min-width="20%"
      ></el-table-column>
      <el-table-column prop="lockedFlag" label="身份状态" min-width="20%">
        <template slot-scope="scope">
          <div :style="{ color: scope.row.lockedFlag ? '#FF0000' : '#008000' }">
            {{ scope.row.lockedFlag ? "禁用" : "正常" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="isDeleted" label="是否注销" min-width="20%">
        <template slot-scope="scope">
          <div :style="{ color: scope.row.lockedFlag ? '#FF0000' : '#008000' }">
            {{ scope.row.isDeleted ? "已注销" : "正常" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="注册时间"
        label="创建时间"
        min-width="20%"
        :formatter="formatterTime"
      ></el-table-column>

      <template #empty> </template>
    </el-table>

    <!-- 分页区 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :pageSize="10"
      :current-page="page"
      @current-change="paginationChange"
      @pre-click="paginationChange"
      @next-click="paginationChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { formatTime } from "@/assets/utils";

export default {
  name: "member-manager",
  data() {
    return {
      /* 表单操作 */
      visible: false,
      headers: {
        token: localStorage.getItem("token"),
      },
      /* 表格操作 */
      tableData: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      selects: [],
    };
  },
  methods: {
    /* 表格操作 */
    /* 发送数据请求 */
    async query() {
      this.loading = true;
      try {
        let { resultCode, data } = await this.$api.member.users(
          this.page,
          this.pageSize
        );
        if (+resultCode !== 200) {
          this.tableData = [];
          this.loading = false;
          return;
        }
        let { totalCount, list } = data;
        this.total = totalCount;
        this.tableData = list;
        this.loading = false;
      } catch (error) {
        this.tableData = [];
        this.loading = false;
      }
    },
    /* 格式化时间 */
    formatterTime(row) {
      return formatTime(row.createTime, "{1}-{2} {3}:{4}");
    },
    /* 切换分页 */
    paginationChange(val) {
      this.page = +val;
      this.query();
    },
    /* 记录已选项 */
    changeSelects(val) {
      this.selects = val.map((item) => item.userId);
    },

    /* 解除禁用 */
    async unLockedAll() {
      let selects = this.selects;
      if (selects.length === 0) {
        this.$message.error("请至少选择一项!");
        return;
      }
      var status = false;
      for (var i in selects) {
        status =
          status ||
          this.tableData.find((item) => item.userId === selects[i])
            .lockedFlag === 0;
        if (status) {
          break;
        }
      }
      if (status) {
        this.$message.warning("存在状态为正常的用户，请重新操作！");
        return;
      }
      try {
        await this.$confirm("确定解除禁用所选用户吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        // this.unLocked(selects);
        let { resultCode } = await this.$api.member.usersUnLocked(selects);
        if (+resultCode !== 200) {
          this.$message.error("解除失败");
          return;
        }
        this.$message.success("解除成功");
        this.query();
      } catch (_) {}
    },

    /* 禁用用户 */
    async lockedAll() {
      let selects = this.selects;
      if (selects.length === 0) {
        this.$message.error("请至少选择一项!");
        return;
      }
      var status = false;
      for (let i in selects) {
        status =
          status ||
          this.tableData.find((item) => item.userId === selects[i])
            .lockedFlag === 1;
        if (status) {
          break;
        }
      }
      if (status) {
        this.$message.warning("存在状态为禁用的用户，请重新操作！");
        return;
      }
      try {
        await this.$confirm("确定禁用所选用户吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        // this.locked(selects);
        let { resultCode } = await this.$api.member.usersLocked(selects);
        if (+resultCode !== 200) {
          this.$message.error("禁用失败");
          return;
        }
        this.$message.success("禁用成功");
        this.query();
      } catch (_) {}
    },
  },
  created() {
    this.query();
  },
};
</script>

<style lang="less" scoped>
.member-manager {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  padding: 40px 0;

  .handler-box {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 40px;
  }

  .el-pagination {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    height: 40px;
  }

  .el-table {
    box-sizing: border-box;
    width: 100%;
  }

  .el-image {
    display: block;
    width: 50px;
    height: 50px;
  }

  .el-link {
    margin-right: 10px;
  }

  /deep/.el-dialog__body {
    padding: 10px 20px;
  }

  /deep/.el-upload {
    display: block;
  }

  .avatar-uploader-icon,
  .avatar-uploader-img {
    display: block;
    box-sizing: border-box;
    width: 120px;
    height: 120px;
    line-height: 120px;
    font-size: 24px;
    color: #8c939d;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
  }
}
</style>