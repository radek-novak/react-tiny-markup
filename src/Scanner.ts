import { LexemeTag, LexemeType } from './types';

const reNonchar = /[<>/]/;
// const allowedTagIdentifier = /[a-z0-9]/i;
const allowedTagIdentifierInitial = /[a-z]/i;

/**
 * Scans HTML(XML)-like tags. Tolerates unescaped entities `&lt;` and `&gt;`
 *
 * Adapted from
 * https://craftinginterpreters.com/scanning.html
 */
class Scanner {
  start: number;
  line: number;
  current: number;
  tokens: LexemeTag[];
  input: string;

  constructor(input: string) {
    this.tokens = [] as LexemeTag[];
    this.input = input;
    this.start = 0;
    this.line = 1;
    this.current = 0;
  }

  private isAtEnd() {
    return this.current >= this.input.length;
  }

  private peek() {
    if (this.isAtEnd()) return '\0';
    return this.input.charAt(this.current);
  }

  private advance() {
    return this.input.charAt(this.current++);
  }

  private addTagToken(
    type:
      | LexemeType.HTML_OPENING_TAG
      | LexemeType.HTML_CLOSING_TAG
      | LexemeType.HTML_SELFCLOSING_TAG,
    name: string,
    rawContent: string,
    restContent = ''
  ) {
    if (
      type === LexemeType.HTML_OPENING_TAG ||
      LexemeType.HTML_SELFCLOSING_TAG
    ) {
      this.tokens.push({ type, name, rawContent, restContent });
    } else if (type === LexemeType.HTML_CLOSING_TAG) {
      this.tokens.push({ type, name, rawContent });
    } else {
      throw new Error('unknown tag type');
    }
  }

  private addStringToken(value: string) {
    this.tokens.push({ type: LexemeType.STRING, value });
  }

  private scanString() {
    while (this.peek() !== '<' && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;
      this.advance();
    }

    // if (this.isAtEnd()) {
    //   The original errored here with "Unterminated string."
    //   return;
    // }

    const value = this.input.substring(this.start, this.current);
    this.addStringToken(value);
  }

  /**
   * Attempts to scan a tag, but will gracefully scan a string on fail
   */
  private scanTag() {
    // match closing tag if possible
    this.match('/');

    const nameStart = this.current;
    let nameEnd: null | number = null;

    // ensure first letter is valid
    if (!this.matchRegex(allowedTagIdentifierInitial)) {
      this.addStringToken(this.input.substring(this.start, this.current));

      return;
    }

    while (this.peek() !== '>' && this.peek() !== '<' && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;
      else if ((this.peek() === '/' || this.peek() === ' ') && nameEnd === null)
        nameEnd = this.current;

      this.advance();
    }

    if (this.peek() === '<') {
      // do not advance to start parsing this `<` as the next tag
      this.addStringToken(this.input.substring(this.start, this.current));
    } else {
      this.advance();

      this.addTag(
        this.input.substring(this.start, this.current),
        this.input.substring(nameStart, nameEnd ?? this.current)
      );
    }
  }

  private addTag(rawContent: string, name: string, restContent = '') {
    const cleanName = name.replace(reNonchar, '').toLowerCase();

    if (rawContent[1] === '/') {
      this.addTagToken(
        LexemeType.HTML_CLOSING_TAG,
        cleanName,
        rawContent,
        restContent
      );
    } else if (rawContent[rawContent.length - 2] === '/') {
      this.addTagToken(
        LexemeType.HTML_SELFCLOSING_TAG,
        cleanName,
        rawContent,
        restContent
      );
    } else {
      this.addTagToken(
        LexemeType.HTML_OPENING_TAG,
        cleanName,
        rawContent,
        restContent
      );
    }
  }

  private match(expected: string) {
    if (this.isAtEnd()) return false;
    if (this.input.charAt(this.current) !== expected) return false;

    this.current++;
    return true;
  }
  private matchRegex(expected: RegExp) {
    if (this.isAtEnd()) return false;
    if (!expected.test(this.input.charAt(this.current))) return false;

    this.current++;
    return true;
  }

  private scanToken() {
    const c = this.advance();

    switch (c) {
      // uncomment to ignore whitespace
      // case " ":
      // case "\r":
      // case "\t":
      //   break;
      case '\n':
        this.line++;
        break;
      case '<':
        this.scanTag();
        break;
      default:
        this.scanString();
    }
  }

  scanTokensWithMerge() {
    const tokens = this.scanTokens();
    const mergedTokens: LexemeTag[] = [tokens[0]];

    for (let i = 1; i < tokens.length; i++) {
      const lastMerged = mergedTokens[mergedTokens.length - 1];
      const current = tokens[i];
      if (
        lastMerged.type === LexemeType.STRING &&
        current.type === LexemeType.STRING
      ) {
        lastMerged.value += current.value;
      } else {
        mergedTokens.push(current);
      }
    }

    return mergedTokens;
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;

      this.scanToken();
    }

    return this.tokens;
  }
}

export { Scanner };
