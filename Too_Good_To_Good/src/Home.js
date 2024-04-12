import "./Home.css";
import React, { useEffect, useState } from 'react';
import { db, storage } from './firebase';
import { auth } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { useStateValue } from './StateProvider';

function Home({ type, image, price, location }) {
  const [{ basket }, dispatch] = useStateValue();
  const [user, setUser] = useState(null); // State to store current user
  const [boxes, setBoxes] = useState([]); // State to store boxes data

  // Effect to update user when authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch boxes data from Firestore
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
          type: type,
          image: image,
          price: price,
          location: location,
        },
      });
  
    } catch (error) {
      console.error("Error adding user to box:", error);
    }
  };

  const filteredBoxes = boxes.filter(box => box.EvaluationPrice !== 'not decide');

  return (
    <div className='home'>
      <div className='home__container'>
        <img
          className='home__image'
          src='https://wp-media.familytoday.com/2013/07/featuredImageId3694.jpg'
          alt='' />
        <div className="boxesDisplay">
          {filteredBoxes.map((box) => (
            <div key={box.id} className="box1">
              <img src='https://images-ext-1.discordapp.net/external/GuEfrENZrrYJocJMEA0jHxVd0HLEVfTeMokIXsSKkrE/%3Fid%3DOIP.iqldYf72fpKKy0NYd9wVkAHaJH%26pid%3DApi%26P%3D0%26h%3D180/https/tse4.explicit.bing.net/th?format=webp&width=219&height=270' />
              <div className="boxDetails">
                <h3>{'secret boxes'}</h3>
                <p>Type:
                  <input type="text" value={box.type} readOnly />
                </p>
                <p>Location:
                  <input type="text" value={box.location} readOnly />
                </p>
                <p>Evaluation Price :
                  <input type="text" value={box.EvaluationPrice} readOnly />
                </p>
                <button onClick={() => wantToSwitch(box.id)}>Want to Switch</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
