import { Handler } from 'express'
import { join } from 'path'
import { IDevProgress } from '../interface'

const DEV_LOADING_HTML = join(__dirname, '../../../libs/devLoading/index.html')

export const devLoadingMiddleware: (opts: {
  progress: IDevProgress
}) => Handler =
  ({ progress }) =>
  (req, res, next) => {
    if (req.path === '/__xn_api/bundle-status') {
      return res.send(progress)
    }

    if (progress?.percent === 1 || progress?.status === 'done') {
      return next()
    }

    res.setHeader('Content-Type', 'text/html')
    return res.sendFile(DEV_LOADING_HTML)
  }
