import request from '@/utils/request'

export function fetchList(query) {debugger
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle() {debugger
  return request({
    url: '/article/detail',
    method: 'get'
  })
}

export function fetchPv(pv) {debugger
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {debugger
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {debugger
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
