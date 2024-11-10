import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import styles from './ItemPage.module.css';

function ItemPage() {
    const router = useRouter();
    const { id } = router.query;
    const { data: session } = useSession();
    const [item, setItem] = useState(null);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [movieDetails, setMovieDetails] = useState(null);
    const [bookDetails, setBookDetails] = useState(null);
    const [albumDetails, setAlbumDetails] = useState(null);
    const [podcastDetails, setPodcastDetails] = useState(null);
    const [expandedItems, setExpandedItems] = useState({});

    useEffect(() => {
        if (id && session) {
            const savedItems = JSON.parse(localStorage.getItem(`user_items_${session.user.id}`)) || [];
            const foundItem = savedItems.find((item) => item.id === id);
            setItem(foundItem);

            if (foundItem) {
                if (foundItem.type === 'movie') {
                    fetchMovieDetails(foundItem.imdbID);
                } else if (foundItem.type === 'book') {
                    fetchBookDetails(foundItem.title);
                } else if (foundItem.type === 'album') {
                    fetchAlbumDetails(foundItem.title);
                } else if (foundItem.type === 'podcast') {
                    fetchPodcastDetails(foundItem.title);
                }
            }
        }
    }, [id, session]);

    const fetchMovieDetails = async (imdbID) => {
        try {
            console.log('Fetching movie details for imdbID:', imdbID);
            const response = await fetch(`https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&i=${imdbID}`);
            const responseText = await response.text();
            console.log('Raw movie details response:', responseText);
            const data = JSON.parse(responseText);
            console.log('Parsed movie details:', data);
            setMovieDetails(data);
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    const fetchBookDetails = async (title) => {
        try {
            console.log('Fetching book details for title:', title);
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`);
            const data = await response.json();
            console.log('Parsed book details:', data);
            setBookDetails(data.items[0]);
        } catch (error) {
            console.error('Error fetching book details:', error);
        }
    };

    const fetchAlbumDetails = async (title) => {
        try {
            console.log('Fetching album details for title:', title);
            const response = await fetch(`https://osdb-api.confidence.sh/rest/${process.env.NEXT_PUBLIC_OSDB_API_KEY}/search/album?query=${encodeURIComponent(title)}&limit=1`);
            const data = await response.json();
            console.log('Parsed album details:', data);
            setAlbumDetails(data.data[0]);
        } catch (error) {
            console.error('Error fetching album details:', error);
        }
    };

    const fetchPodcastDetails = async (title) => {
        try {
            console.log('Fetching podcast details for title:', title);
            const response = await fetch('https://api.taddy.org', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-USER-ID': process.env.NEXT_PUBLIC_TADDY_USER_ID,
                    'X-API-KEY': process.env.NEXT_PUBLIC_TADDY_API_KEY,
                },
                body: JSON.stringify({
                    query: `{ getPodcastSeries(name:"${title}") { uuid name description imageUrl itunesInfo { uuid publisherName baseArtworkUrlOf(size: 640) } } }`,
                }),
            });
            const data = await response.json();
            console.log('Parsed podcast details:', data);
            if (data.data && data.data.getPodcastSeries) {
                setPodcastDetails(data.data.getPodcastSeries);
            } else {
                throw new Error('Podcast details not found');
            }
        } catch (error) {
            console.error('Error fetching podcast details:', error);
        }
    };

    const handleToggleConsumed = () => {
        const updatedItem = { ...item, consumed: !item.consumed };
        setItem(updatedItem);
        updateLocalStorage(updatedItem);
    };

    const handleDeleteItem = () => {
        const savedItems = JSON.parse(localStorage.getItem(`user_items_${session.user.id}`)) || [];
        const updatedItems = savedItems.filter((i) => i.id !== id);
        localStorage.setItem(`user_items_${session.user.id}`, JSON.stringify(updatedItems));
        router.push('/');
    };

    const handleNotesChange = (e) => {
        const updatedItem = { ...item, notes: e.target.value };
        setItem(updatedItem);
    };

    const handleSaveNotes = () => {
        updateLocalStorage(item);
        setIsEditingNotes(false);
    };

    const updateLocalStorage = (updatedItem) => {
        const savedItems = JSON.parse(localStorage.getItem(`user_items_${session.user.id}`)) || [];
        const updatedItems = savedItems.map((i) => (i.id === id ? updatedItem : i));
        localStorage.setItem(`user_items_${session.user.id}`, JSON.stringify(updatedItems));
    };

    const handleToggleExpand = (id) => {
        setExpandedItems((prevExpandedItems) => ({
            ...prevExpandedItems,
            [id]: !prevExpandedItems[id],
        }));
    };

    const truncateText = (text, length) => {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };

    if (!item) {
        return <p className={styles.loading}>Loading...</p>;
    }

    const isExpanded = expandedItems[item.id];
    const description = item.notes || item.bodyText || '';

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{item.title}</h1>
            <div className={styles.detailsContainer}>
                {movieDetails && (
                    <div className={styles.detailsContainer}>
                        <div className={styles.thumbnailContainer}>
                            {item.poster && <img src={item.poster} alt={item.title} className={styles.thumbnail} />}
                        </div>
                        <div className={styles.infoContainer}>
                            <p><strong>Year:</strong> {movieDetails.Year}</p>
                            <p><strong>Runtime:</strong> {movieDetails.Runtime}</p>
                            <p><strong>Genre:</strong> {movieDetails.Genre}</p>
                            <p><strong>Director:</strong> {movieDetails.Director}</p>
                            <p><strong>Writer:</strong> {movieDetails.Writer}</p>
                            <p><strong>Actors:</strong> {movieDetails.Actors}</p>
                            <p><strong>Plot:</strong> {isExpanded ? movieDetails.Plot : truncateText(movieDetails.Plot, 300)}
                                {movieDetails.Plot.length > 100 && (
                                    <button
                                        className={styles.seeMoreButton}
                                        onClick={() => handleToggleExpand(item.id)}
                                    >
                                        {isExpanded ? 'See less' : 'See more'}
                                    </button>
                                )}
                            </p>
                        </div>
                    </div>
                )}
                {bookDetails && (
                    <div className={styles.detailsContainer}>
                        <div className={styles.thumbnailContainer}>
                            {bookDetails.volumeInfo.imageLinks?.thumbnail && (
                                <img src={bookDetails.volumeInfo.imageLinks.thumbnail} alt={bookDetails.volumeInfo.title} className={styles.thumbnail} />
                            )}
                        </div>
                        <div className={styles.infoContainer}>
                            <p><strong>Authors:</strong> {bookDetails.volumeInfo.authors.join(', ')}</p>
                            <p><strong>Published Date:</strong> {bookDetails.volumeInfo.publishedDate}</p>
                            <p><strong>Publisher:</strong> {bookDetails.volumeInfo.publisher}</p>
                            <p><strong>Description:</strong> {isExpanded ? bookDetails.volumeInfo.description : truncateText(bookDetails.volumeInfo.description, 300)}
                                {bookDetails.volumeInfo.description.length > 100 && (
                                    <button
                                        className={styles.seeMoreButton}
                                        onClick={() => handleToggleExpand(item.id)}
                                    >
                                        {isExpanded ? 'See less' : 'See more'}
                                    </button>
                                )}
                            </p>
                        </div>
                    </div>
                )}
                {albumDetails && (
                    <div className={styles.detailsContainer}>
                        <div className={styles.thumbnailContainer}>
                            {albumDetails.image && (
                                <img src={albumDetails.image} alt={albumDetails.name} className={styles.thumbnail} />
                            )}
                        </div>
                        <div className={styles.infoContainer}>
                            <p><strong>Artist:</strong> {albumDetails.artist.map(a => a.name).join(', ')}</p>
                            <p><strong>Year:</strong> {albumDetails.year}</p>
                            <p><strong>Genre:</strong> {albumDetails.genre.map(g => g.name).join(', ')}</p>
                        </div>
                    </div>
                )}
                {podcastDetails && (
                    <div className={styles.detailsContainer}>
                        <div className={styles.thumbnailContainer}>
                            {podcastDetails.imageUrl && (
                                <img src={podcastDetails.imageUrl} alt={podcastDetails.name} className={styles.thumbnail} />
                            )}
                        </div>
                        <div className={styles.infoContainer}>
                            <p><strong>Publisher:</strong> {podcastDetails.itunesInfo.publisherName}</p>
                            <p><strong>Description:</strong> {isExpanded ? podcastDetails.description : truncateText(podcastDetails.description, 300)}
                                {podcastDetails.description.length > 100 && (
                                    <button
                                        className={styles.seeMoreButton}
                                        onClick={() => handleToggleExpand(item.id)}
                                    >
                                        {isExpanded ? 'See less' : 'See more'}
                                    </button>
                                )}
                            </p>
                        </div>
                    </div>
                )}
                {item.type === 'link' && (
                    <div className={styles.detailsContainer}>
                        <div className={styles.thumbnailContainer}>
                            {item.favicon && <img src={item.favicon} alt={item.title} className={styles.thumbnail} />}
                        </div>
                        <div className={styles.infoContainer}>
                            <p><strong>URL:</strong> <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a></p>
                            <p><strong>Sample Text:</strong> {item.bodyText}...</p>
                        </div>
                    </div>
                )}
            </div>
            {isEditingNotes ? (
                <>
                    <textarea
                        className={styles.notes}
                        value={item.notes}
                        onChange={handleNotesChange}
                        placeholder="Add your notes here..."
                    />
                    <button className="button buttonSave" onClick={handleSaveNotes}>
                        Save Notes
                    </button>
                </>
            ) : (
                <>
                    <p className={styles.notesText}>{item.notes || 'No notes available.'}</p>
                </>
            )}
            <div className={styles.buttonContainer}>
                <button className="button" onClick={() => router.push('/')}>
                    Back
                </button>
                <button className="button" onClick={() => setIsEditingNotes(true)}>
                    Edit
                </button>
                <button className="button" onClick={handleToggleConsumed}>
                    {item.consumed ? 'Unconsume' : 'Consumed'}
                </button>
                <button className="button buttonDelete" onClick={handleDeleteItem}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default ItemPage;