export const LM_COMPONENTS = new Set([
  'Page', 'Section', 'Container', 'Stack', 'Row', 'Column', 'Grid', 'Center', 'Spacer', 'Divider', 'Surface',
  'Navbar', 'Sidebar', 'Breadcrumb', 'Menu', 'Dropdown', 'Tabs', 'Pagination', 'Footer',
  'HeroTitle', 'Heading', 'Subheading', 'Text', 'Caption', 'Code', 'Quote', 'Label', 'Link',
  'Form', 'Input', 'Textarea', 'Checkbox', 'Radio', 'Switch', 'Select', 'Slider', 'Button', 'SubmitButton', 'ResetButton',
  'Image', 'Video', 'Audio', 'Avatar', 'Icon', 'Logo', 'Illustration',
  'Alert', 'Toast', 'Badge', 'Progress', 'Spinner', 'Skeleton', 'Tooltip', 'Modal', 'Dialog',
  'Table', 'List', 'Card', 'Accordion', 'Timeline', 'Tree', 'Stat', 'Metric', 'Chart',
  'Search', 'CommandPalette', 'Carousel', 'Popover', 'Drawer', 'ContextMenu',
  'Chat', 'PromptInput', 'Message', 'Artifact', 'StreamingText', 'StreamingCode', 'StreamingPreview', 'ReasoningPanel', 'TokenCounter',
  'CodeBlock', 'Terminal', 'APIPlayground', 'FileTree', 'Console', 'Markdown', 'JSONViewer', 'DiffViewer',
  'TabList', 'TabPanels', 'Tab', 'Panel', 'MenuItem', 'AccordionItem', 'TimelineEvent', 'TreeNode', 'Cell', 'ListItem'
]);

export function isComponent(name: string): boolean {
  return LM_COMPONENTS.has(name);
}
