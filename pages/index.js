import React, { useState, useEffect } from 'react';
import List from '../src/components/List';
import Navbar from '../src/components/Navbar';
import AddEntryUnified from '../src/components/AddEntryUnified';
import { useSession, signIn } from 'next-auth/react';
import styles from './Home.module.css'; // Import the CSS module
import Image from 'next/image'; // Import the Image component from Next.js
import logo from '../public/logo.png'; // Import the logo image

export default function Home() {
  const [items, setItems] = useState([]);
  const { data: session, status } = useSession();

  // Fetch items from localStorage when the component mounts
  useEffect(() => {
    const fetchItems = () => {
      if (session) {
        const savedItems = localStorage.getItem(`user_items_${session.user.id}`);
        setItems(savedItems ? JSON.parse(savedItems) : []);
      }
    };
    fetchItems();
  }, [session]);

  // Save items to localStorage whenever they change
  useEffect(() => {
    if (session) {
      console.log('Saving items to localStorage:', items);
      localStorage.setItem(`user_items_${session.user.id}`, JSON.stringify(items));
    }
  }, [items, session]);

  // Handle adding an item (mocked as a local action)
  const handleAddItem = (item) => {
    const newItem = { ...item, id: new Date().toISOString(), user_id: session.user.id };
    setItems([...items, newItem]);
  };

  // Toggle the consumed status of an item
  const handleToggleConsumed = (index) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, consumed: !item.consumed } : item
    );
    setItems(updatedItems);
  };

  // Handle deleting an item
  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  if (status === 'loading') {
    return <p className={styles.loading}>Loading...</p>; // Optional loading state
  }

  if (!session) {
    return (
      <div className={styles.loginPrompt}>
        <p>You need to be logged in to view your saved items.</p>
        <button onClick={() => signIn('google')} className="button buttonLogin">
          Log in with Google
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Image src={logo} alt="Suspend Logo" className={styles.logo} width={400} height={200} />
      </div>
      <Navbar />
      <AddEntryUnified onAdd={handleAddItem} />
      <List items={items} onToggleConsumed={handleToggleConsumed} onDelete={handleDeleteItem} />
    </div>
  );
}