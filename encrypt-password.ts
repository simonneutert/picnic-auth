import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const yourPassword = Deno.args[0];
const hashedPassword = await bcrypt.hash(yourPassword);

console.log(`
Your encrypted password is:


${hashedPassword}


----------------------------------------------------------------`);
