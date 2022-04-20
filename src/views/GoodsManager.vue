<template>
  <div class="goods-manager">
    <!-- 操控区 -->
    <div class="handler-box">
      <router-link
        :to="{
          path: '/home/goods_detail',
        }"
      >
        <el-button type="primary" icon="el-icon-plus" size="small">
          新增
        </el-button></router-link
      >
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
        prop="goodsId"
        label="商品编号"
        min-width="10%"
      ></el-table-column>

      <el-table-column
        prop="goodsName"
        label="商品名称"
        min-width="12%"
      ></el-table-column>
      <el-table-column
        prop="goodsIntro"
        label="商品简介"
        min-width="18%"
      ></el-table-column>
      <el-table-column label="商品图片" min-width="12%">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.goodsCoverImg"
            :preview-src-list="[scope.row.goodsCoverImg]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="stockNum"
        label="商品库存"
        min-width="12%"
      ></el-table-column>
      <el-table-column
        prop="sellingPrice"
        label="商品售价"
        min-width="12%"
      ></el-table-column>
      <el-table-column label="上架状态" min-width="10%">
        <template slot-scope="scope">
          <div
            :style="{
              color: scope.row.goodsSellStatus ? '#FF0000' : '#008000',
            }"
          >
            {{ scope.row.goodsSellStatus ? '已下架' : '销售中' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="15%">
        <template v-slot="scope">
          <router-link
            :to="{
              path: '/home/goods_detail',
              query: { ids: scope.row.goodsId },
            }"
            ><el-link type="primary">修改</el-link></router-link
          >
          <el-popconfirm
            :title="scope.row.goodsSellStatus ? '确定上架吗？' : '确定下架吗？'"
            @confirm="
              scope.row.goodsSellStatus
                ? goodsOn([scope.row.goodsId])
                : goodsOff([scope.row.goodsId])
            "
          >
            <el-link type="danger" slot="reference">
              <div
                :style="{
                  color: scope.row.goodsSellStatus ? '#008000' : '#FF0000',
                }"
              >
                {{ scope.row.goodsSellStatus ? '上架' : '下架' }}
              </div>
            </el-link>
          </el-popconfirm>
        </template>
      </el-table-column>

      <template #empty></template>
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

export default {
  name: 'goods-manager',
  data() {
    return {
      /* 表单操作 */
      visible: false,
      idUpdate: false,
      headers: {
        token: localStorage.getItem('token'),
      },
      /* 表格操作 */
      tableData: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      selects: [],
    }
  },
  methods: {
    /* 表格操作 */
    /* 发送数据请求 */
    async query() {
      this.loading = true
      try {
        let { resultCode, data } = await this.$api.goods.goodsList(
          this.page,
          this.pageSize
        )
        if (+resultCode !== 200) {
          this.tableData = []
          this.loading = false
          return
        }
        let { totalCount, list } = data
        this.total = totalCount
        this.tableData = list
        this.loading = false
      } catch (error) {
        this.tableData = []
        this.loading = false
      }
    },
    /* 切换分页 */
    paginationChange(val) {
      this.page = +val
      this.query()
    },
    /* 记录已选项 */
    changeSelects(val) {
      this.selects = val.map((item) => item.goodsId)
    },
    /* 上架 */
    async goodsOn(ids) {
      let { resultCode } = await this.$api.goods.goodsOn(ids)
      if (+resultCode !== 200) {
        this.$message.error('商品上架失败')
        return
      }
      this.$message.success('商品已成功上架')
      this.query()
    },
    /* 下架 */
    async goodsOff(ids) {
      let { resultCode } = await this.$api.goods.goodsOff(ids)
      if (+resultCode !== 200) {
        this.$message.error('商品下架失败')
        return
      }
      this.$message.success('商品已成功下架')
      this.query()
    },
  },
  created() {
    this.query()
  },
}
</script>

<style lang="less" scoped>
.goods-manager {
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
