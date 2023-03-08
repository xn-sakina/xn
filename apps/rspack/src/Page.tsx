import { Button } from "antd";
import { Button as ArcoButton } from "@arco-design/web-react";
import { add } from "lodash";
import { a as libA } from "@xn-sakina/example-lib";
import { some } from "./a";
import { some2 } from "./a1";

import imgUrl from "./img.jpg";
import svgUrl from "./s.svg";

import styles from "./sass.module.scss";
import "./sass.scss";

export default function Page() {
  return (
    <div>
      {add(1, 2)}
      <img src={imgUrl} alt="img" />
      <img src={svgUrl} alt="img" />
      <Button>button</Button>
      <ArcoButton>button</ArcoButton>
      lib-a:{libA}
      <div className={styles.red}>red text</div>
      <div>a-js: {some}</div>
      <div>a-js: {some2}</div>
    </div>
  );
}
