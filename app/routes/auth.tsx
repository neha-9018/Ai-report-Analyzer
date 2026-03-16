import React, {useEffect} from "react";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";
export const meta:() => any = () => ([
    {title: 'Resumind | AUth'},
    { name: 'description', content: 'log into your account'}
])

const Auth: () => React.JSX.Element = () => {
    const { isLoading , auth} = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(()=>{
     if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated,next])
    return (
        <main className= "bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen px-6 md:px-10">
        <div className="gradient-border shadow-lg">
            <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1> Welcome</h1>
                    <h2>log in to Continue your job journey</h2>
                </div>
                <div>
                    {isLoading ? (
                        <button className="auth-button animate-pulse">
                            <p>signing you in...</p>
                        </button>
                    ):(
                        <>
                            {auth.isAuthenticated ? (
                                <button className="auth-button " onClick={auth.signOut}>
                                   <p>log Out</p>
                                </button>
                            ):(
                                <button className="auth-button " onClick={auth.signIn}>
                                    <p>log in</p>
                                </button>

                                )}
                        </>
                    )}
                </div>
            </section>
        </div>
        </main>

    );
}

export default Auth;