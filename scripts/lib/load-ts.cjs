/* Loads repository TypeScript sources for offline node tests and verifiers.
 * Relative imports resolve to sibling `.ts` files; anything else uses
 * `require` (or an explicit override). Path aliases such as `@/` are not
 * supported, so shared data and server modules use relative imports only. */
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.resolve(__dirname, "../..");
const cache = new Map();

function loadSource(file, overrides = {}) {
  const cacheable = !Object.keys(overrides).length;
  if (cacheable && cache.has(file)) return cache.get(file);
  const code = ts.transpileModule(
    fs.readFileSync(path.join(root, file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  const module = { exports: {} };
  const sourceRequire = (id) => {
    if (id in overrides) return overrides[id];
    if (id.startsWith("."))
      return loadSource(path.join(path.dirname(file), `${id}.ts`));
    return require(id);
  };
  new Function("require", "module", "exports", code)(
    sourceRequire,
    module,
    module.exports,
  );
  if (cacheable) cache.set(file, module.exports);
  return module.exports;
}

module.exports = { loadSource, root };
