import { Button } from "antd";
import { Button as ArcoButton } from "@arco-design/web-react";
import { add } from "lodash";

export default function Page() {
  const a = 12333333333n;

  return (
    <div>
      {add(1, 2)}
      <Button>button</Button>
      <ArcoButton>button</ArcoButton>
    </div>
  );
}
