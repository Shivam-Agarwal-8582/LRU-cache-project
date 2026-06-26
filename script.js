// script.js – LRU Cache Simulator with visualizations and animations

// ---------- Helper: DOM Utilities ----------
function $(selector) {
  return document.querySelector(selector);
}
function createNodeElement(key) {
  const el = document.createElement('div');
  el.className = 'node';
  el.textContent = key;
  return el;
}

// ---------- LRU Cache Implementation ----------
class LRUNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
    this.el = createNodeElement(key); // DOM element representing this node
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // key -> LRUNode
    this.head = null; // most recent
    this.tail = null; // least recent
    this.hits = 0;
    this.misses = 0;
  }

  // move node to front (head)
  _moveToFront(node) {
    if (this.head === node) return; // already front
    // detach
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (this.tail === node) this.tail = node.prev; // update tail if needed
    // place at front
    node.prev = null;
    node.next = this.head;
    if (this.head) this.head.prev = node;
    this.head = node;
    if (!this.tail) this.tail = node;
  }

  // evict least recently used (tail)
  _evict() {
    if (!this.tail) return null;
    const evicted = this.tail;
    if (evicted.prev) {
      this.tail = evicted.prev;
      this.tail.next = null;
    } else {
      // only one element
      this.head = this.tail = null;
    }
    this.map.delete(evicted.key);
    return evicted;
  }

  // Public GET
  async get(key) {
    const node = this.map.get(key);
    if (!node) {
      this.misses++;
      logOperation(`GET(${key}) → Miss`);
      updateStats();
      return null;
    }
    this.hits++;
    logOperation(`GET(${key}) → Hit (value=${node.value})`);
    // animate move to front
    await animateMoveToFront(node);
    this._moveToFront(node);
    updateStats();
    return node.value;
  }

  // Public PUT
  async put(key, value) {
    let node = this.map.get(key);
    if (node) {
      // update value, move to front
      node.value = value;
      logOperation(`PUT(${key},${value}) → Update existing`);
      await animateMoveToFront(node);
      this._moveToFront(node);
    } else {
      // new insertion
      node = new LRUNode(key, value);
      this.map.set(key, node);
      logOperation(`PUT(${key},${value}) → Insert`);
      // attach DOM element at front (will be animated later)
      const dllContainer = $('#dll-container');
      dllContainer.prepend(node.el);
      // add to hashmap UI later
      // move to front in list structure
      this._insertAtFront(node);
      // check capacity
      if (this.map.size > this.capacity) {
        const evicted = this._evict();
        logOperation(`Evicted Key = ${evicted.key}`);
        // animate removal
        await animateEviction(evicted);
        // remove DOM element
        evicted.el.remove();
      }
    }
    updateHashMapTable();
    updateStats();
  }

  _insertAtFront(node) {
    node.prev = null;
    node.next = this.head;
    if (this.head) this.head.prev = node;
    this.head = node;
    if (!this.tail) this.tail = node;
  }

  // Adjust capacity (used when user changes input)
  async setCapacity(newCap) {
    this.capacity = newCap;
    // evict until size fits
    while (this.map.size > this.capacity) {
      const evicted = this._evict();
      logOperation(`Evicted Key = ${evicted.key} (capacity shrink)`);
      await animateEviction(evicted);
      evicted.el.remove();
    }
    updateHashMapTable();
    updateStats();
  }
}

// ---------- UI Rendering ----------
function updateDLLVisualization() {
  const container = $('#dll-container');
  // clear and re‑append in order from head to tail
  container.innerHTML = '';
  let cur = lruCache.head;
  while (cur) {
    container.appendChild(cur.el);
    cur = cur.next;
  }
}

function updateHashMapTable() {
  const tbody = $('#hashmap-table tbody');
  tbody.innerHTML = '';
  lruCache.map.forEach((node, key) => {
    const tr = document.createElement('tr');
    const tdKey = document.createElement('td');
    tdKey.textContent = key;
    const tdNode = document.createElement('td');
    tdNode.textContent = `Node${key}`;
    tr.appendChild(tdKey);
    tr.appendChild(tdNode);
    tbody.appendChild(tr);
  });
}

function logOperation(message) {
  const log = $('#log');
  log.value += message + '\n';
  log.scrollTop = log.scrollHeight;
}

function updateStats() {
  $('#hits').textContent = lruCache.hits;
  $('#misses').textContent = lruCache.misses;
  const total = lruCache.hits + lruCache.misses;
  const rate = total ? ((lruCache.hits / total) * 100).toFixed(1) + '%' : '0%';
  $('#hit-rate').textContent = rate;
}

// ---------- Animations ----------
async function animateMoveToFront(node) {
  // simple fade‑out/fade‑in using CSS class
  node.el.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
  node.el.style.opacity = '0.3';
  await new Promise(r => setTimeout(r, 200));
  // move element to front in DOM
  const container = $('#dll-container');
  container.prepend(node.el);
  node.el.style.opacity = '1';
  await new Promise(r => setTimeout(r, 300));
}

async function animateEviction(node) {
  // flash red then shrink
  node.el.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
  node.el.style.opacity = '0.2';
  node.el.style.transform = 'scale(0.5)';
  await new Promise(r => setTimeout(r, 400));
}

// ---------- Initialization & Event Listeners ----------
let lruCache = new LRUCache(parseInt($('#capacity-input').value, 10));

$('#put-btn').addEventListener('click', async () => {
  const key = parseInt($('#put-key').value, 10);
  const value = parseInt($('#put-value').value, 10);
  if (isNaN(key) || isNaN(value)) {
    alert('Please provide numeric key and value.');
    return;
  }
  await lruCache.put(key, value);
  updateDLLVisualization();
});

$('#get-btn').addEventListener('click', async () => {
  const key = parseInt($('#get-key').value, 10);
  if (isNaN(key)) {
    alert('Please provide a numeric key.');
    return;
  }
  const result = await lruCache.get(key);
  if (result !== null) {
    alert(`Cache Hit! Value = ${result}`);
  } else {
    alert('Cache Miss');
  }
  updateDLLVisualization();
});

$('#capacity-input').addEventListener('change', async (e) => {
  const newCap = parseInt(e.target.value, 10);
  if (isNaN(newCap) || newCap < 1) {
    alert('Capacity must be a positive integer.');
    e.target.value = lruCache.capacity;
    return;
  }
  await lruCache.setCapacity(newCap);
  updateDLLVisualization();
});

// Initial render
updateDLLVisualization();
updateHashMapTable();
updateStats();
