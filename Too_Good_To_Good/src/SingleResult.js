import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import './SingleResult.css';

function SingleResult() {
    const { boxId } = useParams();
    const [boxDetails, setBoxDetails] = useState({});
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchBoxDetails = async () => {
            const snapshot = await db.collection('boxes').get();
            const boxesData = await Promise.all(snapshot.docs.map(async (doc) => {
                const data = doc.data();
                let imageUrl = '';
                if (data.imageRef) {
                    imageUrl = await getDownloadURL(ref(storage, data.imageRef));
                }
                return {
                    id: doc.id,
                    imageUrl,
                    ...data
                };
            }));
            // Find the box that matches the boxId
            const foundBox = boxesData.find(box => box.id === boxId);
            if (foundBox) {
                setBoxDetails(foundBox);
                setImageUrl(foundBox.imageUrl);
            } else {
                console.log('No such document!');
            }
        };

        fetchBoxDetails();
    }, [boxId]);

    return (
        <div className="singleResult">
            <img src={imageUrl || 'https://firebasestorage.googleapis.com/v0/b/tgtg-af1a6.appspot.com/o/images%2Ftransparency_demonstration_1.png?alt=media&token=dde7538e-df6d-47f8-ae0b-4c0df81c4b8d'} alt={boxDetails.type} />
            <h2>{boxDetails.productName}</h2>
            <p><strong>Type:</strong> {boxDetails.type}</p>
            <p><strong>Origin Price:</strong> {boxDetails.originPrice}</p>
            <p><strong>Location:</strong> {boxDetails.location}</p>
            <p><strong>Notes:</strong> {boxDetails.notes}</p>
            <p><strong>Evaluation Price:</strong> {boxDetails.EvaluationPrice}</p>
        </div>
    );
}

export default SingleResult;