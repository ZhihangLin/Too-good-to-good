import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { db, storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import './SingleResult.css';




function SingleResult(props) {
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
                console.log('No such box!');
            }
        };


        fetchBoxDetails();
    }, [boxId]);




    const handleFindPlacesClick = () => {
        // Use the history.push method to navigate
        props.history.push({
            pathname: '/save-place-results',
            state: { boxLocation: boxDetails.location }
        });
    };














    return (
        <div className="singleResult">
            <img src={imageUrl || 'https://example.com/default-image.png'} alt={boxDetails.type} />
            <h2>{boxDetails.productName}</h2>
            <p><strong>Type:</strong> {boxDetails.type}</p>
            <p><strong>Origin Price:</strong> {boxDetails.originPrice}</p>
            <p><strong>Location:</strong> {boxDetails.location}</p>
            <p><strong>Notes:</strong> {boxDetails.notes}</p>
            <p><strong>Evaluation Price:</strong> {boxDetails.EvaluationPrice}</p>
            <button onClick={handleFindPlacesClick} disabled={!boxDetails.location}>
                    Find Safe Exchange Places
            </button>


        </div>
    );
}


export default withRouter(SingleResult);
