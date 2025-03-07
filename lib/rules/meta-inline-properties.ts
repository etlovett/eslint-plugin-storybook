/**
 * @fileoverview Meta should have inline properties
 * @author Yann Braga
 */

import { getMetaObjectExpression } from '../utils'
import { CategoryId } from '../utils/constants'
import { createStorybookRule } from '../utils/create-storybook-rule'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = createStorybookRule({
  name: 'meta-inline-properties',
  defaultOptions: [{ csfVersion: 3 }],
  meta: {
    type: 'problem',
    docs: {
      description: 'Meta should only have inline properties',
      categories: [CategoryId.CSF, CategoryId.RECOMMENDED],
      excludeFromConfig: true,
      recommended: 'error',
    },
    messages: {
      metaShouldHaveInlineProperties: 'Meta should only have inline properties: {{property}}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          csfVersion: {
            type: 'number',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context: any) {
    // variables should be defined here

    // In case we need to get options defined in the rule schema
    // const options = context.options[0] || {}
    // const csfVersion = options.csfVersion

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const isInline = (node: any) => {
      return (
        node.value.type === 'ObjectExpression' ||
        node.value.type === 'Literal' ||
        node.value.type === 'ArrayExpression'
      )
    }
    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ExportDefaultDeclaration(node: any) {
        const meta = getMetaObjectExpression(node, context)
        if (!meta) {
          return null
        }

        const ruleProperties = ['title', 'args']
        let dynamicProperties: any = []

        const metaNodes = meta.properties.filter((prop: any) =>
          //@ts-ignore
          ruleProperties.includes(prop.key.name)
        )

        metaNodes.forEach((metaNode: any) => {
          if (!isInline(metaNode)) {
            dynamicProperties.push(metaNode)
          }
        })

        if (dynamicProperties.length > 0) {
          //@ts-ignore
          dynamicProperties.forEach((propertyNode) => {
            context.report({
              node: propertyNode,
              messageId: 'metaShouldHaveInlineProperties',
              data: {
                property: propertyNode.key.name,
              },
            })
          })
        }
      },
    }
  },
})
