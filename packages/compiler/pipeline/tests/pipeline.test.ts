import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CompilerPipeline } from '../pipeline';
import { ASTNodeKind } from '../../ast/types';

describe('CompilerPipeline', () => {
  it('should compile source to HTML and generate patches', () => {
    const pipeline = new CompilerPipeline();
    
    const source = `
      Page [title:"Home"] {
        Section {
          HeroTitle "Welcome to Leveonas"
        }
      }
    `;
    
    const result = pipeline.compile(source);
    
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.diagnostics.filter(d => d.severity === 'error').length, 0);
    assert.notStrictEqual(result.ast, null);
    assert.strictEqual(result.ast!.kind, ASTNodeKind.Root);
    assert.match(result.html, /Welcome to Leveonas/);
    assert.ok(result.patches.length > 0);
  });
  
  it('should generate patches between two compiles', () => {
    const pipeline = new CompilerPipeline();
    
    const source1 = `
      Page [title:"Home"] {
        Section {
          HeroTitle "Welcome to Leveonas"
        }
      }
    `;
    
    pipeline.compile(source1);
    
    const source2 = `
      Page [title:"Home"] {
        Section {
          HeroTitle "Welcome to Leveonas v2"
        }
      }
    `;
    
    const result2 = pipeline.compile(source2);
    
    assert.strictEqual(result2.success, true);
    assert.match(result2.html, /Welcome to Leveonas v2/);
    assert.ok(result2.patches.length > 0);
  });
});
