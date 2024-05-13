import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { db, storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import './SingleResult.css';
import { useStateValue } from './StateProvider'; // Import useStateValue
import { auth } from './firebase'; // Import auth

function SingleResult() {
    const { boxId } = useParams();
    const [boxDetails, setBoxDetails] = useState({});
    const [imageUrl, setImageUrl] = useState('');
    const history = useHistory();
    const [{ basket }, dispatch] = useStateValue();
    const [user, setUser] = useState(null); // State to store current user

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
    history.push(`/save-place/${boxDetails.location}`);
    window.location.reload();
};

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    setUser(user);
  });
  return () => unsubscribe();
}, []);


    const wantToSwitch = async () => {
        if (!user) {
            // If user is not authenticated, handle it accordingly (e.g., redirect to login)
            console.log("User not authenticated.");
            return;
        }

        try {
            // Check if the user ID already exists in the subcollection
            const switchRequestsRef = db.collection('boxes').doc(boxId).collection('switchRequests');
            const existingRequests = await switchRequestsRef.where('userId', '==', user.uid).get();

            if (existingRequests.empty) {
                // If user ID doesn't exist, add it to the subcollection
                await switchRequestsRef.add({
                    userId: user.uid
                });

                console.log("User added to box:", boxId);
            } else {
                console.log("User already added to box:", boxId);
            }

            // Dispatch action to add the item into data layer
            dispatch({
                type: 'ADD_TO_WISHLIST',
                item: {
                    type: boxDetails.type,
                    image: boxDetails.image, // Assuming boxDetails has an image field
                    price: boxDetails.price, // Assuming boxDetails has a price field
                    location: boxDetails.location
                },
            });

        } catch (error) {
            console.error("Error adding user to box:", error);
        }
    };

    return (
        <div className="singleResult">
            {boxDetails.EvaluationPrice !== "not decide" && ( // Render only when EvaluationPrice is not "not decide"
                <>
                    <h2 className='h2_padding'>Your search result:</h2>
                    <img src={'https://images-ext-1.discordapp.net/external/GuEfrENZrrYJocJMEA0jHxVd0HLEVfTeMokIXsSKkrE/%3Fid%3DOIP.iqldYf72fpKKy0NYd9wVkAHaJH%26pid%3DApi%26P%3D0%26h%3D180/https/tse4.explicit.bing.net/th?format=webp&width=219&height=270'} />
                    <h2>{boxDetails.productName}</h2>
                    <p><strong>Type:</strong> {boxDetails.type}</p>
                    <p><strong>Origin Price:</strong> {boxDetails.originPrice}</p>
                    <p><strong>Location:</strong> {boxDetails.location}</p>
                    <p><strong>Notes:</strong> {boxDetails.notes}</p>
                    <p><strong>Evaluation Price:</strong> {boxDetails.EvaluationPrice}</p>

                    <button className='Button' onClick={handleFindPlacesClick}>Find Safe Meeting Places</button>
                    <button className='Button' onClick={wantToSwitch}>Want to Switch</button>
                </>
            )}
        </div>
    );
}

export default SingleResult;
