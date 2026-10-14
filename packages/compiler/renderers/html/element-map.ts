import { ASTNodeKind } from '../../ast/types';

export const ElementMap: Record<string, string> = {
  [ASTNodeKind.Page]: 'main',
  [ASTNodeKind.Section]: 'section',
  [ASTNodeKind.Container]: 'div',
  [ASTNodeKind.Hero]: 'section',
  [ASTNodeKind.Button]: 'button',
  [ASTNodeKind.Input]: 'input',
  [ASTNodeKind.Text]: 'p',
  [ASTNodeKind.Image]: 'img',
  [ASTNodeKind.Form]: 'form',
  [ASTNodeKind.Grid]: 'div',
  [ASTNodeKind.Card]: 'article',
  'Navbar': 'nav',
  'Footer': 'footer',
  'Heading': 'h2', // Generic fallback
  'List': 'ul',
  'ListItem': 'li',
};

export const SelfClosingElements = new Set([
  'input',
  'img',
  'br',
  'hr',
  'meta',
  'link'
]);
