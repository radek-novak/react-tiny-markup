export enum LexemeType {
  HTML_OPENING_TAG,
  HTML_CLOSING_TAG,
  HTML_SELFCLOSING_TAG,
  STRING,
  HTML_TAG_ATTRIBUTE
}
export type AttributeNode = {
  type: LexemeType.HTML_TAG_ATTRIBUTE;
  ignore?: boolean;
  name: string;
  value: string | boolean;
};

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
      attributes: AttributeNode[];
    }
  | {
      type: LexemeType.HTML_CLOSING_TAG;
      ignore?: boolean;
      name: string;
      rawContent: string;
    };
