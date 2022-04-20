<template>
  <div class="order-info">
    <el-card class="order_card">
      <div class="data">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单状态</span>
          </div>
          <div class="text item">
            {{ info.orderStatusString }}
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>创建时间</span>
          </div>
          <div class="text item">
            {{ info.createTime }}
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单号</span>
          </div>
          <div class="text item">
            {{ info.orderNo }}
          </div>
        </el-card>
      </div>
      <el-table :data="goods">
        <el-table-column label="商品照片" min-width="20%">
          <template slot-scope="scope">
            <el-image
              :src="
                'http://backend-api-02.newbee.ltd/' + scope.row.goodsCoverImg
              "
              :preview-src-list="[
                'http://backend-api-02.newbee.ltd/' + scope.row.goodsCoverImg,
              ]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="goodsId" label="商品编号" min-width="20%">
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名" min-width="20%">
        </el-table-column>
        <el-table-column prop="goodsCount" label="商品数量" min-width="20%">
        </el-table-column>
        <el-table-column prop="sellingPrice" label="价格" min-width="20%">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'order-info',
  data() {
    return {
      info: [],
      goods: [],
    }
  },
  methods: {
    async query() {
      let id = this.$route.query.id
      this.loading = true
      try {
        let { resultCode, data } = await this.$api.order.ordersInfo(id)
        if (+resultCode !== 200) {
          this.loading = false
          return
        }
        this.info = data
        this.goods = data.newBeeMallOrderItemVOS
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
  },
  created() {
    this.query()
  },
}
</script>

<style lang="less" scoped>
.order-info {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  .data {
    width: 100%;
    margin: 0 0 50px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  /deep/.el-card__body {
    .box-card {
      width: 100%;
      font-size: 14px;
      margin: 0 10px;
    }
  }
  .el-table {
    border: 1px solid #ebeef5;
    border-bottom: none;
  }
  /deep/.el-table__cell {
    font-size: 12px;
    .cell {
      font-size: 10px;
    }
  }
  .el-image {
    width: 100px;
    height: 100px;
  }
}
</style>
