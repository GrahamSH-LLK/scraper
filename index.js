import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import crypto from "crypto";
import pages from "./pages.js";
import { writeFile, readFile } from "fs/promises";
let hashes;
try {
  hashes = JSON.parse(await readFile("data.json"));
} catch {
  hashes = {};
}
for (let page of pages) {
  let res = await fetch(page.url);
  let data = await res.text();
  let parser = new JSDOM(data);
  let object = parser.window.document.querySelector(page.selector);
  const hash = crypto.createHash("md5").update(object.innerHTML).digest("hex");
  if (hashes[page.name] != hash) {
    console.log(`${page.name} Updated`);
  }
  hashes[page.name] = hash;
}
await writeFile("data.json", JSON.stringify(hashes));
