import React, { useEffect, useState } from 'react';
import { db, storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import './BoxesDisplay.css';

function BoxesDisplay() {
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
                return { id: doc.id, imageUrl, ...data };
            }));
            setBoxes(boxesData);
        };

        fetchBoxes();
    }, []);

    return (
        <div className="boxesDisplay">
            {boxes.map((box) => (
                <div key={box.id} className="box">
                    <img src={box.imageUrl || 'https://firebasestorage.googleapis.com/v0/b/tgtg-af1a6.appspot.com/o/images%2Ftransparency_demonstration_1.png?alt=media&token=dde7538e-df6d-47f8-ae0b-4c0df81c4b8d'} alt={box.type} />
                    <div className="boxDetails">
                        <h3>{box.type}</h3>
                        <p>Product Name: {box.productName}</p>
                        <p>Origin Price: ${box.originPrice}</p>
                        <p>Notes: {box.notes}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default BoxesDisplay;