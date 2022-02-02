<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header"><div class="title">作品列表</div></div>
      <!-- 表格 -->
      <el-table stripe v-loading="loading" :data="tableData">
        <el-table-column prop="id" label="id" width="100"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="title" label="标题" width="150"></el-table-column>
        <el-table-column width="100" prop="cover" label="封面图">
          <template v-if="scope.row.cover" slot-scope="scope">
            <img class="display_img" :src="scope.row.cover" :alt="scope.row.cover" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="150" label="操作">
          <template slot-scope="scope">
            <el-button @click.prevent="handleEdit(scope.row)" type="primary" plain size="mini">编辑</el-button>
            <el-button
              v-permission="{ permission: ['删除活动'], type: 'disabled' }"
              @click.prevent="handleDelete(scope.row)"
              type="danger"
              size="mini"
              plain
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
      tableData: [],
      showEdit: false,
      editID: 1,
      loading: true,
    }
  },
  async created() {
    this.loading = true
    await this.getWorks()
    this.loading = false
  },
  methods: {
    async getWorks() {
      try {
        const works = await work.getWorks()
        this.tableData = works
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
      this.$confirm('此操作将永久删除该图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await work.deleteBook(val.row.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.getWorks()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    rowClick() {},
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

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
