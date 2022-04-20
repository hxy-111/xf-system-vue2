<template>
  <div class="goods-info">
    <el-card class="order_card">
      <div class="data">
        <el-form
          label-width="80px"
          ref="goodForm"
          :model="goodForm"
          :rules="rules"
        >
          <el-form-item label="商品分类" prop="goodsCategoryId">
            <el-cascader
              :placeholder="oldCategory ? oldCategory : '请选择商品分类'"
              v-model="goodForm.goodsCategoryId"
              :props="categories"
              @change="handleChange"
              popper-class="train-tree"
            >
              <!-- 字符过长，鼠标悬浮显示 -->
              <template slot-scope="{ node, data }">
                <el-tooltip
                  :disabled="data.label.length < 10"
                  class="item"
                  effect="dark"
                  :content="data.label"
                  placement="top-start"
                >
                  <span>{{ data.label }}</span>
                </el-tooltip>
              </template>
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品名称" prop="goodsName">
            <el-input
              clearable
              placeholder="请输入商品名称"
              v-model="goodForm.goodsName"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品简介" prop="goodsIntro">
            <el-input
              clearable
              type="textarea"
              v-model.trim="goodForm.goodsIntro"
              placeholder="请输入商品简介(100字)"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="originalPrice">
            <el-input
              clearable
              v-model.number="goodForm.originalPrice"
              placeholder="请输入商品价格"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品售卖价" prop="sellingPrice">
            <el-input
              clearable
              v-model.number="goodForm.sellingPrice"
              placeholder="请输入商品售价"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品库存" prop="stockNum">
            <el-input
              clearable
              v-model.number="goodForm.stockNum"
              placeholder="请输入商品库存"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品标签" prop="tag">
            <el-input
              clearable
              v-model="goodForm.tag"
              placeholder="请输入商品标签"
            ></el-input>
          </el-form-item>
          <el-form-item label="上架状态" prop="goodsSellStatus">
            <el-radio-group v-model="goodForm.goodsSellStatus">
              <el-radio :label="0">上架</el-radio>
              <el-radio :label="1">下架</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="商品主图" prop="goodsCoverImg">
            <el-upload
              class="avatar-uploader"
              accept=".jpg,.jpeg,.png,.gif"
              action="/api/upload/file"
              :show-file-list="false"
              :headers="headers"
              :on-success="fileSuccess"
              :on-error="fileError"
            >
              <img
                class="avatar-uploader-img"
                :src="goodForm.goodsCoverImg"
                alt=""
                v-if="goodForm.goodsCoverImg"
              />
              <i class="el-icon-plus avatar-uploader-icon" v-else></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="详情内容" prop="goodsDetailContent">
            <div class="editor" style="border: 1px solid #ccc">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editor"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
              <Editor
                class="editor-box"
                style="height: 500px; overflow-y: hidden"
                v-model="goodForm.goodsDetailContent"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="onCreated"
              />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">{{
              this.$route.query.ids ? '修改' : '创建'
            }}</el-button>
            <el-button @click="returnBack">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { number } from 'echarts'

