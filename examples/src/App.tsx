import React from 'react';
import ReactTinyMarkup from 'react-tiny-markup';
import './App.css';

function App() {
  const [val, setVal] = React.useState('<b>bold</b><i>italic</i>');
  return (
    <div className="App">
      <textarea onChange={e => setVal(e.target.value)} value={val} />
      <ReactTinyMarkup>{val}</ReactTinyMarkup>
    </div>
  );
}

export default App;
