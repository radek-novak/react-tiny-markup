import {
  possibly,
  anythingExcept,
  many,
  choice,
  char,
  between,
  str,
  coroutine,
  sequenceOf,
  letters
} from './lib/arcsecond';

// types
enum TokenType {
  selfClosingTag = 'self-closing-tag',
  openTag = 'open-tag',
  closeTag = 'close-tag',
  text = 'text'
}

type Token = {
  type: TokenType;
  ignore?: boolean;
  value: string;
};

type TextElement = {
  type: 'text';
  value: string;
};

type TagElement = {
  type: 'tag';
  tagType: string;
  value: ParserElement[];
};

type ParserElement = TextElement | TagElement;

// tagger
const tokenTag = (type: TokenType, customizer = id => id) => value => ({
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

const selfClosingTag = between(lAngle)(str('/>'))(
  sequenceOf([letters, possibly(char(' '))])
).map(tokenTag(TokenType.selfClosingTag));

const text = many(
  anythingExcept(choice([openTag, closeTag, selfClosingTag]))
).map(tokenTag(TokenType.text, val => val.join('')));

// order matters
const token = choice([selfClosingTag, openTag, closeTag, text]);

const tokenize = coroutine(function* () {
  const result = [];

  while (true) {
    const value = yield token;
    if (value.value === '' || value.isError) break;
    result.push(value);
  }

  return result;
});

const structBuilder = (tokens: Token[], openTags = []) => {
  const result = [] as ParserElement[];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.ignore) continue;
    token.ignore = true;

    switch (token.type) {
      case TokenType.selfClosingTag: {
        result.push({
          type: 'tag',
          // [ 'br', null ] tagtype and possible space or null
          tagType: token.value[0],
          value: null
        });

        break;
      }
      case TokenType.text: {
        const { ignore, ...textObj } = token;
        result.push(textObj as any);
        break;
      }
      case TokenType.openTag: {
        result.push({
          type: 'tag',
          tagType: token.value,
          value: structBuilder(tokens.slice(i + 1), [...openTags, token.value])
        });

        break;
      }
      case TokenType.closeTag: {
        const lastOpen = openTags[openTags.length - 1];
        if (lastOpen === token.value) {
          return result;
        }

        throw new Error(`Expected ${lastOpen} but got ${token.value} instead.`);
      }
      default:
        throw new Error(`Unknown type ${token.type}`);
    }
  }
  return result;
};

const parse = text => {
  const tokens = tokenize.run(text).result;

  return structBuilder(tokens);
};

export { parse };
