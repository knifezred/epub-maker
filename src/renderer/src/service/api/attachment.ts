import { request } from '../request'
export function fileUpload2Server(params: string) {
  return request<string>({
    url: '/api/file/upload',
    method: 'post',
    data: params
  })
}
