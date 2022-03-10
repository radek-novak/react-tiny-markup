import React, { createElement } from 'react';
import { AttributElement, parse, ParserElement } from './parser';
import { tags, validAttributes, reactAttributesMap } from './util';

type RendererType = (p: {
  tag?: string;
  children?: React.ReactNode;
  key: string | number;
  attributes?: {
    [x: string]: React.ReactNode
  }
}) => React.ReactNode;

const defaultRenderer: RendererType = ({ tag, children, key, attributes }) =>
  tag && tags.has(tag) ? createElement(tag, { key, ...attributes }, children) : children;

const ElementRenderer: React.FunctionComponent<{
  struct: ParserElement[];
  path?: string;
  renderer?: RendererType;
}> = ({ struct, renderer = defaultRenderer, path }) => (
  <>
    {struct
      ? struct.map((el, i) => {
          if (el.type === 'text') return el.value;
          const currentKey = `${path ?? ''}/${i}`;
          const attributes = el.attributes?.reduce((attrs, { attributeName, value }) => {
            if(!validAttributes.has(attributeName)) return attrs;

            const reactAttributeName = reactAttributesMap.get(attributeName);
            if(reactAttributeName) return {...attrs, [reactAttributeName]: value};

            return {...attrs, [attributeName]: value};
          }, {}) ?? {};

          return renderer({
            key: currentKey,
            tag: el.tagType,
            attributes,
            children: el.value ? (
              <ElementRenderer
                key={`${currentKey}/${i}`}
                struct={el.value}
                renderer={renderer}
              />
            ) : null
          });
        })
      : null}
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

    return <>{props.children}</>;
  } catch {
    return <>{props.children}</>;
  }
};

export default ReactTinyMarkup;
export { ElementRenderer, defaultRenderer };
