/**
 * Leveonas Phase 3 Benchmark Scenarios & Framework Configurations
 *
 * Defines 5 representative frontend application scenarios benchmarked across 5 frameworks:
 * - HTML
 * - React
 * - Vue
 * - Svelte
 * - Angular
 */

export type BenchmarkFramework = 'html' | 'react' | 'vue' | 'svelte' | 'angular';

export type BenchmarkScenarioId =
  | 'scenario_a'
  | 'scenario_b'
  | 'scenario_c'
  | 'scenario_d'
  | 'scenario_e';

export interface BenchmarkScenarioDefinition {
  id: BenchmarkScenarioId;
  name: string;
  category: string;
  description: string;
  expectedFunctionality: string[];
  prompts: Record<BenchmarkFramework, string>;
  defaultPrompt: string;
}

export const BENCHMARK_SCENARIOS: Record<BenchmarkScenarioId, BenchmarkScenarioDefinition> = {
  scenario_a: {
    id: 'scenario_a',
    name: 'Scenario A: Simple Landing Page',
    category: 'Marketing / Layout',
    description: 'Polished responsive landing page with navbar, hero, 3 feature cards, and footer.',
    expectedFunctionality: [
      'Responsive navigation bar with brand logo and navigation links',
      'Hero section with headline, subtext, and call-to-action buttons',
      'Three feature cards highlighting key product benefits with icons/titles',
      'Footer with copyright notice and navigation links',
    ],
    defaultPrompt:
      'Create a modern landing page for a fictional AI startup called NovaFlow. Include a navbar with logo and three links, a hero section with a large heading, description and two buttons, a three-card features section, and a footer. Make it polished, responsive, and visually impressive.',
    prompts: {
      html: 'Create a modern landing page for a fictional AI startup called NovaFlow using HTML. Include a navbar with logo and three links, a hero section with a large heading, description and two buttons, a three-card features section, and a footer. Make it polished, responsive, and visually impressive.',
      react:
        'Create a modern React landing page component for a fictional AI startup called NovaFlow. Include a navbar with logo and three links, a hero section with a large heading, description and two buttons, a three-card features section, and a footer. Structure as clean reusable components with responsive layout.',
      vue: 'Create a modern Vue landing page component for a fictional AI startup called NovaFlow. Include a navbar with logo and three links, a hero section with a large heading, description and two buttons, a three-card features section, and a footer. Structure with clean template and reactive state.',
      svelte:
        'Create a modern Svelte landing page component for a fictional AI startup called NovaFlow. Include a navbar with logo and three links, a hero section with a large heading, description and two buttons, a three-card features section, and a footer. Structure with declarative markup.',
      angular:
        'Create a modern Angular landing page component for a fictional AI startup called NovaFlow. Include a navbar with logo and three links, a hero section with a large heading, description and two buttons, a three-card features section, and a footer. Structure with standalone component and template bindings.',
    },
  },
  scenario_b: {
    id: 'scenario_b',
    name: 'Scenario B: Interactive Dashboard',
    category: 'Analytics / State Management',
    description: 'Analytics dashboard with metrics cards, time-range filters, derived statistics, and interactive controls.',
    expectedFunctionality: [
      'Top statistics cards showing revenue, active users, conversion rate, and bounce rate',
      'Time-range filter selector (24h, 7d, 30d, 90d) that updates state',
      'Derived metric calculations (e.g. average daily revenue = total / days, net growth)',
      'Visual chart placeholders / metric bars representing data trends',
      'Action buttons for export data, refresh stats, and toggle theme',
    ],
    defaultPrompt:
      'Create an interactive analytics dashboard. Include a header with timeframe filters (Today, 7 Days, 30 Days), 4 key metric cards with growth badges, a main chart placeholder section with data bars, and a table of recent transactions with status badges. Include state for selected timeframe and derived summary statistics.',
    prompts: {
      html: 'Create an interactive analytics dashboard in HTML/JS. Include a header with timeframe filters (Today, 7 Days, 30 Days), 4 key metric cards with growth badges, a chart placeholder section, and recent transactions table with status badges. Wire button click handlers to update active filter state.',
      react:
        'Create an interactive React analytics dashboard component. Use state for selected timeframe filter, computed/derived summary statistics (e.g. average value), 4 metric cards, a data chart placeholder, and interactive action buttons with state updates.',
      vue: 'Create an interactive Vue analytics dashboard component. Use reactive state for selected timeframe, computed properties for average and totals, 4 metric cards, a chart placeholder, and action buttons updating state.',
      svelte:
        'Create an interactive Svelte analytics dashboard component. Use state for selected timeframe filter, reactive declarations ($:) for computed summary metrics, 4 metric cards, a chart placeholder, and click handlers.',
      angular:
        'Create an interactive Angular analytics dashboard component. Use state/signal for selected timeframe, computed signal for derived statistics, 4 metric cards, chart visualizer, and event bindings for timeframe buttons.',
    },
  },
  scenario_c: {
    id: 'scenario_c',
    name: 'Scenario C: Todo Application',
    category: 'CRUD / List & Form Control',
    description: 'Complete Todo app with item addition, completion toggle, deletion, and active/completed filtering.',
    expectedFunctionality: [
      'Input form to add new todo items with enter-key and submit button',
      'Keyed list of todo items with completion checkboxes and delete buttons',
      'Stateful filter tabs (All, Active, Completed) filtering the visible list',
      'Derived remaining item counter (e.g. "3 items left")',
      'Clear completed action button enabled when completed items exist',
    ],
    defaultPrompt:
      'Create a complete Todo application. Include a text input with an "Add" button, a keyed list of todos with completion checkboxes and delete buttons, filter tabs (All, Active, Completed), and a counter showing remaining active items. Include full state management and two-way input binding.',
    prompts: {
      html: 'Create a complete Todo application in HTML/JS. Include an input field with Add button, a list of todo items with checkboxes and delete buttons, filter buttons (All, Active, Completed), and a counter of remaining items.',
      react:
        'Create a complete React Todo application component. Include state for todos list, new todo text input, and active filter. Include derived remaining count, add todo, toggle todo, delete todo, and filter tabs.',
      vue: 'Create a complete Vue Todo application component. Use reactive state for items list and new input, computed filteredItems and remainingCount, add, toggle, and remove handlers, and filter tabs.',
      svelte:
        'Create a complete Svelte Todo application component. Use state for todos and filter, reactive declaration ($:) for remaining count, two-way bind:value for input, keyed #each block, and filter tabs.',
      angular:
        'Create a complete Angular Todo application component. Use state for todos list and filter, computed for remaining count, [(ngModel)] two-way binding on input, @for keyed list with track by id, and event bindings.',
    },
  },
  scenario_d: {
    id: 'scenario_d',
    name: 'Scenario D: E-Commerce Product Page',
    category: 'E-Commerce / Dynamic Pricing',
    description: 'Interactive product catalog with item selection, quantity adjustment, derived subtotal & discount, and cart summary.',
    expectedFunctionality: [
      'Product grid with item cards showing thumbnail, title, price, and "Select" button',
      'Active product detail view with color/size selector and quantity stepper (+ / -)',
      'Derived pricing calculations: subtotal = price * quantity, tax, discount, and final total',
      'Add to cart action with order summary drawer / panel',
      'Dynamic style or class highlight on currently selected variant',
    ],
    defaultPrompt:
      'Create an e-commerce product detail & checkout widget. Include product selector with image, title, base price, and rating, quantity stepper (+/-), optional promo code input, and a live pricing summary calculating subtotal, 10% tax, discount, and total. Include state for selected item, quantity, and applied promo.',
    prompts: {
      html: 'Create an e-commerce product widget in HTML/JS. Include product info, quantity +/- buttons, promo code field, and live order summary displaying subtotal, tax, discount, and total updated on state changes.',
      react:
        'Create a React e-commerce product page component. Use state for selected product, quantity, and discount code. Include computed derived values for subtotal, tax, and grand total, quantity increment/decrement controls, and responsive layout.',
      vue: 'Create a Vue e-commerce product page component. Use reactive state for quantity and promo, computed properties for subtotal, discount, and total, quantity buttons, and product summary card.',
      svelte:
        'Create a Svelte e-commerce product page component. Use state for item quantity and selected option, reactive declarations ($:) for price calculations, quantity buttons, and cart summary.',
      angular:
        'Create an Angular e-commerce product page component. Use state/signals for product and quantity, computed for subtotal and grand total, event bindings for quantity +/- buttons, and style bindings for active selection.',
    },
  },
  scenario_e: {
    id: 'scenario_e',
    name: 'Scenario E: Complex Multi-Section App',
    category: 'Full Application / Architecture',
    description: 'Multi-component application with user profile, tab navigation, list management, modal dialogs, and dynamic styling.',
    expectedFunctionality: [
      'Top navigation header with user avatar, title, and notifications indicator',
      'Tab bar switching between multiple views (Overview, Settings, Team Members)',
      'Team members data table with role badges, status toggles, and delete actions',
      'Modal / dialog form for inviting a new team member with validation',
      'Dynamic theme / styling bindings with state-controlled active accents',
    ],
    defaultPrompt:
      'Create a complex multi-section SaaS project management app. Include a top bar with user profile, a tab bar (Overview, Team, Settings), a member list with role selection and status toggles, a conditional modal/form to invite members with validation, and dynamic status badge styling based on state.',
    prompts: {
      html: 'Create a complex SaaS workspace application in HTML/JS. Include navigation tabs, a member directory table with role toggles, a conditional modal form to add members, and dynamic status badges updated with interactive events.',
      react:
        'Create a complex multi-component React workspace app. Include state for active tab, members list, modal visibility, and form inputs. Include conditional rendering for modal, keyed list of members, derived member counts, and dynamic class/style bindings.',
      vue: 'Create a complex Vue workspace application component. Use state for active tab, team members, and modal state. Use computed stats, v-if / conditional rendering for modal, v-for keyed list, and dynamic classes for role badges.',
      svelte:
        'Create a complex Svelte workspace application component. Use state for active tab, members array, and modal show/hide. Use reactive declarations, conditional blocks, keyed #each list, and dynamic class/style directives.',
      angular:
        'Create a complex Angular workspace application component. Use state/signals for active tab, members list, and dialog visibility. Use computed for active member count, @if conditional modal, @for keyed list with track id, and [class.active] / [style.color] bindings.',
    },
  },
};

