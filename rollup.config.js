import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import alias from "@rollup/plugin-alias";

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/connector.ts',
	output: [
		{
			sourcemap: true,
			format: 'umd', //'iife',
			file: 'dist/essentialsiabconnector.js',
			//inlineDynamicImports: true
		},
	],
	external: [
		"@elastosfoundation/elastos-connectivity-sdk-js",
		"@elastosfoundation/did-js-sdk", // Can't be packaged, otherwise conflicts with DID SDKs used by running apps. "DID" classes are then different and fail to compare with "instanceof"
		/* "@elastosfoundation/did-js-sdk",
		"moment",
		"rxjs" */
	],
	plugins: [
		alias({
			"entries": [
				{ "find": "buffer", "replacement": "node_modules/buffer/index.js" },
				{ "find": "stream", "replacement": "node_modules/stream/index.js" },
				{ "find": "events", "replacement": "node_modules/events/events.js" }
			]
		}),
		resolve({
			browser: true,
			preferBuiltins: false,
			dedupe: [''],
			exportConditions: ['browser'] // Make sure to search for "browser" in "exports" fields of dependencies package.json
		}),
		commonjs(),
		typescript({
			declaration: false,
			sourceMap: true,
			inlineSources: !production
		}),
		copy({
			targets: [
				{
					src: 'dist/essentialsiabconnector.js',
					dest: '../../App/src/assets/'
				}
			]
		})

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		//production && terser(),
	],
	watch: {
		clearScreen: true
	}
};