<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <h2 class="title">访客信息</h2>
      </div>
      <!-- 表格 -->
      <el-table stripe v-loading="loading" :data="tableData">
        <el-table-column prop="country" label="国家"></el-table-column>
        <el-table-column prop="region" label="省份"></el-table-column>
        <el-table-column prop="city" label="市"></el-table-column>
        <el-table-column prop="isp" label="运营商"></el-table-column>
        <el-table-column prop="create_time" min-width="150" label="创建时间"></el-table-column>
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
  </div>
</template>

<script>
import ip from '@/model/ip'

export default {
  data() {
    return {
      tableData: [],
      loading: true,
      totalNums: 0,
      currentPage: 1,
      pageCount: 10,
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
    }
  },
  async created() {
    this.loading = true
    await this.getIPs()
    this.loading = false
  },
  methods: {
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      this.getIPs()
      this.loading = false
    },
    async getIPs() {
      try {
        const page = this.currentPage > 1 ? this.currentPage - 1 : 0
        const count = this.pageCount
        const { isSuccess, data } = await ip.getIPs(page, count)
        if (isSuccess) {
          const { items = [], total = 0 } = data
          this.tableData = items
          this.totalNums = total
        }
      } catch (error) {
        this.tableData = []
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  .title {
    padding-bottom: 20px;
  }
}
</style>
