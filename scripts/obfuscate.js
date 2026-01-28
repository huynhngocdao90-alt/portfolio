import fs from "fs";
import path from "path";
import JavaScriptObfuscator from "javascript-obfuscator";

const distDir = path.resolve("dist");

function walk(dir) {
    return fs.readdirSync(dir).flatMap((file) => {
        const full = path.join(dir, file);
        return fs.statSync(full).isDirectory()
            ? walk(full)
            : full.endsWith(".js")
            ? [full]
            : [];
    });
}

for (const file of walk(distDir)) {
    const code = fs.readFileSync(file, "utf8");

    const result = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        stringArray: true,
        stringArrayEncoding: ["base64"],
        stringArrayThreshold: 0.75,
        renameGlobals: false, // DO NOT set true for Vite output
    });

    fs.writeFileSync(file, result.getObfuscatedCode());
}

console.log("✔ JS obfuscation done");
