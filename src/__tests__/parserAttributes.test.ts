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
          attributes: []
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

test('full urls', () => {
  expect(parse('abc<a href="https://abc.de/ab/cd?p1=a&p2=b4#top">url</a>test')).toEqual([
    { type: 'text', value: 'abc' },
    {
      type: 'tag',
      tagType: 'a',
      value: [{ type: 'text', value: 'url' }],
      attributes: [
        {
          type: 'attribute',
          attributeName: 'href',
          value: 'https://abc.de/ab/cd?p1=a&p2=b4#top'
        },
      ]
    },
    { type: 'text', value: 'test' },
  ]);
});

test('self-closing tags and no content/boolean attributes', () => {
  expect(parse('abc<input autofocus class="" disabled/>test')).toEqual([
    { type: 'text', value: 'abc' },
    {
      type: 'tag',
      tagType: 'input',
      value: null,
      attributes: [
        {
          type: 'attribute',
          attributeName: 'autofocus',
          value: true
        },
        {
          type: 'attribute',
          attributeName: 'class',
          value: ''
        },
        {
          type: 'attribute',
          attributeName: 'disabled',
          value: true
        },
      ]
    },
    { type: 'text', value: 'test' },
  ]);
});