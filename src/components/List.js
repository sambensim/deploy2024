import React from 'react';

function List({ items, onToggleConsumed, onDelete }) {

function renderContent(item) {
    switch (item.type) {
    case 'movie':
    case 'series':
        return (
        <div className="flex items-center">
            {item.poster && (
            <img src={item.poster} alt={item.title} className="w-12 h-16 mr-4" />
            )}
            <div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.year}</p>
            </div>
        </div>
        );

    case 'book':
        return (
        <div className="flex items-center">
            {item.thumbnail && (
            <img src={item.thumbnail} alt={item.title} className="w-12 h-16 mr-4" />
            )}
            <div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-500">
                {item.authors || 'Unknown Author'}
            </p>
            </div>
        </div>
        );

    // Additional cases for other content types
    default:
        return <span>{item.title}</span>;
    }
}

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
            {renderContent(item)}
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