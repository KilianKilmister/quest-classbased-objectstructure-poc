const TypeDoc = require('typedoc')

const app = new TypeDoc.Application()

// If you want TypeDoc to load tsconfig.json / typedoc.json files

app.bootstrap({
  mode: 'modules',
  logger: 'none',
  target: 'esnext',
  module: 'esm',
  experimentalDecorators: true
})

const project = app.convert(app.expandInputFiles(['lib']))

if (project) { // Project may not have converted correctly
  const outputDir = 'docs'

  // Rendered docs
  app.generateDocs(project, outputDir)
  // Alternatively generate JSON output
  app.generateJson(project, outputDir + '/documentation.json')
}
