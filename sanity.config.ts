import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemas'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'i2lza03m'
const dataset = import.meta.env.VITE_SANITY_DATASET || 'shopdb'

export default defineConfig({
  name: 'sri-subhakari-fashions',
  title: 'Sri Subhakari Fashions Studio',
  basePath: '/studio',

  projectId,
  dataset,

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
})
