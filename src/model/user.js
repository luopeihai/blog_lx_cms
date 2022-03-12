/* eslint-disable class-methods-use-this */
import { get, put } from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class User {
  async getUser() {
    const res = await get('cms/user')
    return res
  }

  async updateUser(data) {
    const res = await put('cms/user', data)
    return res
  }
}

export default new User()
