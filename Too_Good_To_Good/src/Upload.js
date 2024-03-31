import React, { useState } from "react";
import './Upload.css';
import { Link, useHistory } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";

import { db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useStateValue} from "./StateProvider";


function Upload() {
    const history = useHistory();
    const [{ user }, dispatch] = useStateValue();

    const [type, setType] = useState('');
    const [productName, setProductName] = useState('');
    const [location, setLocation] = useState('');

    const [originPrice, setOriginPrice] = useState('');
    const [notes, setNotes] = useState('');
    const [uploadPicture, setUploadPicture] = useState(null);

    const handleFileChange = (event) => {
        if (event.target.files[0]) {
            setUploadPicture(event.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!type || !productName || !originPrice || !uploadPicture || !location) {
            alert("Please fill out all required fields.");
            return;
        }

    
        const imageRef = ref(storage, `images/${uploadPicture.name}`);
        uploadBytes(imageRef, uploadPicture).then((snapshot) => {
            console.log('Image uploaded successfully!');

           
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                
                
                addDoc(collection(db, "boxes"), { 
                    type: type,
                    productName: productName,
                    location: location,
                    originPrice: originPrice,
                    notes: notes,
                    imageUrl: downloadURL,
                    EvaluationPrice: "not decide",
                }).then(() => {
                    console.log("Document successfully uploaded with image URL!");
                    history.push('/');
                }).catch((error) => {
                    console.error("Error uploading document: ", error);
                });
            });
        }).catch((error) => {
            console.error("Error uploading image: ", error);
        });
    };

    return (
        <div className="upload">
            <Link to='/'>
                <img className="upload_logo" src={require('./Toogoodtogo.png')} alt="Logo" />
            </Link>
            <div className="login_container">
                <h1 className="email_">Welcome, {user ? user.displayName : 'Guest'}</h1>
                <form onSubmit={handleSubmit}>
                    
                    <h3>Add your box by filling out the information below!</h3>
                    <br></br>
                    <h4>Upload Picture:</h4>
                    <input type="file" onChange={handleFileChange} />
                    <h5>Type:</h5>
                    <input type='text' value={type} onChange={e => setType(e.target.value)} />
                    <h5>Product Name:</h5>
                    <input type='text' value={productName} onChange={e => setProductName(e.target.value)} />
                    <h5>Location:</h5>
                    <input type='text' value={location} onChange={e => setLocation(e.target.value)} />
                    <h5>Origin Price:</h5>
                    <input type='text' value={originPrice} onChange={e => setOriginPrice(e.target.value)} />
                    <h5>Notes:</h5>
                    <input type='text' value={notes} onChange={e => setNotes(e.target.value)} />
                    <button type='submit' className='login_signInButton'>Upload</button>
                </form>
            </div>
        </div>

    );
}

export default Upload;
