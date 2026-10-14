export const LM_ENUMS = new Set([
  // Sizes
  'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl',
  'full', 'auto', 'screen',
  
  // Variants / Themes / Colors
  'primary', 'secondary', 'accent', 'surface', 'background', 'foreground',
  'success', 'warning', 'danger', 'info', 'muted', 'ghost', 'outline', 'solid', 'soft',
  
  // Alignments / Justifications
  'start', 'center', 'end', 'between', 'around', 'evenly', 'stretch',
  'top', 'bottom', 'left', 'right',
  
  // Orientations
  'horizontal', 'vertical',
  
  // Types
  'text', 'password', 'email', 'number', 'tel', 'url', 'search', 'date', 'time',
  
  // Roles
  'user', 'assistant', 'system', 'model',

  // Animation/State
  'hover', 'focus', 'active', 'pulse', 'spin', 'bounce', 'fade'
]);

export function isEnum(name: string): boolean {
  return LM_ENUMS.has(name);
}
