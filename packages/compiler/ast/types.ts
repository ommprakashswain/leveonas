export interface SourceLocation {
  startLine: number;
  startColumn: number;
  startOffset: number;
  endLine: number;
  endColumn: number;
  endOffset: number;
}

export enum ASTNodeKind {
  Root = 'Root',
  Page = 'Page',
  Section = 'Section',
  Container = 'Container',
  Hero = 'Hero',
  Button = 'Button',
  Input = 'Input',
  Text = 'Text',
  Image = 'Image',
  Form = 'Form',
  Grid = 'Grid',
  Card = 'Card',
  GenericComponent = 'GenericComponent',
  Property = 'Property',
  Literal = 'Literal'
}

export interface NodeMetadata {
  [key: string]: any;
}
