'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {WrappedDeployTool} from '@/sanity/ui/ToolMenuWithDeployTool'
import {apiVersion, dataset, projectId} from './src/lib'
import {schema} from './src/sanity/schemaTypes'
import structure from './src/sanity/lib/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
    presentationTool({
      title: 'Editor',
      previewUrl: {
        previewMode: {
          enable: `/api/draft-mode/enable`,
        },
      },
    }),
  ],
  studio: {
    components: {
      toolMenu: WrappedDeployTool(),
    },
  },
})
