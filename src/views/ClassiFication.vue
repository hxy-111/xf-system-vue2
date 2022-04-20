<template>
  <div class="classi-fication">
    <div class="handler-box">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="openDialog('')"
      >
        新增
      </el-button>
      <el-button
        type="danger"
        icon="el-icon-delete"
        size="small"
        @click="removeAll"
      >
        批量删除
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
        prop="categoryName"
        label="分类名称"
        min-width="30%"
      ></el-table-column>
      <el-table-column
        prop="categoryRank"
        label="排序值"
        min-width="15%"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="添加时间"
        min-width="20%"
        :formatter="formatterTime"
      ></el-table-column>
      <el-table-column label="操作" min-width="15%">
        <template v-slot="scope">
          <el-link
            type="primary"
            @click="openDialog(scope.row.categoryId, scope.row)"
            >修改</el-link
          >
          <el-link type="primary" @click="nextClassify(scope.row)"
            >下级分类</el-link
          >
          <el-popconfirm
            title="确定要删除本条数据吗？"
            @confirm="remove([scope.row.categoryId])"
          >
            <el-link type="danger" slot="reference">删除</el-link>
          </el-popconfirm>
        </template>
      </el-table-column>

      <!-- <template #empty>
        获取数据失败啦，点击
        <el-link type="danger" @click="query">刷新</el-link>
        重试！
      </template> -->
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

    <!-- 新增/修改 -->
    <el-dialog
      :title="categoryId ? `修改分类` : `添加分类`"
      width="30%"
      :visible="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closeDialog"
    >
      <el-form
        label-width="100px"
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
      >
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model.trim="ruleForm.categoryName"></el-input>
        </el-form-item>
        <el-form-item label="排序值" prop="categoryRank">
          <el-input-number
            v-model.trim="ruleForm.categoryRank"
            :min="1"
            :max="200"
          >
          </el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submit">确认提交信息</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { formatTime } from '@/assets/utils'

export default {
  name: 'classi-fication',
  data() {
    return {
      /* 表单操作 */
      visible: false,
      idUpdate: false,
      categoryId: '',
      ruleForm: {
        categoryName: '',
        categoryRank: '',
        categoryLevel: 1,
        parentId: 0,
      },
      rules: {
        categoryName: [
          { required: true, message: '必须设置分类名称', trigger: 'blur' },
        ],
        categoryRank: [
          { required: true, message: '必须设置排序值', trigger: 'blur' },
        ],
      },
      headers: {
        token: localStorage.getItem('token'),
      },
      /* 表格操作 */
      tableData: [],
      loading: false,
      page: 1,
      pageSize: 10,
      categoryLevel: 1,
      parentId: 0,
      total: 0,
      selects: [],
    }
  },
  methods: {
    /* 表单操作 */
    /* 打开表单 */
    openDialog(categoryId, row) {
      this.visible = true
      this.categoryId = categoryId
      if (categoryId) {
        // 修改操作
        let { categoryName, categoryRank, categoryLevel, parentId } = row
        this.ruleForm = {
          categoryName,
          categoryRank,
          categoryLevel,
          parentId,
        }
      }
    },
    /* 关闭表单 */
    closeDialog() {
      this.visible = false
      this.categoryId = ''
      this.$refs['ruleForm'].resetFields()
      this.ruleForm = {
        categoryName: '',
        categoryRank: '',
        categoryLevel: 1,
        parentId: 0,
      }
    },
    /* 表格操作 */
    /* 发送数据请求 */
    async query() {
      const { categoryLevel = 1, parentId = 0 } = this.$route.query
      this.loading = true
      try {
        let { resultCode, data } = await this.$api.classify.categories(
          this.page,
          this.pageSize,
          categoryLevel,
          parentId
        )
        if (+resultCode !== 200) {
          this.tableData = []
          this.loading = false
          return
        }
        let { totalCount, list } = data
        this.total = totalCount
        this.tableData = list
        this.categoryLevel = categoryLevel
        this.parentId = parentId
        this.loading = false
      } catch (error) {
        this.tableData = []
        this.loading = false
      }
    },
    /* 格式化时间 */
    formatterTime(row) {
      return formatTime(row.createTime, '{1}-{2} {3}:{4}')
    },
    /* 切换分页 */
    paginationChange(val) {
      this.page = +val
      this.query()
    },
    /* 新增或者修改信息 */
    async submit() {
      const { categoryLevel = 1, parentId = 0 } = this.$route.query
      this.ruleForm.categoryLevel = categoryLevel
      this.ruleForm.parentId = parentId
      try {
        await this.$refs['ruleForm'].validate()
        let sendFunc = this.$api.classify.categoriesInsert,
          data = { ...this.ruleForm },
          categoryId = this.categoryId
        if (categoryId) {
          // 修改
          sendFunc = this.$api.classify.categoriesUpdate
          data.categoryId = categoryId
        }
        let { resultCode } = await sendFunc(data)
        if (+resultCode !== 200) {
          this.$message.error('当前操作失败，请稍后再试~')
          return
        }
        this.$message.success('恭喜您，当前操作成功~')
        if (this.categoryId === '') this.page = 1
        this.query()
        this.closeDialog()
      } catch (error) {}
    },
    /* 删除信息 */
    async remove(ids) {
      let { resultCode } = await this.$api.classify.categoriesRemove(ids)
      if (+resultCode !== 200) {
        this.$message.error('删除失败，请您稍后再试~')
        return
      }
      this.$message.success('恭喜您，删除成功~')
      if (this.page !== 1 && this.tableData.length === 1) {
        // 如果在最后一页，而且只有一条数据，删除成功后，应该回到上一页
        this.page--
      }
      this.query()
    },
    /* 记录已选项 */
    changeSelects(val) {
      this.selects = val.map((item) => item.categoryId)
    },
    /* 批量删除 */
    async removeAll() {
      let selects = this.selects
      if (selects.length === 0) {
        this.$message.error('请至少选择一项进行删除!')
        return
      }
      try {
        await this.$confirm('此操作将永久删除选中项的内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        this.remove(selects)
      } catch (_) {}
    },
    /* 下级分类 */
    /* 发送数据请求 */
    nextClassify(row) {
      let level = row.categoryLevel + 1
      if (level === 4) {
        this.$message.error('没有下一级')
        return
      }
      this.$router.push({
        path: `level${level}`,
        query: {
          categoryLevel: level,
          parentId: row.categoryId,
        },
      })
    },
  },
  created() {
    this.query()
  },
  watch: {
    $route: {
      immediate: true, // 一旦监听到路由的变化立即执行
      handler(to, from) {
        if (['classification', 'level2', 'level3'].includes(to.name)) {
          this.page = 1
          this.query()
        }
      },
    },
  },
}
</script>

<style lang="less" scoped>
.classi-fication {
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
