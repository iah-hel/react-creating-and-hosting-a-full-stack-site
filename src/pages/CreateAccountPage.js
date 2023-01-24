import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth"

const CreateAccountPage = () =>{
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPasswrod,setConfirmPasswrod] = useState('');
    
    const [error,setError] = useState('');

    const navigate = useNavigate();

    const createAccount = async() =>{
        try {
            if(password !== confirmPasswrod ){
                setError("Password and confirm password do not match");
                return;
            }

            await createUserWithEmailAndPassword(getAuth(),email,password);
            navigate('/articles');

        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <>
        <h1>Create Account</h1>
        {error && <p className="error">{error}</p>}

        <input value={email} placeholder="Your email address" onChange={e=>setEmail(e.target.value)}/>
        
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        
        <input type="password" placeholder="Re-enter your password" value={confirmPasswrod} onChange={e=>setConfirmPasswrod(e.target.value)} />
        
        <button onClick={createAccount}>Create Account</button>
        
        <Link to="/login">Already have an account? Log in here</Link>
        </>

    );
}

export default CreateAccountPage;