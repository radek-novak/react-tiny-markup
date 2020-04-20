import { tokenizeAndParse } from './index';

const testCasesMap = {
  'ab<': [{ type: 'text', value: 'ab<' }],

  '<a>text</no</nope... now</a>': [
    {
      type: 'tag',
      tagType: 'a',
      value: [{ type: 'text', value: 'text</no</nope... now' }]
    }
  ],

  'abc<a>a</a>bc<a>de</a>': [
    { type: 'text', value: 'abc' },
    { type: 'tag', tagType: 'a', value: [{ type: 'text', value: 'a' }] },
    { type: 'text', value: 'bc' },
    { type: 'tag', tagType: 'a', value: [{ type: 'text', value: 'de' }] }
  ],

  'abc<a><b>tagtext</b></a>': [
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
  ],

  'abc<a><b>tagtext</b>behind</a>': [
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
  ]
};

const testCases = Object.keys(testCasesMap).map(tc => [tc, testCasesMap[tc]]);

test('basic', () => {
  expect(tokenizeAndParse('abc').result).toEqual([
    { type: 'text', value: 'abc' }
  ]);

  for (let [testInput, expectedOutput] of testCases) {
    expect(tokenizeAndParse(testInput).result).toEqual(expectedOutput);
  }
});
