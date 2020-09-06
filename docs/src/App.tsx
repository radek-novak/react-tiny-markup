// @ts-nocheck
import React from 'react';
import ReactTinyMarkup, { defaultRenderer } from 'react-tiny-markup';
import parentPackage from './parentPackage.json';
import './App.css';

const first = `Default settings allow the tags you expect, such as
<b>bold</b>, <i>italic</i>, line <br /> break are supported.
<ul>
  <li>as well as lists</li>
  <li>superscript: E = mc<sup>2</sup></li>
  <li>subscript: H<sub>2</sub>O</li>
</ul>
`;
const second = `<p>Rendering behavior can be completely changed</p>
<h1>E.g. by swapping tags</h1>
<br />
<a>not rendering them at all</a>
<br />
or define <sacrebleu>custom ones</sacrebleu>
`;

function App() {
  const [val, setVal] = React.useState(first);
  const [val2, setVal2] = React.useState(second);

  return (
    <div className="App">
      <h1>
        react-tiny-markup <sup>v{parentPackage.version}</sup>
      </h1>

      <section>
        <h2>Install</h2>
        <pre>
          <code>npm install react-tiny-markup</code>
        </pre>
        <pre>
          <code>yarn add react-tiny-markup</code>
        </pre>
      </section>

      <h2>Try it out</h2>
      <div className="grid">
        <textarea
          className="textarea"
          onChange={e => setVal(e.target.value)}
          rows={10}
          value={val}
        />
        <div className="arrow">→</div>
        <output className="output">
          <ReactTinyMarkup>{val}</ReactTinyMarkup>
        </output>

        <textarea
          className="textarea"
          onChange={e => setVal2(e.target.value)}
          rows={10}
          value={val2}
        />
        <div className="arrow">→</div>
        <output className="output">
          <ReactTinyMarkup
            renderer={p => {
              switch (p.tag) {
                case 'h1':
                  return React.createElement(
                    'small',
                    { key: p.key },
                    p.children
                  );
                case 'a':
                  return null;
                case 'sacrebleu':
                  return <div className="pulse">{p.children}</div>;
                default:
                  return defaultRenderer(p);
              }
            }}
          >
            {val2}
          </ReactTinyMarkup>
        </output>
      </div>
    </div>
  );
}

export default App;
