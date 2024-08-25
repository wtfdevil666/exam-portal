
export default function Signin() {

    const signInWithGoogle = () => {
        window.open('http://localhost:3000/api/auth/oauth', '_self');
    }

    

    return (
        <div className="bg-black h-screen w-screen text-white">
            <div className="flex justify-center items-center">
                <h1 className="text-5xl p-6">Sign in</h1>
                <button onClick={signInWithGoogle} className="bg-blue-600 p-6">Sign in with Google</button>
            </div>
        </div>
    );
}
