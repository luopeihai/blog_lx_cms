/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Tag {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  async createTag(data) {
    return _axios({
      method: 'post',
      url: 'cms/tag',
      data,
    })
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  async getTag(id) {
    const res = await get(`cms/tag/${id}`)
    return res
  }

  async editTag(id, info) {
    const res = await put(`cms/tag/${id}`, info)
    return res
  }

  async deleteTag(id) {
    const res = await _delete(`cms/tag/${id}`)
    return res
  }

  async getTags(page = 0, count = 10, title) {
    return get('cms/tag', {
      page,
      count,
      title,
    })
  }
}

export default new Tag()
