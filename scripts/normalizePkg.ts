import "zx/globals";
import { getPkgs } from "./getPkgs";
import sortPkg from "sort-package-json";

const run = async () => {
  getPkgs().forEach((p) => {
    const pkg = path.join(p, "package.json");
    const dirName = path.basename(p);

    // normalize pkg.json
    const pkgJson = fs.readJsonSync(pkg, "utf-8");
    const newPkgJson = {
      ...pkgJson,
      description: "Easy react bundle cli powered by swc & webpack5",
      keywords: [
        "react",
        "webpack5",
        "swc",
        "sakina",
        "xn",
        "react-app",
        "react-cli",
      ],
      homepage: `https://github.com/xn-sakina/xn/tree/main/packages/${dirName}#README`,
      repository: {
        type: "git",
        url: "https://github.com/xn-sakina/xn",
      },
      license: "MIT",
      author: "fz6m",
    };
    newPkgJson.scripts.build = `rimraf dist && tsc --declarationMap false`;
    fs.writeFileSync(
      pkg,
      `${JSON.stringify(sortPkg(newPkgJson), null, 2)}\n`,
      "utf-8"
    );

    // normalize readme.md
    const mdPath = path.join(p, "README.md");
    fs.writeFileSync(
      mdPath,
      `# ${newPkgJson.name}

Easy react bundle cli powered by swc & webpack5

See more info at [xn-sakina/xn](https://github.com/xn-sakina/xn)

`.trimEnd() + "\n",
      "utf-8"
    );
  });
};

run();
