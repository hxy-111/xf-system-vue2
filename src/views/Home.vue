<template>
  <div class="home-box">
    <div class="menu">
      <div class="logo">CMS系统</div>
      <home-menu />
    </div>

    <div class="content">
      <div class="top">
        <div class="nav">
          <div class="left" v-show="backIcon" @click="returnBack">
            <i class="el-icon-back"></i>
          </div>
          <div class="right">{{ this.$route.meta.title }}</div>
        </div>
        <div class="info">
          <i class="el-icon-user-solid"></i>
          <div class="detail" v-if="info">
            <p>账号：{{ info.loginUserName }}</p>
            <p>昵称：{{ info.nickName }}</p>
            <el-button type="primary" size="mini" @click="signout">
              退出
            </el-button>
          </div>
        </div>
      </div>

      <div class="middle">
        <keep-alive include="order-manager">
          <router-view />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import HomeMenu from '@/components/HomeMenu.vue'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'xf-home',
  components: { HomeMenu },
  data() {
    return {
      title: '',
      backIcon: false,
    }
  },
  computed: {
    ...mapState(['info']),
  },
  methods: {
    ...mapMutations(['queryProfile']),
    /* 退出登录 */
    signout() {
      // 清除本地的Token & 清除Vuex中的info
      localStorage.removeItem('token')
      this.queryProfile(null) //this.$store.commit('queryProfile',null)
      // 提示 & 跳转
      this.$message.success('您已安全退出！')
      this.$router.push('/login')
    },
    /* 返回上一级 */
    returnBack() {
      this.$router.back()
    },
  },
  watch: {
    $route: {
      immediate: true, // 一旦监听到路由的变化立即执行
      handler(to, from) {
        if (
          ['level2', 'level3', 'goods_detail', 'order_detail'].includes(to.name)
        ) {
          this.backIcon = true
        } else {
          this.backIcon = false
        }
      },
    },
  },
}
</script>

<style lang="less" scoped>
.home-box {
  position: relative;
  height: 100%;
  overflow: hidden;

  .menu {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: 200px;
    height: 100%;
    background: #222832;
    overflow: hidden;
  }

  .content {
    margin-left: 200px;
    box-sizing: border-box;
    height: 100%;
  }
}

.menu {
  .logo {
    box-sizing: border-box;
    padding-left: 80px;
    height: 50px;
    line-height: 49px;
    background: url('../assets/images/mlogo.png') no-repeat 15px;
    background-size: 50px 50px;
    border-bottom: 1px solid #f1eeee0d;
    font-size: 20px;
    color: #fff;
  }
}

.content {
  position: relative;
  padding-top: 50px;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    padding: 0 20px;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #e9e9e9;

    .nav {
      font-size: 16px;
      display: flex;
      .left {
        i {
          cursor: pointer;
          margin-right: 10px;
          padding: 4px;
          border: 1px solid #e9e9e9;
          border-radius: 50%;
        }
      }
      .right {
        font-size: 20px;
        line-height: 26px;
      }
    }

    .info {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 40px;

      i {
        cursor: pointer;
        font-size: 26px;
      }

      .detail {
        display: none;
        position: absolute;
        top: 40px;
        right: 0;
        z-index: 99999;
        box-sizing: border-box;
        padding: 12px;
        width: 300px;
        height: 100px;
        background: url('../assets/images/account-banner-bg.png') no-repeat;
        background-size: cover;
        font-size: 14px;

        p {
          line-height: 37px;
          color: #fff;
        }

        .el-button {
          position: absolute;
          right: 12px;
          top: 16px;
        }
      }

      &:hover .detail {
        display: block;
      }
    }
  }

  /deep/ .el-tab-pane {
    box-sizing: border-box;
    position: relative;
    height: 86%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  /deep/.el-tabs__content {
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  /deep/.middle {
    box-sizing: border-box;
    position: relative;
    padding: 10px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
