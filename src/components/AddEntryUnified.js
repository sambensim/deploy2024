import React, { useState } from 'react';
import styles from './AddEntryUnified.module.css'; // Import the CSS Module

function AddEntry({ onAdd }) {
const [input, setInput] = useState('');
const [searchResults, setSearchResults] = useState([]);

const handleSearch = async (type) => {
    if (input.trim() === '') return;

    try {
    let url = '';
    if (type === 'book') {
        url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        input
        )}&key=${process.env.REACT_APP_GOOGLE_BOOKS_API_KEY}`;
    } else if (type === 'movie') {
        url = `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${encodeURIComponent(
        input
        )}`;
    }

    if (url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        setSearchResults(
        type === 'book' ? data.items || [] : data.Search || []
        );
    }
    } catch (error) {
    console.error('Error fetching data:', error);
    }
};

const handleAdd = (item) => {
    // Determine whether the item is a book, movie, or plaintext based on its structure
    if (item.volumeInfo) {
    // Book structure
    onAdd({
        type: 'book',
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors
        ? item.volumeInfo.authors.join(', ')
        : 'Unknown Author',
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
        consumed: false,
    });
    } else if (item.Title) {
    // Movie structure
    onAdd({
        type: 'movie',
        title: item.Title,
        year: item.Year,
        poster: item.Poster,
        consumed: false,
    });
    } else {
    // Plain text
    if (input.trim() === '') return;
    onAdd({ type: 'plaintext', title: input, consumed: false });
    }

    setInput('');
    setSearchResults([]);
};

return (
    <div className={styles.container}>
    <div className={styles.searchContainer}>
        <input
        type="text"
        className={styles.inputField}
        placeholder="Enter a title..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        />
        <button
        className={`${styles.button} ${styles.buttonSearch}`}
        onClick={() => handleSearch('book')}
        >
        Search Book
        </button>
        <button
        className={`${styles.button} ${styles.buttonSearch}`}
        onClick={() => handleSearch('movie')}
        >
        Search Movie
        </button>
        <button
        className={`${styles.button} ${styles.buttonAdd}`}
        onClick={() => handleAdd({ type: 'plaintext' })}
        >
        Add Text
        </button>
    </div>

    {searchResults.length > 0 && (
        <ul className={styles.resultsList}>
        {searchResults.map((item) => (
            <li
            key={item.id || item.imdbID}
            className={styles.resultItem}
            >
            <div className={styles.resultContent}>
                {item.volumeInfo?.imageLinks?.thumbnail && (
                <img
                    src={item.volumeInfo.imageLinks.thumbnail}
                    alt={item.volumeInfo.title}
                    className={styles.thumbnail}
                />
                )}
                {item.Poster && item.Poster !== 'N/A' && (
                <img
                    src={item.Poster}
                    alt={item.Title}
                    className={styles.thumbnail}
                />
                )}
                <div>
                <h3 className={styles.title}>
                    {item.volumeInfo
                    ? item.volumeInfo.title
                    : item.Title}
                </h3>
                {item.volumeInfo?.authors && (
                    <p className={styles.subtitle}>
                    {item.volumeInfo.authors.join(', ')}
                    </p>
                )}
                {item.Year && (
                    <p className={styles.subtitle}>{item.Year}</p>
                )}
                </div>
            </div>
            <button
                className={styles.buttonAddResult}
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