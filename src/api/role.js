import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/role/list',
    method: 'get',
    params: query
  })
}

export function fetchRole() {
  return request({
    url: '/role/detail',
    method: 'get'
  })
}

export function createArticle(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}
