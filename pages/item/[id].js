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

    if (!item) {
        return <p className={styles.loading}>Loading...</p>;
    }

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
                            <h2>{movieDetails.Title}</h2>
                            <p><strong>Year:</strong> {movieDetails.Year}</p>
                            <p><strong>Runtime:</strong> {movieDetails.Runtime}</p>
                            <p><strong>Genre:</strong> {movieDetails.Genre}</p>
                            <p><strong>Director:</strong> {movieDetails.Director}</p>
                            <p><strong>Writer:</strong> {movieDetails.Writer}</p>
                            <p><strong>Actors:</strong> {movieDetails.Actors}</p>
                            <p><strong>Plot:</strong> {movieDetails.Plot}</p>
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
                            <h2>{bookDetails.volumeInfo.title}</h2>
                            <p><strong>Authors:</strong> {bookDetails.volumeInfo.authors.join(', ')}</p>
                            <p><strong>Published Date:</strong> {bookDetails.volumeInfo.publishedDate}</p>
                            <p><strong>Publisher:</strong> {bookDetails.volumeInfo.publisher}</p>
                            <p><strong>Description:</strong> {bookDetails.volumeInfo.description}</p>
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
                    <button className={styles.buttonSave} onClick={handleSaveNotes}>
                        Save Notes
                    </button>
                </>
            ) : (
                <>
                    <p className={styles.notesText}>{item.notes || 'No notes available.'}</p>
                    <button className={styles.button} onClick={() => setIsEditingNotes(true)}>
                        Edit Notes
                    </button>
                </>
            )}
            <button className={styles.buttonBack} onClick={() => router.push('/')}>
                Back to List
            </button>
            <button className={styles.button} onClick={handleToggleConsumed}>
                {item.consumed ? 'Mark as Unconsumed' : 'Mark as Consumed'}
            </button>
            <button className={styles.buttonDelete} onClick={handleDeleteItem}>
                Delete Item
            </button>
        </div>
    );
}

export default ItemPage;