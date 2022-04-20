<template>
  <div class="order-manager">
    <!-- 操控区 -->
    <div class="handler-box">
      <el-input
        v-model="orderNo"
        placeholder="请输入订单号"
        clearable
        @change="query"
      ></el-input>
      <el-select v-model="orderStatus" placeholder="请选择" @change="query">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-s-home"
        size="small"
        @click="checkDone()"
        ref="ckButton"
      >
        配货完成
      </el-button>
      <el-button
        type="primary"
        icon="el-icon-s-home"
        size="small"
        @click="checkOut()"
      >
        出库
      </el-button>
      <el-button
        type="danger"
        icon="el-icon-delete"
        size="small"
        @click="removeAll"
        :disabled="selectsChange"
      >
        关闭订单
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
        prop="orderNo"
        label="订单号"
        min-width="20%"
      ></el-table-column>
      <el-table-column
        prop="totalPrice"
        label="订单总价"
        min-width="15%"
      ></el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        min-width="15%"
        :formatter="formatterOrderStatus"
      ></el-table-column>
      <el-table-column
        prop="payType"
        label="支付方式"
        min-width="15%"
        :formatter="formatterPayType"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="15%"
        :formatter="formatterTime"
      ></el-table-column>
      <el-table-column label="操作" min-width="20%">
        <template v-slot="scope">
          <el-popconfirm
            v-if="scope.row.orderStatus === 1"
            title="确定配货完成吗？"
            @confirm="checkDone([scope.row.orderId])"
          >
            <el-link type="primary" slot="reference">配货完成</el-link>
          </el-popconfirm>
          <el-popconfirm
            v-if="scope.row.orderStatus === 2"
            title="确定出库吗？"
            @confirm="checkOut([scope.row.orderId])"
          >
            <el-link type="primary" slot="reference">出库</el-link>
          </el-popconfirm>
          <router-link
            :to="{
              path: '/home/order_detail',
              query: { id: scope.row.orderId },
            }"
            ><el-link type="primary">订单详情</el-link></router-link
          >
          <el-popconfirm
            v-if="scope.row.orderStatus < 4 && scope.row.orderStatus > -1"
            title="确定关闭订单吗？"
            @confirm="remove([scope.row.orderId])"
          >
            <el-link type="danger" slot="reference">关闭订单</el-link>
          </el-popconfirm>
        </template>
      </el-table-column>

      <template #empty> </template>
    </el-table>
    <router-view></router-view>

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
import { formatTime } from '@/assets/utils'

export default {
  name: 'order-manager',
  data() {
    return {
      /* 表单操作 */
      visible: false,
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
      orderNo: '',
      options: [
        {
          value: '',
          label: '全部',
        },
        {
          value: '0',
          label: '待支付',
        },
        {
          value: '1',
          label: '已支付',
        },
        {
          value: '2',
          label: '配货完成',
        },
        {
          value: '3',
          label: '出库成功',
        },
        {
          value: '4',
          label: '交易成功',
        },
        {
          value: '-1',
          label: '手动关闭',
        },
        {
          value: '-2',
          label: '超时关闭',
        },
        {
          value: '-3',
          label: '商家关闭',
        },
      ],
      orderStatus: '',
    }
  },
  methods: {
    /* 表格操作 */
    /* 发送数据请求 */
    async query() {
      if (this.orderNo !== '' || this.orderStatus !== '') {
        this.page = 1
        this.pageSize = 10
      }
      this.loading = true
      try {
        let { resultCode, data } = await this.$api.order.orders(
          this.page,
          this.pageSize,
          this.orderNo,
          this.orderStatus
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
    /* 格式化订单状态 */
    formatterOrderStatus(row) {
      switch (row.orderStatus) {
        case 0:
          return '待支付'
        case 1:
          return '已支付'
        case 2:
          return '配货完成'
        case 3:
          return '出库成功'
        case 4:
          return '交易成功'
        case -1:
          return '手动关闭'
        case -2:
          return '超时关闭'
        case -3:
          return '商家关闭'
      }
    },
    /* 格式化支付状态 */
    formatterPayType(row) {
      switch (row.payType) {
        case 0:
          return '未支付'
        case 1:
          return '微信支付'
        case 2:
          return '支付宝支付'
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
    /* 关闭订单 */
    async remove(ids) {
      let { resultCode } = await this.$api.order.ordersClose(ids)
      if (+resultCode !== 200) {
        this.$message.error('测试环境不支持该操作，可自行搭建后端API服务')
        return
      }
      this.$message.success('恭喜您，关闭成功~')
      this.query()
    },
    /* 记录已选项 */
    changeSelects(val) {
      this.selects = val.map((item) => item.orderId)
    },
    /* 批量关闭 */
    async removeAll() {
      let selects = this.selects
      if (selects.length === 0) {
        this.$message.error('请至少选择一项!')
        return
      }
      try {
        await this.$confirm('此操作将永久关闭选中项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        this.remove(selects)
      } catch (_) {}
    },
    /* 配货完成 */
    async checkDone(id) {
      let selects
      if (id) {
        selects = id
      } else {
        selects = this.selects
        if (selects.length === 0) {
          this.$message.error('请选择至少一项')
          return
        }
      }
      var status = false
      for (let i in selects) {
        status =
          status ||
          this.tableData.find((item) => item.orderId === selects[i])
            .orderStatus !== 1
        if (status) {
          break
        }
      }
      if (status) {
        this.$message.warning(
          '存在订单的状态不是支付成功无法执行出库操作，请重新操作！'
        )
        return
      }
      try {
        await this.$confirm('确定所选订单配货完成吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        let { resultCode } = await this.$api.order.ordersCheckDone(selects)
        if (+resultCode !== 200) {
          this.$message.error('配货失败')
          return
        }
        this.$message.success('配货完成')
        this.query()
      } catch (_) {}
    },
    /* 出库 */
    async checkOut(id) {
      let selects
      if (id) {
        selects = id
      } else {
        selects = this.selects
        if (selects.length === 0) {
          this.$message.error('请选择至少一项')
          return
        }
      }
      var status = false
      for (let i in selects) {
        let flag = this.tableData.find(
          (item) => item.orderId === selects[i]
        ).orderStatus
        status = status || (flag !== 1 && flag !== 2)
      }
      if (status) {
        this.$message.warning(
          '存在订单的状态不是支付成功或配货完成无法执行出库操作，请重新操作！'
        )
        return
      }
      try {
        await this.$confirm('确定所选订单已出库吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        let { resultCode } = await this.$api.order.ordersCheckOut(selects)
        if (+resultCode !== 200) {
          this.$message.error('出库失败')
          return
        }
        this.$message.success('出库完成')
        this.query()
      } catch (_) {}
    },
  },
  created() {
    this.query()
  },
  computed: {
    selectsChange() {
      let flag,
        status = false,
        selects = this.selects.slice()
      // selects = this.selects.cancat();
      while (selects.length > 0) {
        let id = selects.pop()
        flag = this.tableData
          .filter((item) => item.orderId === id)
          .map((i) => i.orderStatus)[0]
        status = status || [4, -1, -2, -3].includes(flag)
      }
      if (status) {
        return true
      }
      return false
    },
  },
}
</script>

<style lang="less" scoped>
.order-manager {
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

    /deep/.el-input,
    .el-select {
      width: 200px;
      height: 32px;
      margin-right: 10px;
      .el-input__inner {
        height: 32px;
      }
    }
  }
  /deep/.el-input__icon {
    line-height: 32px;
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
