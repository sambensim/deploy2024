// pages/auth/error.js
import { useRouter } from 'next/router';

export default function AuthError() {
const router = useRouter();
const { error } = router.query;

return (
    <div>
    <h1>Authentication Error</h1>
    <p>{error ? `Error: ${error}` : "An unknown error occurred during authentication."}</p>
    </div>
);
}