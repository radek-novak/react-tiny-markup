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
        struct={[
          { type: 'text', value: 'abc' },
          { type: 'tag', tagType: 'a', value: [{ type: 'text', value: 'a' }] },
          { type: 'text', value: 'bc' },
          { type: 'tag', tagType: 'a', value: [{ type: 'text', value: 'de' }] }
        ]}
        renderer={({ children, tag, key }) =>
          tag === 'a' ? <strong key={key}>{children}</strong> : null
        }
      />
    )
  ).toEqual('abc<strong>a</strong>bc<strong>de</strong>');
});

test('ReactTinyMarkup basic examples', () => {
  const str = 'abc<strong>a</strong>bcde';
  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup>{str}</ReactTinyMarkup>
    )
  ).toEqual(str);

  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup
        renderer={({ children, tag, key }) =>
          tag === 'strong' ? <i key={key}>{children}</i> : null
        }
      >
        {str}
      </ReactTinyMarkup>
    )
  ).toEqual('abc<i>a</i>bcde');
});

test('ReactTinyMarkup multiple tags', () => {
  const str = 'abc<strong>a</strong>b<i>c</i>d<b>e</b>';
  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup>{str}</ReactTinyMarkup>
    )
  ).toEqual(str);

  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup
        renderer={p =>
          p.tag === 'strong' ? (
            <i key={p.key}>{p.children}</i>
          ) : (
            defaultRenderer(p)
          )
        }
      >
        {str}
      </ReactTinyMarkup>
    )
  ).toEqual('abc<i>a</i>b<i>c</i>d<b>e</b>');
});

test('ReactTinyMarkup unicode', () => {
  const str = 'ěšč<a>./\\</a>🐞<a>🏢☠️</a>';
  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup>{str}</ReactTinyMarkup>
    )
  ).toEqual(str);

  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup
        renderer={({ children, tag, key }) =>
          tag === 'a' ? <i key={key}>{children}</i> : null
        }
      >
        {str}
      </ReactTinyMarkup>
    )
  ).toEqual('ěšč<i>./\\</i>🐞<i>🏢☠️</i>');
});

test('ReactTinyMarkup removing tags', () => {
  const str = 'abc<strong>a</strong>b<i>c</i>d<b>e</b>';
  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup
        renderer={p => (p.tag === 'strong' ? p.children : defaultRenderer(p))}
      >
        {str}
      </ReactTinyMarkup>
    )
  ).toEqual('abcab<i>c</i>d<b>e</b>');
});

test('ReactTinyMarkup some broken tags', () => {
  const str = 'abc<a><b>><>>/</</b>beh<ind</a>';
  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup>{str}</ReactTinyMarkup>
    )
  ).toEqual('abc<a><b>&gt;&lt;&gt;&gt;/&lt;/</b>beh&lt;ind</a>');
});
test('ReactTinyMarkup spaces', () => {
  const str =
    '<b>this should not be actually bold</b> - <i>this should be slanted</i> - <sup> super script</sup> - <sub> subscript </sub>  - <sub><i>italic subscript</i></sub>';
  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup>{str}</ReactTinyMarkup>
    )
  ).toEqual(str);
});

test('ReactTinyMarkup return string on invalid input', () => {
  const str = 'abc<a><b></c>';
  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup>{str}</ReactTinyMarkup>
    )
  ).toEqual('abc&lt;a&gt;&lt;b&gt;&lt;/c&gt;');
});

test('ReactTinyMarkup custom renderers', () => {
  const str = '<ooo>inner</ooo><remove>invi<b>s</b>ible</remove><b>left in</b>';

  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup
        renderer={p => {
          switch (p.tag) {
            case 'ooo':
              return createElement('c', { key: p.key }, p.children);
            case 'remove':
              return null;
            default:
              return createElement(p.tag, { key: p.key }, p.children);
          }
        }}
      >
        {str}
      </ReactTinyMarkup>
    )
  ).toEqual('<c>inner</c><b>left in</b>');

  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup
        renderer={p =>
          p.tag === 'b'
            ? createElement('bbb', { key: p.key }, p.children)
            : defaultRenderer(p)
        }
      >
        {str}
      </ReactTinyMarkup>
    )
  ).toEqual('innerinvi<bbb>s</bbb>ible<bbb>left in</bbb>');
});
