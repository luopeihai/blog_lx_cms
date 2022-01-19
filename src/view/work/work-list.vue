<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">作品列表</div>
      </div>
      <!-- 表格 -->
      <el-table :data="works" v-loading="loading">
        <el-table-column type="index" :index="indexMethod" label="序号"></el-table-column>
        <el-table-column prop="title" label="封面"></el-table-column>
        <el-table-column prop="author" label="标题"></el-table-column>
        <el-table-column prop="author" label="描述"></el-table-column>
        <el-table-column label="操作" fixed="right" width="275">
          <template #default="scope">
            <el-button plain size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button
              plain
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-permission="{ permission: '删除图书', type: 'disabled' }"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑页面 -->
    <work-modify v-else @editClose="editClose" :editId="editId"></work-modify>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import workModel from '@/model/work'
import WorkModify from './work'

export default {
  components: {
    WorkModify,
  },
  setup() {
    const works = ref([])
    const editId = ref(1)
    const loading = ref(false)
    const showEdit = ref(false)

    onMounted(() => {
      getWorks()
    })

    const getWorks = async () => {
      try {
        loading.value = true
        works.value = await workModel.getWorks()
        console.log('works', works.value)
        loading.value = false
      } catch (error) {
        loading.value = false
        if (error.code === 10020) {
          works.value = []
        }
      }
    }

    const handleEdit = id => {
      showEdit.value = true
      editId.value = id
    }

    const handleDelete = id => {
      ElMessageBox.confirm('此操作将永久删除该图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await workModel.deleteWork(id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          getWorks()
          ElMessage.success(`${res.message}`)
        }
      })
    }

    const editClose = () => {
      showEdit.value = false
      getWorks()
    }

    const indexMethod = index => index + 1

    return {
      works,
      loading,
      showEdit,
      editClose,
      handleEdit,
      editId,
      indexMethod,
      handleDelete,
    }
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
