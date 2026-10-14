import { ASTNode } from '../../ast/nodes';
import { HtmlWriter } from './writer';
import { HtmlSerializer } from './serializer';
import { FormatterOptions } from './formatter';
import { RenderError } from './errors';

export interface HtmlRendererOptions extends FormatterOptions {}

export class HtmlRenderer {
  constructor(private options: HtmlRendererOptions = {}) {}

  render(ast: ASTNode): string {
    if (!ast) {
      throw new RenderError('Cannot render a null or undefined AST');
    }
    
    try {
      const writer = new HtmlWriter(this.options);
      const serializer = new HtmlSerializer(writer);
      
      serializer.serialize(ast);
      
      let output = writer.getOutput();
      
      if (!this.options.minify) {
        output = output.trim();
      }
      
      return output;
    } catch (e: any) {
      throw new RenderError(`Failed to render HTML: ${e.message}`);
    }
  }
}
