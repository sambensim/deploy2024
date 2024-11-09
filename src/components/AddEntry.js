import React, { useState } from 'react';

function AddEntry({ onAdd }) {
const [input, setInput] = useState('');

const handleAdd = () => {
    if (input.trim() !== '') {
    onAdd({ title: input, consumed: false });
    setInput('');
    }
};

return (
    <div className="p-4">
    <h2 className="text-2xl mb-4">Add New Item</h2>
    <div className="flex items-center">
        <input
        type="text"
        className="border rounded p-2 flex-1 mr-2"
        placeholder="Enter title..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        />
        <button
        className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={handleAdd}
        >
        Add
        </button>
    </div>
    </div>
);
}

export default AddEntry;