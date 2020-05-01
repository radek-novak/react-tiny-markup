import React, { createElement } from 'react';
import { parse } from './parser';

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

type TagToReactEl = Record<
  string,
  React.ComponentClass | React.FunctionComponent
>;

const ElementRenderer: React.FunctionComponent<{
  struct: ParserElement[];
  map?: TagToReactEl;
}> = props => (
  <>
    {props.struct.map((el, i) => {
      if (el.type === 'text') return el.value;
      if (props.map && el.tagType in props.map) {
        const El = props.map[el.tagType];

        return (
          <El key={i}>
            <ElementRenderer struct={el.value} map={props.map} />
          </El>
        );
      }

      return createElement(
        el.tagType,
        { key: i },
        <ElementRenderer struct={el.value} map={props.map} />
      );
    })}
  </>
);

const ReactTinyMarkup = (props: {
  children: React.ReactNode;
  map?: TagToReactEl;
}) => {
  try {
    if (typeof props.children === 'string') {
      const parsedStruct = parse(props.children);
      return (
        <>
          <ElementRenderer struct={parsedStruct} map={props.map} />
        </>
      );
    }
  } catch {
    return <>{props.children}</>;
  }
};

export default ReactTinyMarkup;
export { ElementRenderer };
