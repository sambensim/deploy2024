import React, { useState, useEffect } from 'react';
import List from './components/List';
import AddEntry from './components/AddEntry';
import AddMovieEntry from './components/AddMovieEntry';
import AddBookEntry from './components/AddBookEntry';

function App() {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('items');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const handleAddItem = (item) => {
    setItems([...items, item]);
  };

  const handleToggleConsumed = (index) => {
    setItems(
      items.map((item, i) =>
        i === index ? { ...item, consumed: !item.consumed } : item
      )
    );
  };

  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Suspend</h1>
      <AddMovieEntry onAdd={handleAddItem} />
      <AddBookEntry onAdd={handleAddItem} />
      <AddEntry onAdd={handleAddItem} />
      <List
        items={items}
        onToggleConsumed={handleToggleConsumed}
        onDelete={handleDeleteItem}
      />
    </div>
  );
}

export default App;