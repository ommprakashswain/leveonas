export interface CompilationOptions {
  strictMode?: boolean;
  debugMode?: boolean;
  prettyHtml?: boolean;
  minifyHtml?: boolean;
  generatePatches?: boolean;
  stopOnError?: boolean;
  collectDiagnostics?: boolean;
}
