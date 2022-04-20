<template>
  <div class="login-box">
    <div class="content">
      <div class="header">
        <img class="logo" src="../assets/images/mlogo.png" alt="" />
        <h2 class="title">新蜂商城</h2>
      </div>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="账号" prop="name">
          <el-input
            placeholder="请输入手机号/用户名"
            v-model.trim="ruleForm.name"
            @keydown.enter.native="submit"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            show-password
            v-model.trim="ruleForm.password"
            @keydown.enter.native="submit"
          ></el-input>
        </el-form-item>
        <p class="tip">
          登录表示您已同意
          <a href="javascript:;">《服务条款》</a>
        </p>
        <el-form-item>
          <el-button type="primary" @click="submit" :loading="isSubmit">
            立即登录
          </el-button>
        </el-form-item>
        <div class="remember">
          <el-checkbox v-model="checked">记住账号和密码</el-checkbox>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import md5 from "md5";
import { store } from "@/assets/utils";

export default {
  name: "xf-login",
  data() {
    const validateName = (rule, value, callback) => {
      let reg1 = /^[a-zA-Z0-9_-]{4,16}$/;
      if (!value) {
        callback(new Error("用户名不能为空"));
        return;
      }
      if (!reg1.test(value)) {
        callback(new Error("用户名格式不正确"));
        return;
      }
      callback();
    };
    const validatePassword = (rule, value, callback) => {
      let reg1 = /^[a-zA-Z0-9_-]{4,16}$/;
      if (!value) {
        callback(new Error("密码不能为空"));
        return;
      }
      if (!reg1.test(value)) {
        callback(new Error("密码格式不正确"));
        return;
      }
      callback();
    };
    return {
      ruleForm: {
        name: "",
        password: "",
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
      },
      checked: true,
      isSubmit: false,
    };
  },
  methods: {
    async submit() {
      this.isSubmit = true;
      try {
        let code = await this.$refs["ruleForm"].validate();
        if (code) {
          let { name, password } = this.ruleForm;
          // 处理是记住的密码还是用户写的密码
          if (password === "000000") {
            password = this.passwordMD5;
          } else {
            password = md5(password);
          }
          let { resultCode, data } = await this.$api.base.login(name, password);
          if (+resultCode !== 200) {
            this.$message.error("登录失败");
            this.$refs["ruleForm"].resetFields();
            this.isSubmit = false;
            return;
          }
          this.$message.success("登录成功");
          localStorage.setItem("token", data);
          // this.$router.push("/home");

          let { target } = this.$route.query;
          if (!target) target = "/home";
          this.$router.push(target);
          // 记住账号和密码
          if (this.checked) {
            store.set("remember", {
              name,
              password,
            });
          } else {
            store.remove("remember");
          }
        }
      } catch (_) {}
      this.isSubmit = false;
    },
  },
  created() {
    let data = store.get("remember");
    if (data) {
      this.ruleForm = {
        name: data.name,
        password: "000000",
      };
      this.passwordMD5 = data.password;
    }
  },
};
</script>

<style lang="less" scoped>
.login-box {
  position: relative;
  height: 100%;

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    width: 420px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 20px 40px 0 rgba(0, 0, 0, 0.2);
  }
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;

  .logo {
    margin-right: 20px;
    width: 100px;
    height: 100px;
  }

  .title {
    font-size: 28px;
    color: #1baeae;
    font-weight: 700;
  }
}

.el-form {
  box-sizing: border-box;
  margin: 0 auto;
  padding-bottom: 40px;
  width: 300px;

  /deep/.el-form-item__label {
    display: block;
  }

  .tip {
    line-height: 40px;
    font-size: 14px;

    a {
      color: #409eff;
    }
  }

  .el-button {
    width: 100%;
  }
}
</style>