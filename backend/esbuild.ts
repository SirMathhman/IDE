import esbuild from 'esbuild';

esbuild.build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node16',
    outfile: './dist/index.js',
    sourcemap: true,
    external: ['express'] // List external packages here if any
}).catch(() => process.exit(1));
