import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import viteBasicSslPlugin from '@vitejs/plugin-basic-ssl';
export default defineConfig({
	plugins: [sveltekit(), viteBasicSslPlugin()],
	server: {
		https: true, // same as "--https" flag
		host: true, // same as "--host" flag
	},
});
