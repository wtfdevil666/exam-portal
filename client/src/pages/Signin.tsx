
export default function Signin() {

    const signInWithGoogle = () => {
        window.open('http://localhost:3000/api/auth/oauth', '_self');
    }

    

    return (
        <div>
            <h1>Sign in</h1>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    );
}
