export enum LexemeType {
  HTML_OPENING_TAG,
  HTML_CLOSING_TAG,
  HTML_SELFCLOSING_TAG,
  STRING
}
export type LexemeTag =
  | {
      type: LexemeType.STRING;
      ignore?: boolean;
      value: string;
    }
  | {
      type: LexemeType.HTML_OPENING_TAG | LexemeType.HTML_SELFCLOSING_TAG;
      ignore?: boolean;
      name: string;
      rawContent: string;
      restContent: string;
    }
  | {
      type: LexemeType.HTML_CLOSING_TAG;
      ignore?: boolean;
      name: string;
      rawContent: string;
    };
