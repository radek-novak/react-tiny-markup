import { parse } from '../parser';

test('self-closing', () => {
  expect(parse('<br />')).toEqual([
    { type: 'tag', tagType: 'br', value: null, attributes: [] }
  ]);

  expect(parse('<br /><br/>')).toEqual([
    { type: 'tag', tagType: 'br', value: null, attributes: [] },
    { type: 'tag', tagType: 'br', value: null, attributes: [] }
  ]);

  expect(parse('<div><br /> <br/></div>')).toEqual([
    {
      type: 'tag',
      tagType: 'div',
      value: [
        { type: 'tag', tagType: 'br', value: null, attributes: [] },
        { type: 'text', value: ' ' },
        { type: 'tag', tagType: 'br', value: null, attributes: [] }
      ],
      attributes: []
    }
  ]);

  expect(parse('<div><b><br /></b> <br/></div>')).toEqual([
    {
      type: 'tag',
      tagType: 'div',
      value: [
        {
          type: 'tag',
          tagType: 'b',
          value: [{ type: 'tag', tagType: 'br', value: null, attributes: [] }],
          attributes: []
        },
        { type: 'text', value: ' ' },
        { type: 'tag', tagType: 'br', value: null, attributes: [] }
      ],
      attributes: []
    }
  ]);
});

test('basic', () => {
  expect(parse('abc')).toEqual([{ type: 'text', value: 'abc' }]);

  expect(parse('abc<a>a</a>bc<a>de</a>')).toEqual([
    { type: 'text', value: 'abc' },
    {
      type: 'tag',
      tagType: 'a',
      value: [{ type: 'text', value: 'a' }],
      attributes: []
    },
    { type: 'text', value: 'bc' },
    {
      type: 'tag',
      tagType: 'a',
      value: [{ type: 'text', value: 'de' }],
      attributes: []
    }
  ]);
  expect(parse('abc<br />bc<a>de</a>')).toEqual([
    { type: 'text', value: 'abc' },
    { type: 'tag', tagType: 'br', value: null, attributes: [] },
    { type: 'text', value: 'bc' },
    {
      type: 'tag',
      tagType: 'a',
      value: [{ type: 'text', value: 'de' }],
      attributes: []
    }
  ]);

  expect(parse('abc<a><b>tagtext</b></a>')).toEqual([
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
      attributes: []
    }
  ]);

  expect(parse('abc<a><b>tagtext</b>behind</a>')).toEqual([
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
        },
        { type: 'text', value: 'behind' }
      ],
      attributes: []
    }
  ]);

  expect(parse('<h1>abc</h1>')).toEqual([
    {
      type: 'tag',
      tagType: 'h1',
      value: [{ type: 'text', value: 'abc' }],
      attributes: []
    }
  ]);
});

test('unicode', () => {
  expect(parse('ěšč<a>./\\</a>🐞<a>🏢☠️</a>')).toEqual([
    { type: 'text', value: 'ěšč' },
    {
      type: 'tag',
      tagType: 'a',
      value: [{ type: 'text', value: './\\' }],
      attributes: []
    },
    { type: 'text', value: '🐞' },
    {
      type: 'tag',
      tagType: 'a',
      value: [{ type: 'text', value: '🏢☠️' }],
      attributes: []
    }
  ]);
});

test('broken tags', () => {
  expect(parse('ab<')).toEqual([{ type: 'text', value: 'ab<' }]);

  expect(parse('<a>text</no</nope... now</a>')).toEqual([
    {
      type: 'tag',
      tagType: 'a',
      value: [{ type: 'text', value: 'text</no</nope... now' }],
      attributes: []
    }
  ]);

  expect(parse('abc<a><>><<b>tagtext</b></a>')).toEqual([
    { type: 'text', value: 'abc' },
    {
      type: 'tag',
      tagType: 'a',
      value: [
        { type: 'text', value: '<>><' },
        {
          type: 'tag',
          tagType: 'b',
          value: [{ type: 'text', value: 'tagtext' }],
          attributes: []
        }
      ],
      attributes: []
    }
  ]);

  expect(parse('abc<a><b>><>>/</</b>beh<ind</a>')).toEqual([
    { type: 'text', value: 'abc' },
    {
      type: 'tag',
      tagType: 'a',
      value: [
        {
          type: 'tag',
          tagType: 'b',
          value: [{ type: 'text', value: '><>>/</' }],
          attributes: []
        },
        { type: 'text', value: 'beh<ind' }
      ],
      attributes: []
    }
  ]);
});

test('attributes', () => {
  expect(
    parse(
      'abc<a href="/url/path" target="_blank" class="hello motos"><b>tagtext</b></a>',
      true
    )
  ).toEqual([
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
        }
      ]
    }
  ]);
});

test('attributes with full urls', () => {
  expect(
    parse('abc<a href="https://abc.de/ab/cd?p1=a&p2=b4#top">url</a>test', true)
  ).toEqual([
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
        }
      ]
    },
    { type: 'text', value: 'test' }
  ]);
});

test('attributes self-closing tags and no content/boolean attributes', () => {
  expect(parse('abc<input autofocus class="" disabled/>test', true)).toEqual([
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
        }
      ]
    },
    { type: 'text', value: 'test' }
  ]);
});
