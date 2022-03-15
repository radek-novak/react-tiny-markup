/*
 * This test relies on ReactDOMServer.renderToStaticMarkup escaping parts of
 * HTML elements provided as strings (which would be insecure). So we know that
 * any non-escaped HTML in the output was successfully parsed as HTML tag.
 */

import React, { createElement } from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactTinyMarkup, { ElementRenderer, defaultRenderer } from '../index';

test('ElementRenderer', () => {
  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ElementRenderer
        allowedAttributes={{
          autofocus: 'autoFocus',
          class: 'className',
          disabled: '',
          href: ''
        }}
        struct={[
          { type: 'text', value: 'abc' },
          { type: 'tag', tagType: 'a', value: [{ type: 'text', value: 'a' }], attributes: [{ type: 'attribute', attributeName: 'href', value: 'https://abc.de/ab/cd?p1=a&p2=b4#top' }] },
          { type: 'text', value: 'bc' },
          { type: 'tag', tagType: 'a', value: [{ type: 'text', value: 'de' }], attributes: [{ type: 'attribute', attributeName: 'class', value: 'test-name'}] },
          {
            type: 'tag',
            tagType: 'br',
            value: null,
            attributes: [
              {
                type: 'attribute',
                attributeName: 'autofocus',
                value: true
              },
              {
                type: 'attribute',
                attributeName: 'class',
                value: ''
              },
              {
                type: 'attribute',
                attributeName: 'disabled',
                value: true
              },
            ]
          },
        ]}
      />
    )
  ).toEqual('abc<a href="https://abc.de/ab/cd?p1=a&amp;p2=b4#top">a</a>bc<a class="test-name">de</a><br autofocus="" class="" disabled=""/>');
});