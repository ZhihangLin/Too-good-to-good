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
            <img className='userbd__image'
                src='https://wp-media.familytoday.com/2013/07/featuredImageId3694.jpg'
                alt=''
            />
            {boxes.map((box) => (
                // Check if EvaluationPrice is not equal to "not decide" before rendering the box
                box.EvaluationPrice !== "not decide" && box.username !== "" && (
                    <div key={box.id} className="box2">
                        <img
                            src='https://tse4.explicit.bing.net/th?id=OIP.iqldYf72fpKKy0NYd9wVkAHaJH&pid=Api&P=0&h=180'
                            alt=''
                        />
                        <div className="boxDetail_">
                            {/* <h3>{box.productName}</h3> */}
                            
                            <p>Type: {box.type}</p>
                            <p>Origin Price: {box.originPrice}</p>
                            <p>Location: {box.location}</p>
                            <p>Notes: {box.notes}</p>
                            <p>Evaluation Price: {box.EvaluationPrice}</p>
                            <p>Belong to: {box.username}</p>
                            <button onClick={() => handleButtonClick(box.id)}>Request For Switch</button>
                        </div>
                    </div>
                )
            ))}
        </div>
    );
    
}

export default Userbd;
