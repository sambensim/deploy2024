import React, { useState, useEffect } from 'react';
import List from '../src/components/List';
import Navbar from '../src/components/Navbar';
import AddEntry from '../src/components/AddEntry';
import AddMovieEntry from '../src/components/AddMovieEntry';
import AddBookEntry from '../src/components/AddBookEntry';

export default function Home() {
const [items, setItems] = useState([]); // Initialize without accessing localStorage

// Load items from localStorage on the client side only
useEffect(() => {
    const savedItems = localStorage.getItem('items');
    if (savedItems) {
    setItems(JSON.parse(savedItems));
    }
}, []);

// Save items to localStorage whenever they change
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
    <Navbar />
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