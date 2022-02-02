/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Work {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  async createWork(data) {
    return _axios({
      method: 'post',
      url: 'cms/work',
      data,
    })
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  async getWork(id) {
    const res = await get(`cms/work/${id}`)
    return res
  }

  async editWork(id, info) {
    const res = await put(`cms/work/${id}`, info)
    return res
  }

  async deleteBook(id) {
    const res = await _delete(`cms/work/${id}`)
    return res
  }

  async getWorks(page = 0, count = 10) {
    return get('cms/work', {
      page,
      count,
    })
  }
}

export default new Work()
