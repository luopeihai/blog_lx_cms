/* eslint-disable class-methods-use-this */
import { get } from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class IP {
  // constructor() {}
  async getWorks(page = 0, count = 10) {
    return get('cms/home/ip', {
      page,
      count,
    })
  }
}

export default new IP()
