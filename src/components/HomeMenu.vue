<template>
  <div class="home-menu">
    <el-menu
      router
      :default-active="active"
      text-color="#fff"
      active-text-color="#409eff"
      background-color="#222832"
    >
      <el-menu-item
        v-for="item in routes"
        :key="item.name"
        :index="item.name"
        v-permission="item.meta.code"
      >
        <i :class="item.meta.icon"></i>
        <span slot="title">{{ item.meta.title }}</span>
      </el-menu-item>

      <!-- <el-menu-item index="controlpanel" v-if="power.includes('0x100')">
        <i class="el-icon-menu"></i>
        <span slot="title">控制面板</span>
      </el-menu-item>

      <el-submenu index="submenu">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>主页设置</span>
        </template>
        <el-menu-item index="bannersetting" v-if="power.includes('0x101')">
          <i class="el-icon-picture-outline"></i>
          <span slot="title">轮播图设置</span>
        </el-menu-item>
        <el-menu-item index="goodssetting" v-if="power.includes('0x101')">
          <i class="el-icon-wallet"></i>
          <span slot="title">热销商品设置</span>
        </el-menu-item>
        <el-menu-item index="productsetting" v-if="power.includes('0x101')">
          <i class="el-icon-position"></i>
          <span slot="title">新品上线设置</span>
        </el-menu-item>
        <el-menu-item index="recommendsetting" v-if="power.includes('0x101')">
          <i class="el-icon-thumb"></i>
          <span slot="title">为你推荐设置</span>
        </el-menu-item>
      </el-submenu>

      <el-menu-item index="classification" v-if="power.includes('0x102')">
        <i class="el-icon-tickets"></i>
        <span slot="title">分类管理</span>
      </el-menu-item>

      <el-menu-item index="goodsmanager" v-if="power.includes('0x103')">
        <i class="el-icon-shopping-cart-full"></i>
        <span slot="title">商品管理</span>
      </el-menu-item>

      <el-menu-item index="membermanager" v-if="power.includes('0x104')">
        <i class="el-icon-user"></i>
        <span slot="title">会员管理</span>
      </el-menu-item>

      <el-menu-item index="ordermanager" v-if="power.includes('0x105')">
        <i class="el-icon-s-order"></i>
        <span slot="title">订单管理</span>
      </el-menu-item> -->
    </el-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'home-menu',
  data() {
    return {
      active: 'controlpanel',
    }
  },
  computed: {
    ...mapState(['info']),

    power() {
      // return this.info?.this.info.power?.("");
      let info = this.info || {}
      return info.power || ''
    },

    routes() {
      let routes = this.$router.getRoutes(),
        reg = /^\/home\/[\w\W]+$/
      ;/^\/home\/controlpanel(?:\/(?=$))?$/i
      return routes.filter((item) => reg.test(item.path))
    },
  },
  watch: {
    // 监听路由变化,控制MENU的选中样式
    $route: {
      handler() {
        let { name } = this.$route
        this.active = name || 'controlpanel'
      },
      immediate: true,
      deep: true,
    },
  },
}
</script>

<style lang="less" scoped>
.el-menu {
  border-right: none;
}
</style>
