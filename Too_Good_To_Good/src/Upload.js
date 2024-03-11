import React, { useState } from "react";
import './Upload.css';
import { Link, useHistory } from "react-router-dom";
import { db } from "./firebase";

function Upload() {
    const history = useHistory();
    const [type, setType] = useState('');
    const [productName, setProductName] = useState('');
    const [originPrice, setOriginPrice] = useState('');
    const [notes, setNotes] = useState('');

    const Upload = (e) => {
        e.preventDefault();

        // Upload data to Firestore
        db.collection('box').add({
            type: type,
            productName: productName,
            originPrice: originPrice,
            notes: notes
        })
        .then(() => {
            console.log("Document successfully uploaded!");
            // Optionally, redirect the user to another page after successful upload
            history.push('/'); // Redirect to the home page
        })
        .catch((error) => {
            console.error("Error uploading document: ", error);
            // Handle errors here, such as displaying an error message to the user
        });
    }

    return (
        <div className='upload'>
            <Link to='/'>
                <img className="upload_logo" src={require('./Toogoodtogo.png')} />
            </Link>
            <div className="login_container">
                <h1>Welcome, User</h1>
                <form onSubmit={Upload}>
                    <br />
                    <h3>Add your box by filling out the information below!</h3>
                    <h5>Type:</h5>
                    <input type='text' value={type} onChange={e => setType(e.target.value)} />
                    <h5>Product Name:</h5>
                    <input type='text' value={productName} onChange={e => setProductName(e.target.value)} />
                    <h5>Origin Price:</h5>
                    <input type='text' value={originPrice} onChange={e => setOriginPrice(e.target.value)} />
                    <h5>Notes:</h5>
                    <input type='text' value={notes} onChange={e => setNotes(e.target.value)} />
                    <button type='submit' className='login_signInButton'>Upload</button>
                </form>
            </div>
        </div>
    )
}

export default Upload;
