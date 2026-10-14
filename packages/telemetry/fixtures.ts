/**
 * Standard live-test prompt for deterministic telemetry measurement.
 * Used for comparing normal frontend generation vs Leveonas LM generation.
 */
export const STANDARD_TEST_PROMPT =
  'Create a modern landing page for a fictional AI startup called NovaFlow. Include a navbar with logo and three links, a hero section with a large heading, description and two buttons, a three-card features section, and a footer. Make it polished, responsive, and visually impressive.';

/**
 * Standard Normal coding system instruction used in A/B benchmarks.
 * Instructs the model to generate standard frontend code (HTML, CSS, JavaScript).
 */
export const NORMAL_SYSTEM_INSTRUCTION = `You are a frontend web developer. Generate clean, modern, responsive HTML, CSS, and JavaScript according to the user's prompt. Output valid code without unnecessary conversational text or markdown code fences.`;

/**
 * Baseline Leveonas System Instruction used across live generation benchmarks.
 * Preserves the baseline measurement for system instruction cost (character/byte length).
 */
export const BASELINE_SYSTEM_INSTRUCTION = `You are a software developer who writes code using Leveonas Markup (LM), a universal frontend intermediate representation and compression format.

LM represents frontend UI structures in a compact, stream-native intermediate representation while strictly preserving document structure, styles, and logic. (The current executable runtime interprets <HTML> markup into incremental DOM patches).

Rules:
1. Output ONLY pure Leveonas Markup. No markdown code fences (\`\`\`), no conversational text, no ambient explanations.
2. For markup-like structures, use Python-style nested parentheses instead of verbose opening and closing tags.
3. For element/tag and attribute names when compressing, apply the deterministic abbreviation rule ONLY to the canonical LM vocabulary (e.g., div->di, button->bo, section->so, article->al, aside->ad, header->he, footer->fe, nav->na, main->mi, span->sa, input->iu, label->le, table->tl, canvas->cu, form->fr; class->cs, href->hr, id->id, src->sr, type->tp, placeholder->pe, name->nm, value->vu; onClick->oc, onChange->og, className->cm; h1-h6 stay unchanged). Any identifier not in this canonical vocabulary (custom components, unlisted attributes) MUST remain uncompressed. Never invent compressed forms.
4. Enclose HTML structures in the <HTML> ... </HTML> boundary block so the Leveonas streaming pipeline interprets the section. (CSS styles may optionally be enclosed in <CSS> ... </CSS>, and JS logic in <JS> ... </JS>).
5. Never invent unsupported syntax. Stream blocks sequentially in logical order and keep output incrementally interpretable.`;

export interface ModelMatrixEntry {
  provider: 'gemini' | 'grok' | 'openai' | 'anthropic';
  model: string;
  prompt: string;
  systemInstruction: string;
  maxTokens: number;
}

/**
 * Standard test matrix to run identical benchmarks across Gemini, Grok, and OpenAI.
 * Keeps prompt, system instruction, and max tokens identical across runs.
 */
export const STANDARD_MODEL_TEST_MATRIX: ModelMatrixEntry[] = [
  {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    prompt: STANDARD_TEST_PROMPT,
    systemInstruction: BASELINE_SYSTEM_INSTRUCTION,
    maxTokens: 4096,
  },
  {
    provider: 'grok',
    model: 'grok-2-latest',
    prompt: STANDARD_TEST_PROMPT,
    systemInstruction: BASELINE_SYSTEM_INSTRUCTION,
    maxTokens: 4096,
  },
  {
    provider: 'openai',
    model: 'gpt-4o',
    prompt: STANDARD_TEST_PROMPT,
    systemInstruction: BASELINE_SYSTEM_INSTRUCTION,
    maxTokens: 4096,
  },
];
