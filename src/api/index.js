import axios from 'axios'

export default axios.create({
  baseURL: 'https://publisher.assetstore.unity3d.com/api',
  timeout: 15000
})
