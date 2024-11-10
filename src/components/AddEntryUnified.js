import React, { useState } from 'react';
import styles from './AddEntryUnified.module.css'; // Import the CSS Module

function AddEntry({ onAdd }) {
const [input, setInput] = useState('');
const [searchResults, setSearchResults] = useState([]);

const handleSearch = async (type) => {
    if (input.trim() === '') return;

    try {
    let url = '';
    let options = {};
    if (type === 'book') {
        url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        input
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`;
    } else if (type === 'movie') {
        url = `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&s=${encodeURIComponent(
        input
        )}`;
    } else if (type === 'album') {
        url = `https://osdb-api.confidence.sh/rest/${process.env.NEXT_PUBLIC_OSDB_API_KEY}/search/album?query=${encodeURIComponent(input)}&limit=10`;
    } else if (type === 'podcast') {
        url = 'https://api.taddy.org';
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-USER-ID': process.env.NEXT_PUBLIC_TADDY_USER_ID,
                'X-API-KEY': process.env.NEXT_PUBLIC_TADDY_API_KEY,
            },
            body: JSON.stringify({
                query: `{ getPodcastSeries(name:"${input}") { uuid name description imageUrl itunesInfo { uuid publisherName baseArtworkUrlOf(size: 640) } } }`,
            }),
        };
        console.log('Podcast search options:', options); // Add this line
    }

    if (url) {
        const response = await fetch(url, options);
        console.log('Podcast search response:', response); // Add this line
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${errorText}`);
        }

        const data = await response.json();
        console.log('Podcast search data:', data); // Add this line
        setSearchResults(
        type === 'podcast' ? (Array.isArray(data.data.getPodcastSeries) ? data.data.getPodcastSeries : [data.data.getPodcastSeries]) : type === 'album' ? data.data || [] : type === 'book' ? data.items || [] : data.Search || []
        );
    }
    } catch (error) {
    console.error('Error fetching data:', error);
    alert(`Error fetching data: ${error.message}`);
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
        notes: '', // Add notes field
    });
    } else if (item.Title) {
    // Movie structure
    onAdd({
        type: 'movie',
        title: item.Title,
        year: item.Year,
        poster: item.Poster,
        imdbID: item.imdbID, // Ensure imdbID is stored
        consumed: false,
        notes: '', // Add notes field
    });
    } else if (item.name && item.artist) {
        // Album structure
        onAdd({
            type: 'album',
            title: item.name,
            artist: item.artist.map(a => a.name).join(', '),
            year: item.year,
            image: item.image,
            consumed: false,
            notes: '', // Add notes field
        });
    } else if (item.name && item.itunesInfo) {
        // Podcast structure
        onAdd({
            type: 'podcast',
            title: item.name,
            publisher: item.itunesInfo.publisherName,
            image: item.imageUrl,
            consumed: false,
            notes: '', // Add notes field
        });
    } else {
    // Plain text
    if (input.trim() === '') return;
    onAdd({ type: 'plaintext', title: input, consumed: false, notes: '' }); // Add notes field
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
        </div>
        <div className={styles.buttonContainer}>
            <button
                className={`button ${styles.buttonSearch}`}
                onClick={() => handleSearch('book')}
            >
                Book
            </button>
            <button
                className={`button ${styles.buttonSearch}`}
                onClick={() => handleSearch('movie')}
            >
                Movie
            </button>
            <button
                className={`button ${styles.buttonSearch}`}
                onClick={() => handleSearch('album')}
            >
                Album
            </button>
            <button
                className={`button ${styles.buttonSearch}`}
                onClick={() => handleSearch('podcast')}
            >
                Podcast
            </button>
            <button
                className="button"
                onClick={() => handleAdd({ type: 'plaintext' })}
            >
                Note
            </button>
        </div>
        {searchResults.length > 0 && (
            <ul className={styles.resultsList}>
                {searchResults.map((item) => (
                    <li
                        key={item.id || item.imdbID || item.uuid}
                        className={styles.resultItem}
                    >
                        <div className={styles.resultContent}>
                            <div className={styles.thumbnailContainer}>
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
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className={styles.thumbnail}
                                    />
                                )}
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className={styles.thumbnail}
                                    />
                                )}
                            </div>
                            <div className={styles.infoContainer}>
                                <h3 className={styles.title}>
                                    {item.volumeInfo
                                        ? item.volumeInfo.title
                                        : item.Title || item.name}
                                </h3>
                                {item.volumeInfo?.authors && (
                                    <p className={styles.subtitle}>
                                        {item.volumeInfo.authors.join(', ')}
                                    </p>
                                )}
                                {item.Year && (
                                    <p className={styles.subtitle}>{item.Year}</p>
                                )}
                                {item.artist && (
                                    <p className={styles.subtitle}>{item.artist.map(a => a.name).join(', ')}</p>
                                )}
                                {item.itunesInfo?.publisherName && (
                                    <p className={styles.subtitle}>{item.itunesInfo.publisherName}</p>
                                )}
                            </div>
                        </div>
                        <button
                            className={`button ${styles.buttonAddResult}`}
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