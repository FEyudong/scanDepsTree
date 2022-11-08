#!/usr/bin/env node
import main from "../dist/esm/index.js";
import fs from "fs";

const deps = main(process.argv[2])

// const deps = main('playground/react-project/src/main.tsx');
// const deps = main('playground/vue-project/src/main.js');;
const cache = [];
fs.writeFileSync("./depTree.json", JSON.stringify(deps, function(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
            return;
        }
        cache.push(value);
    }
    return value;
}, 2));

