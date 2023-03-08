import { Button } from "antd";
import { Button as ArcoButton } from "@arco-design/web-react";
import { add } from "lodash";
import { a as libA } from "@xn-sakina/example-lib";

import imgUrl from "./img.jpg";
import SvgUrl from "./s.svg";

import styles from "./sass.module.scss";
import "./sass.scss";

export default function Page() {
  return (
    <div>
      {add(1, 2)}
      <img src={imgUrl} alt="img" />
      <SvgUrl />
      <Button>button</Button>
      <ArcoButton>button</ArcoButton>
      lib-a:{libA}
      <div className={styles.red}>red text</div>
    </div>
  );
}