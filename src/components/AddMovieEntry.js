import React, { useState } from 'react';

function AddEntry({ onAdd }) {
const [input, setInput] = useState('');
const [searchResults, setSearchResults] = useState([]);

const handleSearch = async () => {
    if (input.trim() === '') return;

    try {
    const response = await fetch(
        `http://www.omdbapi.com/?apikey=7a4988db&s=${encodeURIComponent( //I know my API key shouldn't be public here but I'm speedin'
        input
        )}`
    );

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    setSearchResults(data.Search || []);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const handleAdd = (movie) => {
    onAdd({
        type: movie.Type,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
        consumed: false });
    setInput('');
    setSearchResults([]);
};

return (
    <div className="p-4">
    <div className="flex items-center mb-4">
        <input
        type="text"
        className="border rounded p-2 flex-1 mr-2"
        placeholder="Search for a movie..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        />
        <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSearch}
        >
        Search
        </button>
    </div>
    {searchResults.length > 0 && (
        <ul className="space-y-2">
        {searchResults.map((movie) => (
            <li
            key={movie.imdbID}
            className="p-2 border rounded flex justify-between items-center"
            >
            <div className="flex items-center">
                {movie.Poster !== 'N/A' && (
                    <img src={movie.Poster} alt={movie.Title} className="w-12 h-16 mr-4" />
                )}
                <div>
                    <h3 className="text-lg font-semibold">{movie.Title}</h3>
                    <p className="text-sm text-gray-500">{movie.Year}</p>
                </div>
                </div>
                <button
                className="px-2 py-1 bg-green-500 text-white rounded"
                onClick={() => handleAdd(movie)}
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