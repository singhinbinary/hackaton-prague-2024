import { defineConfig } from '@wagmi/cli'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [],
  plugins: [],
})

// /** @type {import('@wagmi/cli').Config} */
// export default {
//   out: 'src/generated.js',
//   contracts: [],
//   plugins: [],
// }
