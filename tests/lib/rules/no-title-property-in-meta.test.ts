/**
 * @fileoverview No title property in meta
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { AST_NODE_TYPES } from '@typescript-eslint/types'
import dedent from 'ts-dedent'

import rule from '../../../lib/rules/no-title-property-in-meta'
import ruleTester from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('no-title-property-in-meta', rule, {
  valid: [
    'export default { component: Button }',
    'export default { component: Button } as ComponentMeta<typeof Button>',
  ],

  invalid: [
    {
      code: "export default { title: 'Button', component: Button }",
      errors: [
        {
          messageId: 'noTitleInMeta',
          type: AST_NODE_TYPES.Property,
          suggestions: [
            {
              messageId: 'removeTitleInMeta',
              output: 'export default {  component: Button }',
            },
          ],
        },
      ],
    },
    {
      code: dedent`
        const meta = { component: Button, title: 'Button' }
        export default meta
      `,
      errors: [
        {
          messageId: 'noTitleInMeta',
          type: AST_NODE_TYPES.Property,
          suggestions: [
            {
              messageId: 'removeTitleInMeta',
              output: dedent`
                const meta = { component: Button,  }
                export default meta
              `,
            },
          ],
        },
      ],
    },
  ],
})
