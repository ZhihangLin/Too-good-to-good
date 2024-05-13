import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db, storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { useStateValue } from './StateProvider'; // Import useStateValue
import { auth } from './firebase'; // Import auth
import { useParams, useHistory } from 'react-router-dom';

function SearchResult() {
    const [boxesWithImages, setBoxesWithImages] = useState([]);
    const location = useLocation();
    const [{ basket }, dispatch] = useStateValue(); // Use data layer
    const history = useHistory();

    useEffect(() => {
        const query = new URLSearchParams(location.search).get('query');

        const fetchImagesAndDetails = async () => {
            const snapshot = await db.collection('boxes').get();
            const boxesDataWithImages = await Promise.all(snapshot.docs.map(async (doc) => {
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

            const filteredBoxes = boxesDataWithImages.filter(box =>
                box.productName.toLowerCase().includes(query.toLowerCase()) ||
                box.location.toLowerCase().includes(query.toLowerCase()) ||
                box.type.toLowerCase().includes(query.toLowerCase())
            ).filter(box => box.EvaluationPrice !== 'not decide'); // Filter out boxes with EvaluationPrice as 'not decide'

            setBoxesWithImages(filteredBoxes);
        };

        if (query) {
            fetchImagesAndDetails();
        }
    }, [location.search]);

    const handleWantToSwitch = async (boxId) => {
        const user = auth.currentUser;
        if (!user) {
            console.log("User not authenticated.");
            return;
        }

        try {
            const switchRequestsRef = db.collection('boxes').doc(boxId).collection('switchRequests');
            const existingRequests = await switchRequestsRef.where('userId', '==', user.uid).get();

            if (existingRequests.empty) {
                await switchRequestsRef.add({
                    userId: user.uid
                });

                console.log("User added to box:", boxId);
            } else {
                console.log("User already added to box:", boxId);
            }

            // Dispatch action to add the item into data layer
            const box = boxesWithImages.find(box => box.id === boxId);
            dispatch({
                type: 'ADD_TO_WISHLIST',
                item: {
                    type: box.type,
                    image: box.imageUrl,
                    price: box.originPrice,
                    location: box.location
                },
            });

        } catch (error) {
            console.error("Error adding user to box:", error);
        }
    };

    const handleFetchPlace = async (boxId) => {
        history.push(`/save-place/${boxesWithImages.location}`);
        window.location.reload();
    };

    return (
        <div className="boxesDisplay">
            {boxesWithImages.length > 0 ? (
                boxesWithImages.map((box) => (
                    <Link to={`/result/${box.id}`} key={box.id} style={{ textDecoration: 'none' }}>
                        <div className="box1">
                            <img src={'https://images-ext-1.discordapp.net/external/GuEfrENZrrYJocJMEA0jHxVd0HLEVfTeMokIXsSKkrE/%3Fid%3DOIP.iqldYf72fpKKy0NYd9wVkAHaJH%26pid%3DApi%26P%3D0%26h%3D180/https/tse4.explicit.bing.net/th?format=webp&width=219&height=270'} />
                            <div className="boxDetails">
                                <h3>{box.productName}</h3>
                                <p>Type: {box.type}</p>
                                <p>Origin Price: {box.originPrice}</p>
                                <p>Location: {box.location}</p>
                                <p>Evaluation Price: {box.EvaluationPrice}</p>
                                <button onClick={() => handleWantToSwitch(box.id)}>Want to Switch</button>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <p>No results found</p>
            )}
        </div>
    );
}

export default SearchResult;
