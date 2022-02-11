<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">作品列表</div>
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
        <el-table-column :show-overflow-tooltip="true" prop="title" label="标题"></el-table-column>
        <el-table-column prop="cover" label="封面图">
          <template v-if="scope.row.cover" slot-scope="scope">
            <img class="display_img" :src="scope.row.cover" :alt="scope.row.cover" />
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" min-width="250">
          <template slot-scope="scope">
            <el-tag :key="tag.id" class="tags" v-for="tag in scope.row.tags">
              {{ tag.title }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" min-width="150" label="创建时间"></el-table-column>
        <el-table-column fixed="right" width="150" label="操作">
          <template slot-scope="scope">
            <el-button @click.prevent="handleEdit(scope.row)" type="primary" plain size="mini">编辑</el-button>
            <el-button
              v-permission="{ permission: ['删除作品'], type: 'disabled' }"
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
    <work-modify v-else @editClose="editClose" :editID="editID"></work-modify>
  </div>
</template>

<script>
import work from '@/model/work'
import WorkModify from './work-modify'

export default {
  components: {
    WorkModify,
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
    await this.getWorks()
    this.loading = false
  },
  methods: {
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      this.getWorks()
      this.loading = false
    },
    async onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.getWorks()
        }
      })
    },
    async getWorks() {
      try {
        const page = this.currentPage > 1 ? this.currentPage - 1 : 0
        const count = this.pageCount
        const { title } = this.search
        const { isSuccess, data } = await work.getWorks(page, count, title)
        if (isSuccess) {
          const { items = [], total = 0 } = data
          this.tableData = items
          this.totalNums = total
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
      this.$confirm('此操作将永久删除该作品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const { isSuccess, message } = await work.deleteWork(val.id)
        this.$message({
          type: isSuccess ? 'success' : 'error',
          message,
        })
        if (isSuccess) {
          this.getWorks()
        }
      })
    },
    editClose() {
      this.showEdit = false
      this.getWorks()
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
  .display_img {
    width: 100px;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
  .tags {
    margin-left: 5px;
    margin-bottom: 10px;
    &:first-child {
      margin-left: 0px;
    }
  }
}
</style>
