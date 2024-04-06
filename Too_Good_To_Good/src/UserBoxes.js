import React, { useEffect, useState } from 'react';
import { db, storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import './UserBoxes.css';
import { useStateValue } from './StateProvider';

function UserBoxes() {
    const [{ user }] = useStateValue();
    const [userBoxes, setUserBoxes] = useState([]);

    useEffect(() => {
        const fetchUserBoxes = async () => {
            if (!user) return; // If user is not logged in, return

            try {
                const userBoxesRef = db.collection('boxes').where('userId', '==', user.uid);
                const snapshot = await userBoxesRef.get();
                const userBoxesData = await Promise.all(snapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    let imageUrl = '';
                    if (data.imageRef) {
                        imageUrl = await getDownloadURL(ref(storage, data.imageRef));
                    }
                    return { id: doc.id, imageUrl, ...data };
                }));
                setUserBoxes(userBoxesData);
            } catch (error) {
                console.error('Error fetching user boxes:', error);
            }
        };

        fetchUserBoxes();
    }, [user]); // Run useEffect whenever user changes

    const handleValueChange = async (boxId, field, newValue) => {
        try {
            await db.collection('boxes').doc(boxId).update({ [field]: newValue });
            // Update state to reflect the change
            setUserBoxes(prevBoxes =>
                prevBoxes.map(box =>
                    box.id === boxId ? { ...box, [field]: newValue } : box
                )
            );
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        }
    };

    const handleButtonClick = async (boxId) => {
        // Perform action when the button is clicked
        console.log("Button clicked for box:", boxId);
        // You can add your custom logic here
    };

    return (
        // <div>
        //     <h1 className="load">Upload box</h1>

        <div className="boxesDisplay">
            
            {userBoxes.map((box) => (
                <div key={box.id} className="box1">
                    <img src={box.imageUrl || 'https://firebasestorage.googleapis.com/v0/b/tgtg-af1a6.appspot.com/o/images%2Ftransparency_demonstration_1.png?alt=media&token=dde7538e-df6d-47f8-ae0b-4c0df81c4b8d'} alt={box.type} />
                    <div className="boxDetails">
                        <h3>{box.productName}</h3>
                        <p>Type: 
                            <input type="text" value={box.type} onChange={(e) => handleValueChange(box.id, 'type', e.target.value)} />
                        </p>
                        <p>Origin Price: 
                            <input type="number" value={box.originPrice} onChange={(e) => handleValueChange(box.id, 'originPrice', e.target.value)} />
                        </p>
                        <p>Location: 
                            <input type="text" value={box.location} onChange={(e) => handleValueChange(box.id, 'location', e.target.value)} />
                        </p>
                        <p>Notes: 
                            <input type="text" value={box.notes} onChange={(e) => handleValueChange(box.id, 'notes', e.target.value)} />
                        </p>
                        <p>Evaluation Price : 
                            <input type="text" value={box.EvaluationPrice} onChange={(e) => handleValueChange(box.id, 'EvaluationPrice', e.target.value)} />
                        </p>
                        <button onClick={() => handleButtonClick(box.id)}>Update</button>
                    </div>
                </div>
            ))}
        </div>
        // </div>
    );
}

export default UserBoxes;