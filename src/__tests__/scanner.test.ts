import { Scanner } from '../Scanner';

const test1 = `
<abc>xyz</bca>
  <a>bc<defg<d><br /></d></a>

  <STRONG>
    <img src="abcdef" />
  </STRONG>

  x<5; n>3


    a random string<br>
`;

const test4 = `<div><b><br /></b> <br/></div>`;
const test5 = `abc<a>a</a>bc<a>de</a>`;

const test1_expected = [
  { type: 0, name: 'abc', rawContent: '<abc>', restContent: '' },
  { type: 3, value: 'xyz' },
  { type: 1, name: 'bca', rawContent: '</bca>' },
  { type: 3, value: '  ' },
  { type: 0, name: 'a', rawContent: '<a>', restContent: '' },
  { type: 3, value: 'bc' },
  { type: 3, value: '<defg' },
  { type: 0, name: 'd', rawContent: '<d>', restContent: '' },
  { type: 2, name: 'br', rawContent: '<br />', restContent: '' },
  { type: 1, name: 'd', rawContent: '</d>' },
  { type: 1, name: 'a', rawContent: '</a>' },
  { type: 3, value: '  ' },
  { type: 0, name: 'strong', rawContent: '<STRONG>', restContent: '' },
  { type: 3, value: '    ' },
  { type: 2, name: 'img', rawContent: '<img src="abcdef" />', restContent: '' },
  { type: 4, name: 'src', value: 'abcdef' },
  { type: 3, value: '  ' },
  { type: 1, name: 'strong', rawContent: '</STRONG>' },
  { type: 3, value: '  x' },
  { type: 3, value: '<' },
  { type: 3, value: '5; n>3\n\n\n    a random string' },
  // { type: 3, value: '' },
  { type: 0, name: 'br', rawContent: '<br>', restContent: '' }
];
const test1_merged_expected = [
  { type: 0, name: 'abc', rawContent: '<abc>', restContent: '' },
  { type: 3, value: 'xyz' },
  { type: 1, name: 'bca', rawContent: '</bca>' },
  { type: 3, value: '  ' },
  { type: 0, name: 'a', rawContent: '<a>', restContent: '' },
  { type: 3, value: 'bc<defg' },
  { type: 0, name: 'd', rawContent: '<d>', restContent: '' },
  { type: 2, name: 'br', rawContent: '<br />', restContent: '' },
  { type: 1, name: 'd', rawContent: '</d>' },
  { type: 1, name: 'a', rawContent: '</a>' },
  { type: 3, value: '  ' },
  { type: 0, name: 'strong', rawContent: '<STRONG>', restContent: '' },
  { type: 3, value: '    ' },
  { type: 2, name: 'img', rawContent: '<img src="abcdef" />', restContent: '', attributes: [{ type: 4, name: 'src', value: 'abcdef' }] },
  { type: 3, value: '  ' },
  { type: 1, name: 'strong', rawContent: '</STRONG>' },
  { type: 3, value: '  x<5; n>3\n\n\n    a random string' },
  { type: 0, name: 'br', rawContent: '<br>', restContent: '' }
];

test('simple string', () => {
  const scanner = new Scanner('abcdefg');

  const result = scanner.scanTokens();

  expect(result).toEqual([{ type: 3, value: 'abcdefg' }]);
});

test('unicode', () => {
  const scanner = new Scanner('ěšč<a>./\\</a>🐞<a>🏢☠️</a>');

  const result = scanner.scanTokens();
  expect(result).toEqual([
    { type: 3, value: 'ěšč' },
    { type: 0, name: 'a', rawContent: '<a>', restContent: '' },
    { type: 3, value: './\\' },
    { type: 1, name: 'a', rawContent: '</a>' },
    { type: 3, value: '🐞' },
    { type: 0, name: 'a', rawContent: '<a>', restContent: '' },
    { type: 3, value: '🏢☠️' },
    { type: 1, name: 'a', rawContent: '</a>' }
  ]);
});

test('broken tags', () => {
  const scanner = new Scanner('ab<');

  const result = scanner.scanTokensWithMerge();
  expect(result).toEqual([{ type: 3, value: 'ab<' }]);
});

test('large test', () => {
  const scanner = new Scanner(test1);

  const result = scanner.scanTokens();

  expect(result).toEqual(test1_expected);
});

test('large test with merge', () => {
  const scanner = new Scanner(test1);

  const result = scanner.scanTokensWithMerge();

  expect(result).toEqual(test1_merged_expected);
});

test('self closing tags', () => {
  const scanner = new Scanner(`<br /><br/>`);

  const result = scanner.scanTokens();

  expect(result).toEqual([
    {
      type: 2,
      name: 'br',
      rawContent: '<br />',
      restContent: ''
    },
    {
      type: 2,
      name: 'br',
      rawContent: '<br/>',
      restContent: ''
    }
  ]);
});
test('nested tags', () => {
  const scanner = new Scanner(`<div><br /> <br/></div>`);

  const result = scanner.scanTokens();

  expect(result).toEqual([
    {
      type: 0,
      name: 'div',
      rawContent: '<div>',
      restContent: ''
    },
    {
      type: 2,
      name: 'br',
      rawContent: '<br />',
      restContent: ''
    },
    {
      type: 3,
      value: ' '
    },
    {
      type: 2,
      name: 'br',
      rawContent: '<br/>',
      restContent: ''
    },
    {
      type: 1,
      name: 'div',
      rawContent: '</div>'
    }
  ]);
});
