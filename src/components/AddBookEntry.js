
    
    import React, { useState } from 'react';

    function AddEntry({ onAdd }) {
    const [input, setInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    
    const handleSearch = async () => {
        if (input.trim() === '') return;
    
        try {
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                input
                )}&key=AIzaSyCFS2HYGV8PvquEr848VTF_6mAMkF6wBQk`
            );
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        
        // Set searchResults to the items array, or an empty array if no results
        setSearchResults(data.items || []);
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    };
    
    const handleAdd = (book) => {
        // Extract necessary book info from volumeInfo
        onAdd({
            type: 'book',
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
            thumbnail: book.volumeInfo.imageLinks?.thumbnail || null, // Save the thumbnail URL
            consumed: false
        });
        setInput('');
        setSearchResults([]);
    };
    
    return (
        <div className="p-4">
        <div className="flex items-center mb-4">
            <input
            type="text"
            className="border rounded p-2 flex-1 mr-2"
            placeholder="Search for a book..."
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
            {searchResults.map((book) => (
                <li
                key={book.id} // Use unique book ID from Google Books API
                className="p-2 border rounded flex justify-between items-center"
                >
                <div className="flex items-center">
                    {/* Display thumbnail if available */}
                    {book.volumeInfo.imageLinks?.thumbnail && (
                    <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} className="w-12 h-16 mr-4" />
                    )}
                    <div>
                    <h3 className="text-lg font-semibold">{book.volumeInfo.title}</h3>
                    <p className="text-sm text-gray-500">
                        {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}
                    </p>
                    </div>
                </div>
                <button
                    className="px-2 py-1 bg-green-500 text-white rounded"
                    onClick={() => handleAdd(book)}
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