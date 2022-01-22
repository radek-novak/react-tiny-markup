import { Scanner } from './Scanner';
import { LexemeTag, LexemeType } from './types';

export type TextElement = {
  type: 'text';
  value: string;
};

export type TagElement = {
  type: 'tag';
  tagType: string;
  value: ParserElement[] | null;
};

export type ParserElement = TextElement | TagElement;

const structBuilder = (tokens: LexemeTag[], openTags = [] as string[]) => {
  const result = [] as ParserElement[];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.ignore) continue;
    token.ignore = true;

    switch (token.type) {
      case LexemeType.HTML_SELFCLOSING_TAG: {
        result.push({
          type: 'tag',
          // [ 'br', null ] tagtype and possible space or null
          tagType: token.name,
          value: null
        });

        break;
      }
      case LexemeType.STRING: {
        result.push({ type: 'text', value: token.value });
        break;
      }
      case LexemeType.HTML_OPENING_TAG: {
        result.push({
          type: 'tag',
          tagType: token.name,
          value: structBuilder(tokens.slice(i + 1), [...openTags, token.name])
        });

        break;
      }
      case LexemeType.HTML_CLOSING_TAG: {
        const lastOpen = openTags[openTags.length - 1];
        if (lastOpen === token.name) {
          return result;
        }

        throw new Error(`Expected ${lastOpen} but got ${token.name} instead.`);
      }
      default:
        throw new Error(`Unknown type ${token}`);
    }
  }
  return result;
};

const parse = (text: string) => {
  const scanner = new Scanner(text);

  return structBuilder(scanner.scanTokensWithMerge());
};

export { parse };
