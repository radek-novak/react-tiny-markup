import React, { createElement } from 'react';
import { parse, ParserElement, AttributeElement } from './parser';
import { tags } from './util';

export type RendererType = (p: {
  tag?: string;
  children?: React.ReactNode;
  key: string | number;
  attributes?: {
    [x: string]: string | boolean;
  };
}) => React.ReactNode;

const translateAttrs = (
  attrMap: Record<string, string>,
  attrs: AttributeElement[]
) =>
  attrs.reduce((attrs, { attributeName, value }) => {
    if (!attrMap.hasOwnProperty(attributeName)) return attrs;
    const reactAttributeName = attrMap[attributeName];
    if (reactAttributeName) return { ...attrs, [reactAttributeName]: value };

    return { ...attrs, [attributeName]: value };
  }, {} as Record<string, string | boolean>) ?? {};

export const defaultRenderer: RendererType = ({
  tag,
  children,
  key,
  attributes
}) =>
  tag && tags.has(tag)
    ? createElement(tag, { key, ...attributes }, children)
    : children;

export const ElementRenderer: React.FunctionComponent<{
  struct: ParserElement[];
  path?: string;
  allowedAttributes: Record<string, string>;
  renderer?: RendererType;
}> = ({ struct, renderer = defaultRenderer, path = '', allowedAttributes }) => {
  return (
    <>
      {struct
        ? struct.map((el, i) => {
            if (el.type === 'text') return el.value;
            const currentKey = `${path}/${i}`;
            const attributes = translateAttrs(
              allowedAttributes,
              el.attributes ?? []
            );

            return renderer({
              key: currentKey,
              tag: el.tagType,
              attributes,
              children: el.value ? (
                <ElementRenderer
                  key={`${currentKey}/${i}`}
                  struct={el.value}
                  renderer={renderer}
                  allowedAttributes={allowedAttributes}
                />
              ) : null
            });
          })
        : null}
    </>
  );
};