export default {
  name: 'goods-info',
  components: { Editor, Toolbar },
  data() {
    return {
      goodsId: '',
      goodForm: {
        goodsCategoryId: '',
        goodsName: '',
        goodsIntro: '',
        originalPrice: '',
        sellingPrice: '',
        stockNum: '',
        tag: '',
        goodsSellStatus: '',
        goodsCoverImg: '',
        goodsDetailContent: '',
      },
      rules: {
        goodsCategoryId: [
          { required: true, message: '必须设置商品分类', trigger: 'blur' },
        ],
        goodsName: [
          { required: true, message: '必须设置商品名称', trigger: 'blur' },
        ],
        goodsIntro: [
          { required: true, message: '必须设置商品简介', trigger: 'blur' },
        ],
        originalPrice: [
          { required: true, message: '必须设置商品价格', trigger: 'blur' },
          { type: 'number', message: '必须为数字' },
        ],
        sellingPrice: [
          { required: true, message: '必须设置商品售价', trigger: 'blur' },
          { type: 'number', message: '必须为数字' },
        ],
        stockNum: [
          {
            required: true,
            message: '必须设置商品库存',
            trigger: 'blur',
          },
          { type: 'number', message: '必须为数字' },
        ],
        tag: [{ required: true, message: '必须设置商品标签', trigger: 'blur' }],
        goodsSellStatus: [
          { required: true, message: '必须设置上架状态', trigger: 'blur' },
        ],
        goodsCoverImg: [
          { required: true, message: '必须上传商品主图', trigger: 'blur' },
        ],
      },
      headers: {
        token: localStorage.getItem('token'),
      },
      // 级联选择器
      oldCategory: '',
      categories: {
        // checkStrictly: true,
        lazy: true, //可以理解为开关，什么时候结束
        lazyLoad: this.cascaderLazyLoad,
      },
      levelFirst: '',
      levelSecond: '',
      // 编辑器
      editor: null,
      toolbarConfig: {},
      editorConfig: { placeholder: '请输入内容...' },
      mode: 'default', // 'default' or 'simple'
    }
  },
  methods: {
    /* 图片上传 */
    fileSuccess(response) {
      let { resultCode, data } = response
      if (+resultCode === 200) {
        this.goodForm.goodsCoverImg = data
        return
      }
      this.fileError()
    },
    fileError() {
      this.$message.error('上传图片失败，请稍后再试~')
    },
    returnBack() {
      // this.$router.back()
      this.$router.go(-1)
    },
    async submit() {
      try {
        await this.$refs['goodForm'].validate()
        this.loading = true
        // 新增
        let sendFunc = this.$api.goods.goodsInsert,
          data = { ...this.goodForm },
          goodsId = this.goodsId
        if (goodsId) {
          // 修改
          sendFunc = this.$api.goods.goodsUpdate
          data.goodsId = goodsId
        }
        let { resultCode } = await sendFunc(data)
        if (+resultCode !== 200) {
          this.$message.error(
            sendFunc === this.$api.goods.goodsInsert ? '新增失败' : '修改失败'
          )
          this.loading = false
          return
        }
        this.$message.success(
          sendFunc === this.$api.goods.goodsInsert ? '新增成功' : '修改成功'
        )
        // this.$router.push({ path: '/home/goodsmanager' })
        this.returnBack()
        this.loading = false
      } catch (error) {}
    },
    cascaderLazyLoad(node, resolve) {
      if (!node) {
        return false
      }
      const { level = 0, value } = node
      //level代表当前点击选择哪一项，，比如0代表第一次进去加载数据，1是选择第一项后的操作
      if (level == 1) {
        this.levelFirst = node.value //选择第一项后对数据进行存储，因为要用第一项去查询第二项
      } else if (level == 2) {
        this.levelSecond = node.value //同上要去第三项
      }
      this.$api.classify
        .categories(1, 1000, level + 1, value || 0)
        .then((res) => {
          if (+res.resultCode === 200) {
            resolve(
              res.data.list.map((item) => {
                return {
                  value: item.categoryId,
                  label: item.categoryName,
                  leaf: level >= 2, //因为数据最大三项，所以第三次点击就不用在加载了，所以 >=2
                }
              })
            )
          }
        })
    },
    handleChange(value) {
      // let val = value.slice(-1)[0]
      let val = +value.slice(-1).toString()
      this.goodForm.goodsCategoryId = val || null
    },
    async query() {
      let id = this.$route.query.ids
      if (id) {
        this.loading = true
        this.goodsId = id
        try {
          let { resultCode, data } = await this.$api.goods.goodsInfo(id)
          if (+resultCode !== 200) {
            this.loading = false
            return
          }
          this.goodForm = {
            goodsCategoryId: data.goods.goodsCategoryId,
            goodsName: data.goods.goodsName,
            goodsIntro: data.goods.goodsIntro,
            originalPrice: data.goods.originalPrice,
            sellingPrice: data.goods.sellingPrice,
            stockNum: data.goods.stockNum,
            tag: data.goods.tag,
            goodsSellStatus: data.goods.goodsSellStatus,
            goodsCoverImg: data.goods.goodsCoverImg,
            goodsDetailContent: data.goods.goodsDetailContent,
          }
          this.categoryId = data.goods.goodsCategoryId
          this.oldCategory = `${data.firstCategory.categoryName}/${data.secondCategory.categoryName}/${data.thirdCategory.categoryName}`
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      }
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
  },
  created() {
    this.query()
  },
  mounted() {
    // 模拟 ajax 请求，异步渲染编辑器
    // setTimeout(() => {
    //   this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
    // }, 1500)
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
}
</script>

<style lang="less" scoped>
.goods-info {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  /deep/.el-form-item__label {
    width: 100px !important;
  }
  .el-input,
  .el-select,
  .el-cascader,
  .el-textarea {
    width: 300px;
  }
  .editor {
    margin-left: 20px;
    width: 720px;
  }
  .editor-box {
    height: 300px !important;
  }
  .el-button {
    margin-left: 20px;
  }
  /deep/.el-form-item__error {
    padding-left: 20px;
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
<style>
.train-tree {
  max-width: 600px !important;
}
.el-cascader-menu {
  max-width: 200px !important;
}
</style>
