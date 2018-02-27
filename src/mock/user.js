import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 30
const roleNames = ['超级管理员', '高级管理员', '营业部']

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    account: Mock.Random.string(4, 10),
    userName: Mock.Random.string('赵钱孙李字符串会从这里选择', 2, 4),
    nickName: Mock.Random.string('赵钱孙李字符串会从这里选择', 2, 4),
    operator: Mock.Random.string('赵钱孙李字符串会从这里选择', 2, 4),
    'role|1-3': roleNames,
    'status|1': ['0', '1'],
    createTime: +Mock.Random.date('T'),
    lastModifyTime: +Mock.Random.date('T')
  }))
}

export default {
  getList: config => {
    const { account, userName, status, page = 1, limit = 20 } = param2Obj(config.url)

    const mockList = List.filter(item => {
      if (status && item.status !== status) return false
      if (account && item.account.indexOf(account) < 0) return false
      if (userName && item.userName.indexOf(userName) < 0) return false
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
    account: 'testUser',
    userName: '测试用户',
    nickName: '张三',
    operator: '张三',
    role: [1, 2],
    status: '1',
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
