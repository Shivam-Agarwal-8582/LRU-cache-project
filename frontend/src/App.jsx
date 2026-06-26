import { useState } from 'react';
import './App.css';
import { putCache, getCache } from './api';

function App() {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const handlePut = async () => {
    if (!key) {
      setMessage('Key is required');
      return;
    }
    try {
      await putCache(key, value);
      setMessage(`Saved key "${key}"`);
    } catch (err) {
      setMessage('Error saving key');
    }
  };

  const handleGet = async () => {
    if (!key) {
      setMessage('Key is required');
      return;
    }
    try {
      const val = await getCache(key);
      setResult(val);
      setMessage(val ? 'Value retrieved' : 'Key not found');
    } catch (err) {
      setMessage('Error retrieving key');
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">LRU Cache Demo</h1>
      <div className="form-group">
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="input-key"
        />
        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="input-value"
        />
        <button onClick={handlePut} className="btn btn-primary">
          Put
        </button>
        <button onClick={handleGet} className="btn btn-secondary">
          Get
        </button>
      </div>
      {message && <p className="status-msg">{message}</p>}
      {result !== null && (
        <div className="result-block">
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
}

export default App;
