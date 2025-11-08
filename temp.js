map()

export default function FruitList() {
  const fruits = ['Apple', 'Banana', 'Orange', 'Grape'];

  // Build list items using a for loop
  const listItems = [];
  for (let i = 0; i < fruits.length; i++) {
    listItems.push(<li key={i}>{fruits[i]}</li>);
  }

  return (
    <ul>
      {listItems}
    </ul>
  );
}
{ fruits.map((fruit, index) => <li key={index}>{fruit}</li>) }

filter()

import { useState } from 'react';

export default function SearchNames() {
  const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
  const [search, setSearch] = useState('');

  // FILTER: Find names matching search using a for loop
  const filtered = [];
  for (let i = 0; i < names.length; i++) {
    const nameLower = names[i].toLowerCase();
    const searchLower = search.toLowerCase();

    if (nameLower.includes(searchLower)) {
      filtered.push(names[i]);
    }
  }

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search names..."
      />
      <p>Results: {filtered.join(', ')}</p>
    </div>
  );
}


useReducer()

export default function TotalScore() {
  const scores = [85, 92, 78, 90, 88];

  // REDUCE: Sum all scores using a for loop
  let total = 0;
  for (let i = 0; i < scores.length; i++) {
    total = total + scores[i];
  }

  return (
    <div>
      <p>Scores: {scores.join(', ')}</p>
      <p>Total: {total}</p>
    </div>
  );
}

