dev:
  deno run --allow-env --allow-net --allow-read --allow-write --watch server.ts

lint:
  deno lint --ignore=docs/_site

format:
  deno fmt --ignore=docs/_site --ignore=*.md

serve:
  deno serve --allow-env --allow-net --parallel server.ts

serve-docs:
  cd docs && deno task serve
