import logger from 'electron-log'
import multer from 'multer'
import { getFileExtension } from '../utils/common'
import { AppDataSource } from './data-source'
import { initStorageApi } from './repository/storage'
import { initUserApi } from './repository/user'

// 设置存储配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/uploads/') // 保存的路径，备注：需要自己创建
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, '/uploads/' + Date.now() + getFileExtension(file.originalname))
  }
})

const upload = multer({ storage: storage })
// 绑定api接口
export function setupServerApi(server) {
  // 连接 Sqlite 数据库
  AppDataSource.initialize()
    .then(() => {
      initUserApi(server)
      initStorageApi(server)

      // 绑定上传接口
      server.post('/api/file/upload', upload.single('file'), async (req, res) => {
        try {
          res.status(200).json({
            filename: req.file.filename
          })
        } catch (error) {
          res.status(500).send(error)
        }
      })
    })
    .catch((err) => {
      logger.error(err)
    })
}
