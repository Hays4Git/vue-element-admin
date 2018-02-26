import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 30

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: '@first',
    code: '@first',
    'status|1': ['0', '1'],
    memo: '@first',
    createTime: +Mock.Random.date('T'),
    lastModifyTime: +Mock.Random.date('T')
  }))
}

export default {
  getList: config => {
    const { name, status, page = 1, limit = 20 } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (status && item.status !== status) return false
      if (name && item.name.indexOf(name) < 0) return false
      return true
    })

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  getRole: () => ({
    id: '1',
    name: '超级管理员',
    code: 'ADMIN:SUPER',
    status: '1',
    memo: '测试超级管理员',
    createTime: +new Date(),
    lastModifyTime: +new Date()
  }),
  createRole: () => ({
    data: 'success'
  }),
  updateRole: () => ({
    data: 'success'
  })
}
