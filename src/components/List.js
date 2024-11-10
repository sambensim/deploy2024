import React from 'react';
import { useRouter } from 'next/router';
import styles from './List.module.css';

function List({ items, onToggleConsumed, onDelete }) {
    const router = useRouter();

    const handleItemClick = (id) => {
        router.push(`/item/${id}`);
    };

    function renderIcon(type) {
        switch (type) {
            case 'movie':
                return <span className={styles.icon}>🎬</span>; // Placeholder for movie icon
            case 'series':
                return <span className={styles.icon}>📺</span>; // Placeholder for series icon
            case 'book':
                return <span className={styles.icon}>📚</span>; // Placeholder for book icon
            default:
                return <span className={styles.icon}>📄</span>; // Placeholder for default icon
        }
    }

    function renderContent(item) {
        return (
            <div className={styles.listContent}>
                {renderIcon(item.type)}
                {item.poster && <img src={item.poster} alt={item.title} className={styles.listImg} />}
                {item.thumbnail && <img src={item.thumbnail} alt={item.title} className={styles.listImg} />}
                <div>
                    <h3 className={styles.listTitleText}>{item.title}</h3>
                    {item.notes ? (
                        <p className={styles.listSubtext}>{item.notes}</p>
                    ) : (
                        <p className={styles.listSubtext}>
                            {item.year || item.authors || 'Unknown'}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.listContainer}>
            <h2 className={styles.listTitle}>My List</h2>
            {items.length > 0 ? (
                <ul>
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className={`${styles.listItem} ${item.consumed ? styles.consumed : ''}`}
                            onClick={() => handleItemClick(item.id)}
                        >
                            {renderContent(item)}
                            <div>
                                <button
                                    className={`${styles.button} ${styles.buttonCheck}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleConsumed(index);
                                    }}
                                >
                                    {item.consumed ? 'Uncheck' : 'Check'}
                                </button>
                                <button
                                    className={`${styles.button} ${styles.buttonDelete}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(index);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.noItems}>No items in your list.</p>
            )}
        </div>
    );
}

export default List;