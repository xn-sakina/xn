import "zx/globals";

const wsPath = path.join(__dirname, "../packages");
export const getPkgs = () => {
  const dirs = fs
    .readdirSync(wsPath)
    .filter((dir) => {
      if (
        dir === ".DS_Store" ||
        !fs.statSync(path.join(wsPath, dir)).isDirectory()
      ) {
        return false;
      }
      return true;
    })
    .map((dir) => {
      const fullPath = path.join(wsPath, dir);
      return fullPath;
    });
  return dirs;
};
