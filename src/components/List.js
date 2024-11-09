import React from 'react';

function List({ items, onToggleConsumed, onDelete }) {
return (
    <div className="p-4">
    <h2 className="text-2xl mb-4">My List</h2>
    {items.length > 0 ? (
        <ul className="space-y-2">
        {items.map((item, index) => (
            <li
            key={index}
            className={`flex items-center justify-between p-2 border rounded ${
                item.consumed ? 'line-through text-gray-500' : ''
            }`}
            >
            <span>{item.title}</span>
            <div>
                <button
                className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
                onClick={() => onToggleConsumed(index)}
                >
                {item.consumed ? 'Uncheck' : 'Check'}
                </button>
                <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => onDelete(index)}
                >
                Delete
                </button>
            </div>
            </li>
        ))}
        </ul>
    ) : (
        <p className="text-gray-500">No items in your list.</p>
    )}
    </div>
);
}

export default List;