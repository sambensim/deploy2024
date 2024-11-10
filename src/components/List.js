import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './List.module.css';

function List({ items, onToggleConsumed, onDelete }) {
    const router = useRouter();
    const [filterVisible, setFilterVisible] = useState(false);
    const [filters, setFilters] = useState({
        movie: true,
        series: true,
        book: true,
        album: true,
        podcast: true,
        link: true,
        plaintext: true,
        consumed: true,
    });
    const filterDropdownRef = useRef(null);
    const filterPlaceholderRef = useRef(null);

    useEffect(() => {
        if (filterDropdownRef.current && filterPlaceholderRef.current) {
            filterPlaceholderRef.current.style.height = filterVisible
                ? `${filterDropdownRef.current.scrollHeight}px`
                : '0';
        }
    }, [filterVisible]);

    const handleItemClick = (id) => {
        router.push(`/item/${id}`);
    };

    const handleFilterChange = (type) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [type]: !prevFilters[type],
        }));
    };

    const handleSelectAll = () => {
        const allSelected = Object.values(filters).every((value) => value);
        setFilters((prevFilters) => {
            const newFilters = {};
            Object.keys(prevFilters).forEach((key) => {
                newFilters[key] = !allSelected;
            });
            return newFilters;
        });
    };

    const filteredItems = items
        .filter((item) => filters[item.type] && (filters.consumed || !item.consumed))
        .sort((a, b) => a.consumed - b.consumed); // Ensure consumed items are at the bottom

    function renderIcon(type) {
        switch (type) {
            case 'movie':
                return <span className={styles.icon}>🎬</span>; // Placeholder for movie icon
            case 'series':
                return <span className={styles.icon}>📺</span>; // Placeholder for series icon
            case 'book':
                return <span className={styles.icon}>📚</span>; // Placeholder for book icon
            case 'album':
                return <span className={styles.icon}>🎵</span>; // Placeholder for album icon
            case 'podcast':
                return <span className={styles.icon}>🎙️</span>; // Placeholder for podcast icon
            case 'link':
                return <span className={styles.icon}>🔗</span>; // Placeholder for link icon
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
                {item.image && <img src={item.image} alt={item.title} className={styles.listImg} />}
                {item.imageUrl && <img src={item.imageUrl} alt={item.title} className={styles.listImg} />}
                {item.favicon && <img src={item.favicon} alt={item.title} className={styles.listImg} />}
                <div>
                    <h3 className={styles.listTitleText}>{item.title}</h3>
                    {item.notes ? (
                        <p className={styles.listSubtext}>{item.notes}</p>
                    ) : (
                        <p className={styles.listSubtext}>
                            {item.type === 'link' ? item.url : item.year || item.authors || item.publisher || 'Unknown'}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.listContainer}>
            <h2 className={styles.listTitle}>My List</h2>
            <button
                className={styles.filterButton}
                onClick={() => setFilterVisible(!filterVisible)}
            >
                Filter
            </button>
            <div
                ref={filterDropdownRef}
                className={`${styles.filterDropdown} ${filterVisible ? styles.show : ''}`}
            >
                <div className={styles.filterToggle} onClick={handleSelectAll}>
                    {Object.values(filters).every((value) => value) ? 'Deselect All' : 'Select All'}
                </div>
                {Object.keys(filters).map((type) => (
                    <label key={type} className={styles.filterOption}>
                        <input
                            type="checkbox"
                            checked={filters[type]}
                            onChange={() => handleFilterChange(type)}
                        />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                ))}
            </div>
            <div ref={filterPlaceholderRef} className={styles.filterPlaceholder}></div>
            {filteredItems.length > 0 ? (
                <ul>
                    {filteredItems.map((item, index) => (
                        <li
                            key={index}
                            className={`${styles.listItem} ${item.consumed ? styles.consumed : ''}`}
                            onClick={() => handleItemClick(item.id)}
                        >
                            {renderContent(item)}
                            {/* Remove check/uncheck and delete buttons */}
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