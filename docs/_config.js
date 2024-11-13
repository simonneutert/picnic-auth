import lume from "lume/mod.ts";
import lumocs from "lumocs/mod.ts";
import mermaid from "https://deno.land/x/lume_mermaid_plugin@v0.1/mod.ts";

const site = lume();
site.copy("img");

site.use(mermaid());
site.use(lumocs());

export default site;
