
import React, { useState } from 'react';

function AddEntry({ onAdd }) {
const [input, setInput] = useState('');
const [searchResults, setSearchResults] = useState([]);

const handleSearch = async (type) => {
    if (input.trim() === '') return;

    try {
    let url = '';
    if (type === 'book') {
        url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(input)}&key=AIzaSyCFS2HYGV8PvquEr848VTF_6mAMkF6wBQk`;
    } else if (type === 'movie') {
        url = `http://www.omdbapi.com/?apikey=7a4988db&s=${encodeURIComponent(input)}`;
    }

    if (url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        setSearchResults(type === 'book' ? data.items || [] : data.Search || []);
    }
    } catch (error) {
    console.error('Error fetching data:', error);
    }
};

const handleAdd = (item) => {
    // Determine whether the item is a book, movie, or plaintext based on its structure
    if (item.volumeInfo) { // Book structure
    onAdd({
        type: 'book',
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author',
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
        consumed: false
    });
    } else if (item.Title) { // Movie structure
    onAdd({
        type: 'movie',
        title: item.Title,
        year: item.Year,
        poster: item.Poster,
        consumed: false
    });
    } else { // Plain text
        if (input.trim() === '') return;
        onAdd({ type: 'plaintext', title: input, consumed: false });
    }

    setInput('');
    setSearchResults([]);
};

return (
    <div className="p-4">
    <div className="flex items-center mb-4">
        <input
        type="text"
        className="border rounded p-2 flex-1 mr-2"
        placeholder="Enter a title..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        />
        <button
        className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
        onClick={() => handleSearch('book')}
        >
        Search Book
        </button>
        <button
        className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
        onClick={() => handleSearch('movie')}
        >
        Search Movie
        </button>
        <button
        className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => handleAdd({ type: 'plaintext' })}
        >
        Add Text
        </button>
    </div>

    {searchResults.length > 0 && (
        <ul className="space-y-2">
        {searchResults.map((item) => (
            <li
            key={item.id || item.imdbID} // Use a unique key
            className="p-2 border rounded flex justify-between items-center"
            >
            <div className="flex items-center">
                {item.volumeInfo?.imageLinks?.thumbnail && (
                <img src={item.volumeInfo.imageLinks.thumbnail} alt={item.volumeInfo.title} className="w-12 h-16 mr-4" />
                )}
                {item.Poster && item.Poster !== 'N/A' && (
                <img src={item.Poster} alt={item.Title} className="w-12 h-16 mr-4" />
                )}
                <div>
                <h3 className="text-lg font-semibold">{item.volumeInfo ? item.volumeInfo.title : item.Title}</h3>
                {item.volumeInfo?.authors && (
                    <p className="text-sm text-gray-500">
                    {item.volumeInfo.authors.join(', ')}
                    </p>
                )}
                {item.Year && <p className="text-sm text-gray-500">{item.Year}</p>}
                </div>
            </div>
            <button
                className="px-2 py-1 bg-green-500 text-white rounded"
                onClick={() => handleAdd(item)}
            >
                Add
            </button>
            </li>
        ))}
        </ul>
    )}
    </div>
);
}

export default AddEntry;