import { build } from "https://deno.land/x/dnt/mod.ts";

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  test: false,
  package: {
    // package.json properties
    name: "monkfish",
    version: Deno.args[0],
    description: "A Chess Engine in Typescript",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/m-sallam/monkfish.git",
    },
    bugs: {
      url: "https://github.com/m-sallam/monkfish/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
