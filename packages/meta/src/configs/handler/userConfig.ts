import { InternalUserConfig } from '../interface'

const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath')

interface IHandleUserConfigOpts {
  userConfig: InternalUserConfig
}

export const handleUserConfig = ({ userConfig }: IHandleUserConfigOpts) => {
  userConfig.publicPath = getPublicUrlOrPath(false, null, userConfig.publicPath)
}
