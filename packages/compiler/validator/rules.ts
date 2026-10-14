import { ValidationRule } from './types';
import { ValidationContext } from './context';
import { ASTWalker } from '../ast/walker';
import { ASTNodeKind } from '../ast/types';
import { ComponentNode, GenericComponentNode } from '../ast/nodes';
import { createComponentVisitor } from './visitors';

export const HierarchyRule: ValidationRule = {
  name: 'HierarchyRule',
  validate(context: ValidationContext) {
    ASTWalker.walk(context.rootNode, {
      visitPage(node) {
        if (node.parent && node.parent.kind !== ASTNodeKind.Root) {
          context.reportError(
            'V_HIERARCHY_001',
            'Page component must be a direct child of Root',
            node.sourceLocation,
            'Move the Page component to the root level'
          );
        }
      },
      visitSection(node) {
        if (node.parent && node.parent.kind !== ASTNodeKind.Page && node.parent.kind !== ASTNodeKind.Root) {
          context.reportError(
            'V_HIERARCHY_002',
            'Section component should typically be a child of Page or Root',
            node.sourceLocation,
            'Consider moving the Section component'
          );
        }
      }
    });
  }
};

export const DuplicatePropertyRule: ValidationRule = {
  name: 'DuplicatePropertyRule',
  validate(context: ValidationContext) {
    ASTWalker.walk(context.rootNode, createComponentVisitor((node: ComponentNode) => {
      const propNames = new Set<string>();
      for (const prop of node.properties || []) {
        if (propNames.has(prop.name)) {
          context.reportError(
            'V_PROP_001',
            `Duplicate property '${prop.name}' found on component '${node.kind}'`,
            prop.sourceLocation,
            `Remove the duplicate '${prop.name}' property`
          );
        }
        propNames.add(prop.name);
      }
    }));
  }
};

export const UnknownComponentRule: ValidationRule = {
  name: 'UnknownComponentRule',
  validate(context: ValidationContext) {
    ASTWalker.walk(context.rootNode, {
      visitGenericComponent(node: GenericComponentNode) {
        context.reportError(
          'V_COMP_001',
          `Unknown component '${node.name}'`,
          node.sourceLocation,
          `Ensure '${node.name}' is a supported standard component`
        );
      }
    });
  }
};

// Add some schema based validations (Types, Enums, Required props, etc.)
const ComponentSchema: Record<string, { required?: string[], props?: Record<string, string | string[]> }> = {
  [ASTNodeKind.Page]: {
    props: {
      theme: ['light', 'dark', 'system'],
      title: 'string'
    }
  },
  [ASTNodeKind.Button]: {
    props: {
      primary: 'boolean',
      size: ['sm', 'md', 'lg'],
      label: 'string'
    }
  },
  [ASTNodeKind.Image]: {
    required: ['src'],
    props: {
      src: 'string',
      alt: 'string'
    }
  }
};

export const SchemaValidationRule: ValidationRule = {
  name: 'SchemaValidationRule',
  validate(context: ValidationContext) {
    ASTWalker.walk(context.rootNode, createComponentVisitor((node: ComponentNode) => {
      const schema = ComponentSchema[node.kind];
      if (!schema) return;

      const propNames = new Set((node.properties || []).map(p => p.name));

      // Check required
      for (const req of schema.required || []) {
        if (!propNames.has(req)) {
          context.reportError(
            'V_SCHEMA_001',
            `Missing required property '${req}' on '${node.kind}' component`,
            node.sourceLocation,
            `Add the '${req}' property`
          );
        }
      }

      // Check types and enums
      for (const prop of node.properties || []) {
        const expected = schema.props?.[prop.name];
        if (expected) {
          const value = prop.value?.value;
          if (Array.isArray(expected)) {
            // Enum
            if (value !== undefined && !expected.includes(String(value))) {
              context.reportError(
                'V_SCHEMA_002',
                `Invalid enum value '${value}' for property '${prop.name}'. Expected one of: ${expected.join(', ')}`,
                prop.sourceLocation,
                `Change to a valid enum value`
              );
            }
          } else if (typeof expected === 'string') {
            // Basic type
            if (value !== undefined && typeof value !== expected) {
              context.reportError(
                'V_SCHEMA_003',
                `Invalid type for property '${prop.name}'. Expected ${expected}, got ${typeof value}`,
                prop.sourceLocation,
                `Change value to ${expected}`
              );
            }
          }
        } else {
          // Unknown property
          context.reportWarning(
            'V_SCHEMA_004',
            `Unknown property '${prop.name}' on '${node.kind}' component`,
            prop.sourceLocation,
            `Verify property name or remove it`
          );
        }
      }
    }));
  }
};

export const InvalidNestingRule: ValidationRule = {
  name: 'InvalidNestingRule',
  validate(context: ValidationContext) {
    ASTWalker.walk(context.rootNode, createComponentVisitor((node: ComponentNode) => {
      // Example: A Button should not contain interactive elements like Input or Form
      if (node.kind === ASTNodeKind.Button) {
        for (const child of node.children) {
          if (child.kind === ASTNodeKind.Input || child.kind === ASTNodeKind.Form || child.kind === ASTNodeKind.Button) {
            context.reportError(
              'V_NEST_001',
              `Component '${child.kind}' cannot be a child of '${node.kind}'`,
              child.sourceLocation,
              `Remove or move the '${child.kind}' component`
            );
          }
        }
      }
    }));
  }
};

export const ResponsiveRule: ValidationRule = {
  name: 'ResponsiveRule',
  validate(context: ValidationContext) {
    ASTWalker.walk(context.rootNode, createComponentVisitor((node: ComponentNode) => {
      // E.g., any property that ends with -sm, -md, -lg, -xl should be checked against valid breakpoints
      // Or maybe a 'display' prop that allows responsive syntax like 'flex:md block:sm'
      for (const prop of node.properties || []) {
        if (prop.name === 'responsive') {
          if (typeof prop.value?.value === 'string' && !prop.value.value.match(/^(sm|md|lg|xl)\s*:/)) {
            context.reportError(
              'V_RESP_001',
              `Invalid responsive definition in '${prop.name}'. Expected format like 'md:flex'`,
              prop.sourceLocation,
              `Fix the responsive syntax`
            );
          }
        }
      }
    }));
  }
};

export const AnimationRule: ValidationRule = {
  name: 'AnimationRule',
  validate(context: ValidationContext) {
    ASTWalker.walk(context.rootNode, createComponentVisitor((node: ComponentNode) => {
      for (const prop of node.properties || []) {
        if (prop.name === 'animation') {
          const allowedAnimations = ['fade', 'slide', 'zoom', 'bounce'];
          if (typeof prop.value?.value === 'string' && !allowedAnimations.includes(prop.value.value)) {
            context.reportError(
              'V_ANIM_001',
              `Invalid animation '${prop.value.value}'. Expected one of: ${allowedAnimations.join(', ')}`,
              prop.sourceLocation,
              `Use a valid animation name`
            );
          }
        }
      }
    }));
  }
};

export const StandardRules = [
  HierarchyRule,
  DuplicatePropertyRule,
  UnknownComponentRule,
  SchemaValidationRule,
  InvalidNestingRule,
  ResponsiveRule,
  AnimationRule
];
