import browserslist from 'browserslist'

export const getBrowserTargets = ({
  root,
  env,
}: {
  root: string
  env: string
}) => {
  const browsers = browserslist(undefined, { path: root, env })
  return browsers
}
