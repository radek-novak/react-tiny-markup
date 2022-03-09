import { parse } from '../parser';

test('attributes', () => {
  expect(parse('abc<a href="/url/path" target="_blank" class="hello motos"><b>tagtext</b></a>')).toEqual([
    { type: 'text', value: 'abc' },
    {
      type: 'tag',
      tagType: 'a',
      value: [
        {
          type: 'tag',
          tagType: 'b',
          value: [{ type: 'text', value: 'tagtext' }],
        }
      ],
      attributes: [
        {
          type: 'attribute',
          attributeName: 'href',
          value: '/url/path'
        },
        {
          type: 'attribute',
          attributeName: 'target',
          value: '_blank'
        },
        {
          type: 'attribute',
          attributeName: 'class',
          value: 'hello motos'
        },
      ]
    }
  ]);
});