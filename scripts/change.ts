import { getPackages } from "@manypkg/get-packages";
import "zx/globals";
import { json } from "mrm-core";

const root = path.join(__dirname, "../");
const changesetConfig = path.join(__dirname, "../.changeset/config.json");

const getWorkspaces = async () => getPackages(root);

const change = async () => {
  const ws = await getWorkspaces();
  const appNames: string[] = [];
  ws.packages.forEach((submodule) => {
    const isPrivate = submodule.packageJson?.private;
    if (isPrivate) {
      appNames.push(submodule.packageJson.name);
    }
  });

  json(changesetConfig).set("ignore", appNames).save();

  console.log(
    chalk.green(`[changeset-config]: refresh config ignore list complete`)
  );

  await $`changeset`;
};

change();
