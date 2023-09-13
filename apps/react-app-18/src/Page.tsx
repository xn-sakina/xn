import { Button } from 'antd'
import { Button as ArcoButton } from '@arco-design/web-react'
import { add } from 'lodash'
import { a as libA } from '@xn-sakina/example-lib'

export default function Page() {
  const a = 12333333333n
  console.log('a: ', a)

  // @ts-expect-error
  const b = window?.a?.b?.c ?? 1
  console.log('b: ', b)

  const c = [].at(1)
  const d = 'a'.replaceAll('v', 'd')

  return (
    <div>
      {b}
      {c}
      {d}
      {add(1, 2)}
      <Button>button</Button>
      <ArcoButton>button</ArcoButton>
      lib-a:{libA}
    </div>
  )
}
