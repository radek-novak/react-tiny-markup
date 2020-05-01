import React, { createElement } from 'react';
import { parse } from './parser';
import { tags } from './util';

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

type RendererType = (p: {
  tag?: string;
  children?: React.ReactNode;
  key?: string | number;
}) => React.ReactNode;

const defaultRenderer = ({ tag, children, key }) =>
  tags.has(tag) ? createElement(tag, { key }, children) : children;

const ElementRenderer: React.FunctionComponent<{
  struct: ParserElement[];
  path?: string;
  renderer?: RendererType;
}> = ({ struct, renderer = defaultRenderer, path }) => (
  <>
    {struct.map((el, i) => {
      if (el.type === 'text') return el.value;
      const currentKey = `${path ?? ''}/${i}`;

      return renderer({
        key: currentKey,
        tag: el.tagType,
        children: (
          <ElementRenderer key={`${currentKey}/${i}`} struct={el.value} />
        )
      });
    })}
  </>
);

const ReactTinyMarkup = (props: {
  children: React.ReactNode;
  renderer?: RendererType;
}) => {
  try {
    if (typeof props.children === 'string') {
      const parsedStruct = parse(props.children);
      return (
        <>
          <ElementRenderer struct={parsedStruct} renderer={props.renderer} />
        </>
      );
    }
  } catch {
    return <>{props.children}</>;
  }
};

export default ReactTinyMarkup;
export { ElementRenderer, defaultRenderer };
