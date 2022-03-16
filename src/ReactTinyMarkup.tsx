import React from 'react';
import { RendererType, ElementRenderer } from './ElementRenderer';
import { parse } from './parser';

const ReactTinyMarkup = (props: {
  children: React.ReactNode;
  allowedAttributes?: Record<string, string>;
  renderer?: RendererType;
}) => {
  const _allowedAttributes = props.allowedAttributes ?? {};
  const parseAttributes = Object.keys(_allowedAttributes).length > 0;

  try {
    if (typeof props.children === 'string') {
      const parsedStruct = parse(props.children, parseAttributes);
      return (
        <>
          <ElementRenderer
            struct={parsedStruct}
            renderer={props.renderer}
            allowedAttributes={_allowedAttributes}
          />
        </>
      );
    }

    return <>{props.children}</>;
  } catch {
    return <>{props.children}</>;
  }
};

export default ReactTinyMarkup;
