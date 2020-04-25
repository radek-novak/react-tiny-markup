import { parse } from '../parser';

const basicTestCasesMap = {
  abc: [{ type: 'text', value: 'abc' }],

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
const unicodeCasesMap = {
  'ěšč<a>./\\</a>🐞<a>🏢☠️</a>': [
    { type: 'text', value: 'ěšč' },
    { type: 'tag', tagType: 'a', value: [{ type: 'text', value: './\\' }] },
    { type: 'text', value: '🐞' },
    { type: 'tag', tagType: 'a', value: [{ type: 'text', value: '🏢☠️' }] }
  ]
};

const brokenTagsTestCasesMap = {
  'ab<': [{ type: 'text', value: 'ab<' }],

  '<a>text</no</nope... now</a>': [
    {
      type: 'tag',
      tagType: 'a',
      value: [{ type: 'text', value: 'text</no</nope... now' }]
    }
  ],

  'abc<a><>><<b>tagtext</b></a>': [
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
  ],

  'abc<a><b>><>>/</</b>beh<ind</a>': [
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
  ]
};

const entries = obj => Object.keys(obj).map(tc => [tc, obj[tc]]);

test('basic', () => {
  for (let [testInput, expectedOutput] of entries(basicTestCasesMap)) {
    expect(parse(testInput)).toEqual(expectedOutput);
  }
});

test('unicode', () => {
  for (let [testInput, expectedOutput] of entries(unicodeCasesMap)) {
    expect(parse(testInput)).toEqual(expectedOutput);
  }
});

test('broken tags', () => {
  for (let [testInput, expectedOutput] of entries(brokenTagsTestCasesMap)) {
    expect(parse(testInput)).toEqual(expectedOutput);
  }
});
