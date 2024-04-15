import React, { useEffect, useState } from 'react';
import { db, storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import './Userbd.css';

function Userbd() {
    const [boxes, setBoxes] = useState([]);

    useEffect(() => {
        const fetchBoxes = async () => {
            const snapshot = await db.collection('boxes').get();
            const boxesData = await Promise.all(snapshot.docs.map(async (doc) => {
                const data = doc.data();
                let imageUrl = '';
                if (data.imageRef) {
                    imageUrl = await getDownloadURL(ref(storage, data.imageRef));
                }
                const userSnapshot = await db.collection('boxes').doc(doc.id).collection('userInformation').get();
                let userEmail = '';
                userSnapshot.forEach((doc) => {
                    const userData = doc.data();
                    userEmail = userData.email;
                });
                return { id: doc.id, imageUrl, userEmail, ...data };
            }));
            setBoxes(boxesData);
        };

        fetchBoxes();
    }, []);
    //把这个fucntion改成多加一个user到box information database
    const handleValueChange = async (boxId, field, newValue) => {
        try {
            await db.collection('boxes').doc(boxId).update({ [field]: newValue });
            // Update state to reflect the change
            setBoxes(prevBoxes =>
                prevBoxes.map(box =>
                    box.id === boxId ? { ...box, [field]: newValue } : box
                )
            );
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        }
    };

    const handleButtonClick = async (boxId) => {
        console.log("Button clicked for box:", boxId);

    };

    return (
        <div className="boxesD">
            {boxes.map((box) => (
                <div key={box.id} className="box2">
                     <img
        src='https://tse4.explicit.bing.net/th?id=OIP.iqldYf72fpKKy0NYd9wVkAHaJH&pid=Api&P=0&h=180'
        alt=''
        />
                    {/* <img src={box.imageUrl || 'https://firebasestorage.googleapis.com/v0/b/tgtg-af1a6.appspot.com/o/images%2Ftransparency_demonstration_1.png?alt=media&token=dde7538e-df6d-47f8-ae0b-4c0df81c4b8d'} alt={box.type} /> */}
                    <div className="boxDetail_">
                        {/* <h3>{box.productName}</h3>
                        <p>User's Gmail: {box.userEmail}</p> */}
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
                        <button onClick={() => handleButtonClick(box.id)}>Request For Switch</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Userbd;
