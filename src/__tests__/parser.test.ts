import { parse } from '../parser';

test('self-closing', () => {
  expect(parse('<br />')).toEqual([
    { type: 'tag', tagType: 'br', value: null }
  ]);

  expect(parse('<br /><br/>')).toEqual([
    { type: 'tag', tagType: 'br', value: null },
    { type: 'tag', tagType: 'br', value: null }
  ]);

  expect(parse('<div><br /> <br/></div>')).toEqual([
    {
      type: 'tag',
      tagType: 'div',
      value: [
        { type: 'tag', tagType: 'br', value: null },
        { type: 'text', value: ' ' },
        { type: 'tag', tagType: 'br', value: null }
      ]
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
          value: [{ type: 'tag', tagType: 'br', value: null }]
        },
        { type: 'text', value: ' ' },
        { type: 'tag', tagType: 'br', value: null }
      ]
    }
  ]);
});

test('basic', () => {
  expect(parse('abc')).toEqual([{ type: 'text', value: 'abc' }]);

  expect(parse('abc<a>a</a>bc<a>de</a>')).toEqual([
    { type: 'text', value: 'abc' },
    { type: 'tag', tagType: 'a', value: [{ type: 'text', value: 'a' }] },
    { type: 'text', value: 'bc' },
    { type: 'tag', tagType: 'a', value: [{ type: 'text', value: 'de' }] }
  ]);
  expect(parse('abc<br />bc<a>de</a>')).toEqual([
    { type: 'text', value: 'abc' },
    { type: 'tag', tagType: 'br', value: null },
    { type: 'text', value: 'bc' },
    { type: 'tag', tagType: 'a', value: [{ type: 'text', value: 'de' }] }
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
          value: [{ type: 'text', value: 'tagtext' }]
        }
      ]
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
          value: [{ type: 'text', value: 'tagtext' }]
        },
        { type: 'text', value: 'behind' }
      ]
    }
  ]);

  expect(parse('<h1>abc</h1>')).toEqual([
    {
      type: 'tag',
      tagType: 'h1',
      value: [{ type: 'text', value: 'abc' }]
    }
  ]);
});

test('unicode', () => {
  expect(parse('ěšč<a>./\\</a>🐞<a>🏢☠️</a>')).toEqual([
    { type: 'text', value: 'ěšč' },
    { type: 'tag', tagType: 'a', value: [{ type: 'text', value: './\\' }] },
    { type: 'text', value: '🐞' },
    { type: 'tag', tagType: 'a', value: [{ type: 'text', value: '🏢☠️' }] }
  ]);
});

test('broken tags', () => {
  expect(parse('ab<')).toEqual([{ type: 'text', value: 'ab<' }]);

  expect(parse('<a>text</no</nope... now</a>')).toEqual([
    {
      type: 'tag',
      tagType: 'a',
      value: [{ type: 'text', value: 'text</no</nope... now' }]
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
          value: [{ type: 'text', value: 'tagtext' }]
        }
      ]
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
          value: [{ type: 'text', value: '><>>/</' }]
        },
        { type: 'text', value: 'beh<ind' }
      ]
    }
  ]);
});
