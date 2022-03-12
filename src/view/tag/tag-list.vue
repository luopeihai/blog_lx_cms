<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">标签列表</div>
      </div>
      <el-form ref="form" :inline="true" :rules="searchRules" :model="search" @submit.native.prevent>
        <el-form-item label="标题" prop="title">
          <el-input size="medium" v-model="search.title" placeholder="请输入标题内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table stripe v-loading="loading" :data="tableData">
        <el-table-column prop="id" label="id" width="100"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="title" label="标题"></el-table-column>
        <el-table-column prop="create_time" min-width="150" label="创建时间"></el-table-column>
        <el-table-column fixed="right" width="150" label="操作">
          <template slot-scope="scope">
            <el-button @click.prevent="handleEdit(scope.row)" type="primary" plain size="mini">编辑</el-button>
            <el-button
              v-permission="{ permission: ['删除标签'], type: 'disabled' }"
              @click.prevent="handleDelete(scope.row)"
              type="danger"
              size="mini"
              plain
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :background="true"
          :page-size="pageCount"
          :current-page="currentPage"
          v-if="refreshPagination"
          layout="prev, pager, next, jumper"
          :total="totalNums"
        ></el-pagination>
      </div>
    </div>
    <!-- 编辑页面 -->
    <tag-modify v-else @editClose="editClose" :editID="editID"></tag-modify>
  </div>
</template>

<script>
import tag from '@/model/tag'
import TagModify from './tag-modify'

export default {
  components: {
    TagModify,
  },
  data() {
    return {
      search: {
        title: '',
      },
      searchRules: {},
      tableData: [],
      showEdit: false,
      editID: 1,
      loading: true,
      totalNums: 0,
      currentPage: 1,
      pageCount: 10,
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
    }
  },
  async created() {
    this.loading = true
    await this.getData()
    this.loading = false
  },
  methods: {
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      this.getData()
      this.loading = false
    },
    async onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.getData()
        }
      })
    },
    async getData() {
      try {
        const page = this.currentPage > 1 ? this.currentPage - 1 : 0
        const count = this.pageCount
        const { title } = this.search
        const { data, isSuccess } = await tag.getTags(page, count, title)
        if (isSuccess) {
          this.tableData = data.items
          this.totalNums = data.total
        }
      } catch (error) {
        if (error.code === 10020) {
          this.tableData = []
        }
      }
    },
    handleEdit(val) {
      this.showEdit = true
      this.editID = val.id
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const { isSuccess, message } = await tag.deleteTag(val.id)
        this.$message({
          type: isSuccess ? 'success' : 'error',
          message,
        })
        if (isSuccess) {
          this.getData()
        }
      })
    },
    editClose() {
      this.showEdit = false
      this.getData()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
