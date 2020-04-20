import {
  anythingExcept,
  many,
  choice,
  char,
  between,
  str,
  coroutine,
  letters
} from 'arcsecond';

// tag types
enum TokenType {
  openTag = 'open-tag',
  closeTag = 'close-tag',
  text = 'text'
}

// tagger
const tokenTag = (type, customizer = id => id) => value => ({
  type,
  value: customizer(value)
});

// parser
const lAngle = char('<');
const rAngle = char('>');
const openTag = between(lAngle)(rAngle)(letters).map(
  tokenTag(TokenType.openTag)
);
const closeTag = between(str('</'))(rAngle)(letters).map(
  tokenTag(TokenType.closeTag)
);
const text = many(anythingExcept(choice([openTag, closeTag]))).map(
  tokenTag(TokenType.text, val => val.join(''))
);

// order matters
const token = choice([openTag, closeTag, text]);

const fullParser = coroutine(function* () {
  const result = [];

  while (true) {
    const value = yield token;
    if (value.value === '' || value.isError) break;
    result.push(value);
  }

  return result;
});

const structBuilder = (tokens, openTags = []) => {
  const finalResult = [];

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];

    if (t.ignore) continue;
    t.ignore = true;

    switch (t.type) {
      case TokenType.text: {
        const { ignore, ...tag } = t;
        finalResult.push(tag);
        break;
      }
      case TokenType.openTag: {
        finalResult.push({
          type: 'tag',
          tagType: t.value,
          value: structBuilder(tokens.slice(i + 1), [...openTags, t.value])
        });

        break;
      }
      case TokenType.closeTag: {
        const lastOpen = openTags[openTags.length - 1];
        if (lastOpen === t.value) {
          return finalResult;
        }

        throw new Error(`Expected ${lastOpen} but got ${t.value} instead.`);
      }
      default:
        throw new Error(`Unknown type ${t.type}`);
    }
  }
  return finalResult;
};

const tokenizeAndParse = text => {
  const tokens = fullParser.run(text).result;

  return structBuilder(tokens);
};

export { tokenizeAndParse };
