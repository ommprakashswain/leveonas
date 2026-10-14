import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { ASTBuilder } from '../../../ast/builder';
import { ASTNodeKind } from '../../../ast/types';
import { HtmlRenderer } from '../renderer';
import { RenderError } from '../errors';
import { escapeHtml } from '../escape';

describe('HTML Renderer', () => {
  test('should render a simple page', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Page)
      .enterComponent(ASTNodeKind.Section)
        .enterComponent(ASTNodeKind.Button)
          .addProperty('primary', true)
        .exitComponent()
      .exitComponent()
    .exitComponent();

    const renderer = new HtmlRenderer({ minify: true });
    const output = renderer.render(builder.getRoot());
    
    assert.strictEqual(output, '<main><section><button primary="true" type="button"></button></section></main>');
  });

  test('should render properties as escaped attributes and sort them', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Image)
      .addProperty('src', 'test.jpg')
      .addProperty('alt', 'Test & Image')
      .addProperty('data-value', 'some "value"')
    .exitComponent();

    const renderer = new HtmlRenderer({ minify: true });
    const output = renderer.render(builder.getRoot());
    
    assert.strictEqual(output, '<img alt="Test &amp; Image" data-value="some &quot;value&quot;" src="test.jpg" />');
  });

  test('should correctly indent nested structures', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Page)
      .enterComponent(ASTNodeKind.Section)
        .enterComponent(ASTNodeKind.Text)
        .exitComponent()
      .exitComponent()
    .exitComponent();

    const renderer = new HtmlRenderer({ indentSize: 2, minify: false });
    const output = renderer.render(builder.getRoot());
    
    const expected = 
`<main>
  <section>
    <p>
    </p>
  </section>
</main>`;
    assert.strictEqual(output, expected);
  });

  test('should escape text content', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Text)
      .addProperty('value', 'Hello <world> & "friends"') // assuming literal node for text is added differently?
    .exitComponent();

    const renderer = new HtmlRenderer({ minify: true });
    const output = renderer.render(builder.getRoot());
    
    assert.strictEqual(output, '<p value="Hello &lt;world&gt; &amp; &quot;friends&quot;"></p>');
  });

  test('should handle forms and generic components correctly', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Form)
      .addProperty('action', '/submit')
      .enterComponent(ASTNodeKind.GenericComponent, undefined, 'Navbar')
      .exitComponent()
    .exitComponent();

    const renderer = new HtmlRenderer({ minify: true });
    const output = renderer.render(builder.getRoot());
    
    assert.strictEqual(output, '<form action="/submit"><nav></nav></form>');
  });

  test('should fail if ast is null', () => {
    const renderer = new HtmlRenderer();
    assert.throws(() => {
      renderer.render(null as any);
    }, RenderError);
  });

  test('should correctly output literal nodes directly inside components', () => {
     // I will manually create a AST with literal children just in case it's how Text works
     const builder = new ASTBuilder();
     builder.enterComponent(ASTNodeKind.Text);
     const current = builder.getRoot().children[0] as any;
     current.children.push({
       kind: ASTNodeKind.Literal,
       value: 'Hello & welcome!',
       raw: 'Hello & welcome!'
     });
     
     const renderer = new HtmlRenderer({ minify: true });
     const output = renderer.render(builder.getRoot());
     assert.strictEqual(output, '<p>Hello &amp; welcome!</p>');
  });
});

describe('Escape utilities', () => {
  test('escapeHtml', () => {
    assert.strictEqual(escapeHtml('<a>&"\''), '&lt;a&gt;&amp;&quot;&#39;');
  });
});