import { NORMAL_SYSTEM_INSTRUCTION, BASELINE_SYSTEM_INSTRUCTION } from './fixtures';

/**
 * Returns framework-specific normal system instructions.
 */
export function getNormalSystemInstruction(framework: BenchmarkFramework): string {
  switch (framework) {
    case 'react':
      return `You are an expert React developer. Write a clean, modern, fully-functional React component in TypeScript/TSX according to the user's prompt. Use functional components, React hooks (useState, useMemo), and clean JSX. Output valid code without unnecessary conversational text or markdown code fences.`;
    case 'vue':
      return `You are an expert Vue developer. Write a clean, modern Vue 3 Single File Component using <script setup> with TypeScript and reactive Composition API (ref, computed) according to the user's prompt. Output valid code without unnecessary conversational text or markdown code fences.`;
    case 'svelte':
      return `You are an expert Svelte developer. Write a clean, modern Svelte component with declarative script state, reactive declarations ($:), and Svelte template directives according to the user's prompt. Output valid code without unnecessary conversational text or markdown code fences.`;
    case 'angular':
      return `You are an expert Angular developer. Write a clean, modern Angular standalone component with signals, computed properties, and Angular template directives according to the user's prompt. Output valid code without unnecessary conversational text or markdown code fences.`;
    case 'html':
    default:
      return NORMAL_SYSTEM_INSTRUCTION;
  }
}

