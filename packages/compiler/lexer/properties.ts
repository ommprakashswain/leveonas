export const LM_PROPERTIES = new Set([
  'id', 'class', 'pad', 'px', 'py', 'pt', 'pb', 'pl', 'pr',
  'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr', 'gap',
  'theme', 'variant', 'size', 'state', 'hidden', 'disabled', 'loading', 'responsive', 'animation',
  'width', 'center', 'align', 'justify', 'cols', 'rows', 'flex', 'vertical',
  'color', 'thickness', 'shadow', 'radius', 'bg', 'sticky', 'transparent', 'collapsible',
  'separator', 'orientation', 'trigger', 'page', 'total', 'onChange',
  'level', 'cite', 'for', 'href', 'external', 'type', 'placeholder', 'bind', 'label', 'group', 'options', 'min', 'max',
  'src', 'alt', 'objectFit', 'autoPlay', 'loop', 'controls', 'fallback', 'name', 'duration',
  'value', 'content', 'position', 'open', 'onClose', 'striped', 'border', 'multiple', 'selectable', 'trend', 'format', 'data',
  'query', 'actions', 'history', 'role', 'ast', 'lang', 'lines', 'endpoint', 'files', 'logs', 'old', 'new'
]);

export function isProperty(name: string): boolean {
  return LM_PROPERTIES.has(name);
}
