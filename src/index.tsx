import React, { createElement } from 'react';
import { parse, ParserElement } from './parser';
import { tags, validAttributes, reactAttributesMap } from './util';

const formatAllowedAttributes = (allowedAttributes: Record<string, string>) => {
  const allowedAttributeNames = Object.keys(allowedAttributes ?? {});
  const parseAttributes = allowedAttributeNames.length > 0;
  return {
    allowedAttributeNames,
    parseAttributes
  }
};

const setAllowedAttributes = (allowedAttributes: Record<string, string>, allowedAttributeNames: string[]) => {
  allowedAttributeNames.forEach((name: string) => {
    validAttributes.add(name);
    const reactMappingName = (allowedAttributes ?? {})[name];
    reactMappingName && reactAttributesMap.set(name, reactMappingName);
  });
};

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
  allowedAttributes?:  Record<string, string>;
  renderer?: RendererType;
}> = ({ struct, renderer = defaultRenderer, path, allowedAttributes }) => {
  const { parseAttributes, allowedAttributeNames } = formatAllowedAttributes(allowedAttributes ?? {});
  if(parseAttributes) {
    setAllowedAttributes(allowedAttributes ?? {}, allowedAttributeNames);
  }

  return (
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
}

const ReactTinyMarkup = (props: {
  children: React.ReactNode;
  allowedAttributes?:  Record<string, string>;
  renderer?: RendererType;
}) => {
  const { parseAttributes, allowedAttributeNames } = formatAllowedAttributes(props.allowedAttributes ?? {});
  if(parseAttributes) {
    setAllowedAttributes(props.allowedAttributes ?? {}, allowedAttributeNames);
  }

  try {
    if (typeof props.children === 'string') {
      const parsedStruct = parse(props.children, parseAttributes);
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
export { ElementRenderer, defaultRenderer, formatAllowedAttributes, setAllowedAttributes };
