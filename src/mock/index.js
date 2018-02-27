import Mock from 'mockjs'
import loginAPI from './login'
import roleAPI from './role'
import userAPI from './user'
import transactionAPI from './transaction'

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 翻译相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

// 角色相关
Mock.mock(/\/role\/list/, 'get', roleAPI.getList)
Mock.mock(/\/role\/options/, 'get', roleAPI.getOptions)
Mock.mock(/\/role\/detail/, 'get', roleAPI.getRole)
Mock.mock(/\/role\/create/, 'post', roleAPI.createRole)
Mock.mock(/\/role\/update/, 'post', roleAPI.updateRole)

// 用户相关
Mock.mock(/\/user\/list/, 'get', userAPI.getList)
Mock.mock(/\/user\/detail/, 'get', userAPI.getUser)
Mock.mock(/\/user\/create/, 'post', userAPI.createUser)
Mock.mock(/\/user\/update/, 'post', userAPI.updateUser)
export default Mock
