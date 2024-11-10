// import React, { useState, useEffect } from 'react';
// import List from '../src/components/List';
// import Navbar from '../src/components/Navbar';
// import AddEntry from '../src/components/AddEntry';
// import AddMovieEntry from '../src/components/AddMovieEntry';
// import AddBookEntry from '../src/components/AddBookEntry';
// import { useSession, signIn } from 'next-auth/react';
// import supabase from '../src/supabaseClient'; // Import the Supabase client

// export default function Home() {
// const [items, setItems] = useState([]);
// const { data: session, status } = useSession();

// // Fetch items from Supabase when the user session is available
// useEffect(() => {
//     const fetchItems = async () => {
//     if (session) {
//         try {
//         const { data: items, error } = await supabase
//             .from('user_items')
//             .select('*')
//             .eq('user_id', session.user.id);

//         if (error) throw error;
//         setItems(items);
//         } catch (error) {
//         console.error('Error fetching items:', error);
//         }
//     }
//     };

//     fetchItems();
// }, [session]);

// // Save items to localStorage whenever they change
// useEffect(() => {
//     localStorage.setItem('items', JSON.stringify(items));
// }, [items]);

// // Handle adding an item to Supabase
// const handleAddItem = async (item) => {
//     try {
//     const { data, error } = await supabase
//         .from('user_items')
//         .insert([{ ...item, user_id: session.user.id }]);

//     if (error) throw error;
//     setItems([...items, data[0]]);
//     } catch (error) {
//     console.error('Error adding item:', error);
//     }
// };

// // Toggle the consumed status of an item
// const handleToggleConsumed = async (index) => {
//     const updatedItem = { ...items[index], consumed: !items[index].consumed };

//     try {
//     const { data, error } = await supabase
//         .from('user_items')
//         .update({ consumed: updatedItem.consumed })
//         .eq('id', updatedItem.id);

//     if (error) throw error;
//     setItems(items.map((item, i) => (i === index ? data[0] : item)));
//     } catch (error) {
//     console.error('Error updating item:', error);
//     }
// };

// // Handle deleting an item from Supabase
// const handleDeleteItem = async (index) => {
//     const itemToDelete = items[index];

//     try {
//     const { error } = await supabase
//         .from('user_items')
//         .delete()
//         .eq('id', itemToDelete.id);

//     if (error) throw error;
//     setItems(items.filter((_, i) => i !== index));
//     } catch (error) {
//     console.error('Error deleting item:', error);
//     }
// };

// if (status === 'loading') {
//     return <p>Loading...</p>; // Optional loading state
// }

// if (!session) {
//     return (
//     <div style={{ textAlign: 'center', padding: '20px' }}>
//         <p>You need to be logged in to view your saved items.</p>
//         <button onClick={() => signIn('google')} className="btn">
//         Log in with Google
//         </button>
//     </div>
//     );
// }

// return (
//     <div className="max-w-md mx-auto p-4">
//     <h1 className="text-3xl font-bold mb-4 text-center">Suspend</h1>
//     <Navbar />
//     <AddMovieEntry onAdd={handleAddItem} />
//     <AddBookEntry onAdd={handleAddItem} />
//     <AddEntry onAdd={handleAddItem} />
//     <List
//         items={items}
//         onToggleConsumed={handleToggleConsumed}
//         onDelete={handleDeleteItem}
//     />
//     </div>
// );
// }

import React, { useState, useEffect } from 'react';
import List from '../src/components/List';
import Navbar from '../src/components/Navbar';
import AddEntryUnified from '../src/components/AddEntryUnified';
import { useSession, signIn } from 'next-auth/react';

export default function Home() {
const [items, setItems] = useState([]);
const { data: session, status } = useSession();

// Fetch items from localStorage when the component mounts
useEffect(() => {
    const fetchItems = () => {
    if (session) {
        const savedItems = localStorage.getItem('user_items');
        setItems(savedItems ? JSON.parse(savedItems) : []);
    }
    };
    fetchItems();
}, [session]);

// Save items to localStorage whenever they change
useEffect(() => {
    localStorage.setItem('user_items', JSON.stringify(items));
}, [items]);

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
    return <p>Loading...</p>; // Optional loading state
}

if (!session) {
    return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>You need to be logged in to view your saved items.</p>
        <button onClick={() => signIn('google')} className="btn">
        Log in with Google
        </button>
    </div>
    );
}

return (
    <div className="max-w-md mx-auto p-4">
    <h1 className="text-3xl font-bold mb-4 text-center">Suspend</h1>
    <Navbar />
    <AddEntryUnified onAdd={handleAddItem} />
    <List
        items={items}
        onToggleConsumed={handleToggleConsumed}
        onDelete={handleDeleteItem}
    />
    </div>
);
}