import { signIn, signOut, useSession } from 'next-auth/react';

export default function Navbar() {
const { data: session } = useSession();

return (
    <nav className="p-4">
    {session ? (
        <>
        <p>Welcome, {session.user.name}</p>
        <button onClick={() => signOut()} className="btn">
            Logout
        </button>
        </>
    ) : (
        <button onClick={() => signIn('google')} className="btn">
        Login with Google
        </button>
    )}
    </nav>
);
}