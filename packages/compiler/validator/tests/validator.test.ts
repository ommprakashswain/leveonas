import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { ASTBuilder } from '../../ast/builder';
import { ASTNodeKind } from '../../ast/types';
import { SemanticValidator } from '../validator';
import { DiagnosticSeverity } from '../types';

describe('Semantic Validator', () => {
  test('should pass a valid AST', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Page)
      .addProperty('theme', 'dark')
      .enterComponent(ASTNodeKind.Section)
        .enterComponent(ASTNodeKind.Button)
          .addProperty('primary', true)
          .addProperty('size', 'md')
        .exitComponent()
        .enterComponent(ASTNodeKind.Image)
          .addProperty('src', 'https://example.com/img.jpg')
          .addProperty('alt', 'An image')
        .exitComponent()
      .exitComponent()
    .exitComponent();

    const root = builder.getRoot();
    const validator = new SemanticValidator();
    const diagnostics = validator.validate(root);

    assert.strictEqual(diagnostics.length, 0);
  });

  test('should detect missing required properties', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Image)
      .addProperty('alt', 'No src property')
    .exitComponent();

    const root = builder.getRoot();
    const validator = new SemanticValidator();
    const diagnostics = validator.validate(root);

    const errors = diagnostics.filter(d => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].code, 'V_SCHEMA_001');
    assert.ok(errors[0].message.includes("Missing required property 'src'"));
  });

  test('should detect invalid type', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Button)
      .addProperty('primary', 'yes') // should be boolean
    .exitComponent();

    const root = builder.getRoot();
    const validator = new SemanticValidator();
    const diagnostics = validator.validate(root);

    const errors = diagnostics.filter(d => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].code, 'V_SCHEMA_003');
    assert.ok(errors[0].message.includes("Invalid type"));
  });

  test('should detect invalid enum value', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Button)
      .addProperty('size', 'xl') // allowed: sm, md, lg
    .exitComponent();

    const root = builder.getRoot();
    const validator = new SemanticValidator();
    const diagnostics = validator.validate(root);

    const errors = diagnostics.filter(d => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].code, 'V_SCHEMA_002');
    assert.ok(errors[0].message.includes("Invalid enum value"));
  });

  test('should detect duplicate properties', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Page)
      .addProperty('theme', 'dark')
      .addProperty('theme', 'light')
    .exitComponent();

    const root = builder.getRoot();
    const validator = new SemanticValidator();
    const diagnostics = validator.validate(root);

    const errors = diagnostics.filter(d => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].code, 'V_PROP_001');
    assert.ok(errors[0].message.includes("Duplicate property 'theme'"));
  });

  test('should detect unknown components', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.GenericComponent, undefined, 'MyCustomTab')
    .exitComponent();

    const root = builder.getRoot();
    const validator = new SemanticValidator();
    const diagnostics = validator.validate(root);

    const errors = diagnostics.filter(d => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].code, 'V_COMP_001');
    assert.ok(errors[0].message.includes("Unknown component 'MyCustomTab'"));
  });

  test('should detect hierarchy issues', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Section)
      .enterComponent(ASTNodeKind.Page) // Page should be root
      .exitComponent()
    .exitComponent();

    const root = builder.getRoot();
    const validator = new SemanticValidator();
    const diagnostics = validator.validate(root);

    const errors = diagnostics.filter(d => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].code, 'V_HIERARCHY_001');
    assert.ok(errors[0].message.includes("Page component must be a direct child of Root"));
  });
  
  test('should report warning for unknown property', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Button)
      .addProperty('unknownProp', 'value')
    .exitComponent();

    const root = builder.getRoot();
    const validator = new SemanticValidator();
    const diagnostics = validator.validate(root);

    const warnings = diagnostics.filter(d => d.severity === DiagnosticSeverity.Warning);
    assert.strictEqual(warnings.length, 1);
    assert.strictEqual(warnings[0].code, 'V_SCHEMA_004');
    assert.ok(warnings[0].message.includes("Unknown property 'unknownProp'"));
  });

  test('should detect invalid nesting', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Button)
      .enterComponent(ASTNodeKind.Input).exitComponent()
    .exitComponent();

    const root = builder.getRoot();
    const validator = new SemanticValidator();
    const diagnostics = validator.validate(root);

    const errors = diagnostics.filter(d => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].code, 'V_NEST_001');
    assert.ok(errors[0].message.includes("cannot be a child of"));
  });

  test('should detect invalid responsive definition', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Container)
      .addProperty('responsive', 'flex') // missing breakpoint prefix
    .exitComponent();

    const root = builder.getRoot();
    const validator = new SemanticValidator();
    const diagnostics = validator.validate(root);

    const errors = diagnostics.filter(d => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].code, 'V_RESP_001');
    assert.ok(errors[0].message.includes("Invalid responsive definition"));
  });

  test('should detect invalid animation', () => {
    const builder = new ASTBuilder();
    builder.enterComponent(ASTNodeKind.Container)
      .addProperty('animation', 'spin') // not in allowed list
    .exitComponent();

    const root = builder.getRoot();
    const validator = new SemanticValidator();
    const diagnostics = validator.validate(root);

    const errors = diagnostics.filter(d => d.severity === DiagnosticSeverity.Error);
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].code, 'V_ANIM_001');
    assert.ok(errors[0].message.includes("Invalid animation"));
  });
});