/**
 * Returns framework-specific Leveonas LM system instructions.
 */
export function getLeveonasSystemInstruction(framework: BenchmarkFramework): string {
  switch (framework) {
    case 'react':
      return `You are a software developer who writes code using Leveonas React Markup (React-LM), a token-efficient declarative component representation.
Enclose React-LM components in the <REACT> ... </REACT> block.
Syntax rules:
1. component(Name)(state(name, initialVal) computed(name, expr) di(...))
2. Intrinsic tags use canonical LM abbreviations: di (div), bo (button), he (header), fe (footer), sa (span), pa (p), iu (input), etc.
3. Event handlers: click:increment or click:"count += 1"
4. Output ONLY pure React-LM without markdown code fences or conversational text.`;
    case 'vue':
      return `You are a software developer who writes code using Leveonas Vue Markup (Vue-LM), a token-efficient declarative component representation.
Enclose Vue-LM components in the <VUE> ... </VUE> block.
Syntax rules:
1. component(Name)(state(name, initialVal) computed(name, expr) di(...))
2. Intrinsic tags use canonical LM abbreviations: di (div), bo (button), he (header), fe (footer), sa (span), pa (p), iu (input), etc.
3. Event handlers: @click:increment or @click:"count += 1"
4. Mustache interpolation: {{varName}}
5. Output ONLY pure Vue-LM without markdown code fences or conversational text.`;
    case 'svelte':
      return `You are a software developer who writes code using Leveonas Svelte Markup (Svelte-LM), a token-efficient declarative component representation.
Enclose Svelte-LM components in the <SVELTE> ... </SVELTE> block.
Syntax rules:
1. component(Name)(state(name, initialVal) reactive(name, expr) di(...))
2. Intrinsic tags use canonical LM abbreviations: di (div), bo (button), he (header), fe (footer), sa (span), pa (p), iu (input), etc.
3. Event handlers: on:click:increment or on:click:"count += 1"
4. Directives: class:active:isActive, bind:value:username
5. Output ONLY pure Svelte-LM without markdown code fences or conversational text.`;
    case 'angular':
      return `You are a software developer who writes code using Leveonas Angular Markup (Angular-LM), a token-efficient declarative component representation.
Enclose Angular-LM components in the <ANGULAR> ... </ANGULAR> block.
Syntax rules:
1. component(Name)(state(name, initialVal) computed(name, expr) di(...))
2. Intrinsic tags use canonical LM abbreviations: di (div), bo (button), he (header), fe (footer), sa (span), pa (p), iu (input), etc.
3. Event bindings: (click):increment, property bindings: [value]:expr, style bindings: [style.color]:bgColor, class bindings: [class.active]:isActive
4. Mustache interpolation: {{varName}}
5. Output ONLY pure Angular-LM without markdown code fences or conversational text.`;
    case 'html':
    default:
      return BASELINE_SYSTEM_INSTRUCTION;
  }
}
