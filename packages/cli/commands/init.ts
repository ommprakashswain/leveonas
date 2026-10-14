/**
 * Leveonas Project Initializer Command
 *
 * Scaffolds a minimal, working Leveonas project:
 * - leveonas.config.json
 * - app.lm
 * - README.md
 */

import * as fs from 'fs';
import * as path from 'path';

export interface InitCommandOptions {
  directory?: string;
  template?: 'html' | 'react' | 'vue' | 'svelte' | 'angular';
  force?: boolean;
  quiet?: boolean;
}

export interface InitResult {
  success: boolean;
  filesCreated: string[];
  error?: string;
}

export const STARTER_TEMPLATES: Record<string, { config: object; lm: string; readme: string }> = {
  html: {
    config: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      runtime: {
        fallbackOnError: true,
        isolateCss: true,
      },
      security: {
        strictAttributeValidation: true,
        blockDangerousUrls: true,
      },
    },
    lm: `(di cs:"min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8"
  (ca cs:"max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4"
    (he cs:"text-2xl font-bold text-white tracking-tight" "Welcome to Leveonas")
    (pa cs:"text-sm text-slate-400 leading-relaxed" "High-performance streaming frontend engine rendering real-time UI patches.")
    (bu cs:"w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors" "Get Started")
  )
)
`,
    readme: `# Leveonas HTML-LM Project

This is a minimal Leveonas frontend project rendered progressively using high-performance streaming DOM patches.

## Commands

- **Check syntax & reactivity**:
  \`\`\`bash
  npx leveonas check app.lm
  \`\`\`

- **Compile to Common UI IR**:
  \`\`\`bash
  npx leveonas compile app.lm
  \`\`\`

- **Format code**:
  \`\`\`bash
  npx leveonas format --write app.lm
  \`\`\`

- **Security Audit**:
  \`\`\`bash
  npx leveonas audit app.lm
  \`\`\`
`,
  },
  react: {
    config: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
    },
    lm: `(lm:react
  (state count: 0)
  (computed doubleCount: (* count 2))
  (di cs:"min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6"
    (ca cs:"bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 text-center"
      (he cs:"text-xl font-semibold" "React-LM Interactive Counter")
      (pa cs:"text-slate-400" "Current count: " count " (Double: " doubleCount ")")
      (bu cs:"px-4 py-2 bg-blue-600 rounded-lg" oc:(fn () (set count (+ count 1))) "Increment")
    )
  )
)
`,
    readme: `# Leveonas React-LM Project

An interactive reactive component compiled to Common UI IR and rendered with sub-millisecond DOM patches.
`,
  },
  vue: {
    config: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
    },
    lm: `(lm:vue
  (state message: "Hello from Vue-LM" active: true)
  (di cs:"min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6"
    (ca cs:"bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-3"
      (he cs:"text-lg font-medium" message)
      (pa cs:"text-zinc-400 text-sm" "Reactive Vue-LM component powered by Leveonas.")
    )
  )
)
`,
    readme: `# Leveonas Vue-LM Project
`,
  },
  svelte: {
    config: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
    },
    lm: `(lm:svelte
  (state score: 100)
  (di cs:"min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6"
    (ca cs:"bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-3"
      (he cs:"text-xl font-bold text-amber-400" "Svelte-LM Project")
      (pa cs:"text-neutral-400" "Score: " score)
    )
  )
)
`,
    readme: `# Leveonas Svelte-LM Project
`,
  },
  angular: {
    config: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
    },
    lm: `(lm:angular
  (state title: "Angular-LM Architecture")
  (di cs:"min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6"
    (ca cs:"bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3"
      (he cs:"text-xl font-bold text-red-500" title)
      (pa cs:"text-slate-400" "Enterprise streaming component with Common UI IR.")
    )
  )
)
`,
    readme: `# Leveonas Angular-LM Project
`,
  },
};

export function runInitCommand(options: InitCommandOptions = {}): InitResult {
  const targetDir = options.directory || process.cwd();
  const templateKey = options.template || 'html';
  const template = STARTER_TEMPLATES[templateKey] || STARTER_TEMPLATES.html;
  const filesCreated: string[] = [];

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const configPath = path.join(targetDir, 'leveonas.config.json');
    const lmPath = path.join(targetDir, 'app.lm');
    const readmePath = path.join(targetDir, 'README.md');

    if (fs.existsSync(configPath) && !options.force) {
      return {
        success: false,
        filesCreated: [],
        error: 'Project already contains leveonas.config.json. Use --force to overwrite.',
      };
    }

    fs.writeFileSync(configPath, JSON.stringify(template.config, null, 2) + '\n');
    filesCreated.push(configPath);

    fs.writeFileSync(lmPath, template.lm);
    filesCreated.push(lmPath);

    fs.writeFileSync(readmePath, template.readme);
    filesCreated.push(readmePath);

    if (!options.quiet) {
      console.log(`\n✨ Initialized new Leveonas project (${templateKey}) in ${targetDir}`);
      console.log('Created:');
      filesCreated.forEach((f) => console.log(`  - ${path.basename(f)}`));
      console.log('\nNext steps:');
      console.log('  npx leveonas check app.lm');
      console.log('  npx leveonas compile app.lm\n');
    }

    return {
      success: true,
      filesCreated,
    };
  } catch (err: any) {
    return {
      success: false,
      filesCreated,
      error: err.message,
    };
  }
}
