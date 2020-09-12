import Axios from 'axios'
import Config from '../../constants/config'

const config = {
  baseURL: Config.ROOT,
  validateStatus: status => status < 400,
  timeout: 4000,
}

const instance = Axios.create(config)

const Api = ({
  method = 'get',
  url = null,
  body = {},
  params = {}
}) => {
  return instance.request({
    method,
    url,
    data: method === 'get' ? null : body,
    params
  })
}

export default Api