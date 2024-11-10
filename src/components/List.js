import React from 'react';
import styles from './List.module.css';

function List({ items, onToggleConsumed, onDelete }) {

    function renderContent(item) {
    switch (item.type) {
        case 'movie':
        case 'series':
        return (
            <div className={styles.listContent}>
            {item.poster && (
                <img src={item.poster} alt={item.title} className={styles.listImg} />
            )}
            <div>
                <h3 className={styles.listTitleText}>{item.title}</h3>
                <p className={styles.listSubtext}>{item.year}</p>
            </div>
            </div>
        );

        case 'book':
        return (
            <div className={styles.listContent}>
            {item.thumbnail && (
                <img src={item.thumbnail} alt={item.title} className={styles.listImg} />
            )}
            <div>
                <h3 className={styles.listTitleText}>{item.title}</h3>
                <p className={styles.listSubtext}>
                {item.authors || 'Unknown Author'}
                </p>
            </div>
            </div>
        );

        default:
        return <span>{item.title}</span>;
    }
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
            >
                {renderContent(item)}
                <div>
                <button
                    className={`${styles.button} ${styles.buttonCheck}`}
                    onClick={() => onToggleConsumed(index)}
                >
                    {item.consumed ? 'Uncheck' : 'Check'}
                </button>
                <button
                    className={`${styles.button} ${styles.buttonDelete}`}
                    onClick={() => onDelete(index)}
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