import React, { useEffect, useState } from 'react';
import { db, storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import './Userbd.css';
import { useStateValue } from './StateProvider'; // Import useStateValue
import { auth } from './firebase'; // Import auth

function Userbd() {
    const [boxes, setBoxes] = useState([]);
    const [{ basket }, dispatch] = useStateValue(); // Destructuring useStateValue to access dispatch function
    const [user, setUser] = useState(null); // Define user state
    const [boxDetails, setBoxDetails] = useState({}); // Define boxDetails state

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

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const wantToSwitch = async (boxId) => {
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
                    // Assuming these properties are available in box data
                    type: boxDetails.type,
                    image: boxDetails.image,
                    price: boxDetails.price,
                    location: boxDetails.location
                },
            });

        } catch (error) {
            console.error("Error adding user to box:", error);
        }
    };

    const handleButtonClick = async (boxId) => {
        console.log("Button clicked for box:", boxId);
        wantToSwitch(boxId); // Call wantToSwitch function with boxId when button is clicked
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

