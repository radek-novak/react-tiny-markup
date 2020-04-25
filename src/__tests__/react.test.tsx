import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactTinyMarkup, { ElementRenderer } from '../index';

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
        map={{ a: ({ children }) => <strong>{children}</strong> }}
      />
    )
  ).toEqual('abc<strong>a</strong>bc<strong>de</strong>');
});

test('ReactTinyMarkup basic examples', () => {
  const str = 'abc<strong>a</strong>bc<ooo>de</ooo>';
  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup>{str}</ReactTinyMarkup>
    )
  ).toEqual(str);

  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup map={{ strong: ({ children }) => <i>{children}</i> }}>
        {str}
      </ReactTinyMarkup>
    )
  ).toEqual('abc<i>a</i>bc<ooo>de</ooo>');
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
      <ReactTinyMarkup map={{ a: ({ children }) => <i>{children}</i> }}>
        {str}
      </ReactTinyMarkup>
    )
  ).toEqual('ěšč<i>./\\</i>🐞<i>🏢☠️</i>');
});

test('ReactTinyMarkup some broken tags', () => {
  const str = 'abc<a><b>><>>/</</b>beh<ind</a>';
  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup>{str}</ReactTinyMarkup>
    )
  ).toEqual('abc<a><b>&gt;&lt;&gt;&gt;/&lt;/</b>beh&lt;ind</a>');
});

test('ReactTinyMarkup return string on invalid input', () => {
  const str = 'abc<a><b></c>';
  expect(
    ReactDOMServer.renderToStaticMarkup(
      <ReactTinyMarkup>{str}</ReactTinyMarkup>
    )
  ).toEqual('abc&lt;a&gt;&lt;b&gt;&lt;/c&gt;');
});
