import esbuild from "esbuild";

esbuild.build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    platform: 'node',
    outfile: './dist/bundle.js',
    external: [], // Add external modules you don't want to include in the bundle
    // additional configuration options as needed
}).catch(() => process.exit(1));
