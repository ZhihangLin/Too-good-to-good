import React, { useState, useEffect } from 'react';
import './CompareBoxes.css';
import { useStateValue } from './StateProvider';
import { db, storage } from './firebase';
import { getDownloadURL, ref } from 'firebase/storage';


function CompareBoxes() {
  const [{ user }] = useStateValue();
  const [userBoxes, setUserBoxes] = useState([]);
  const [selectedUserBox, setSelectedUserBox] = useState(null);
  const [additionalBoxes, setAdditionalBoxes] = useState([]);


  useEffect(() => {
    const fetchUserBoxes = async () => {
      if (!user) return;


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
  }, [user]);

  useEffect(() => {
    const fetchAdditionalBoxes = async () => {
      if (!user) return;
  
      try {
        const additionalBoxesData = [];
  
        const boxesRef = db.collection('boxes').where('userId', '!=', user.uid);
        const snapshot = await boxesRef.get();
  
        await Promise.all(snapshot.docs.map(async boxDoc => {
          const boxData = boxDoc.data();
          const switchRequestsRef = boxDoc.ref.collection('switchRequests').where('userId', '==', user.uid);
          const switchRequestsSnapshot = await switchRequestsRef.get();
  
          if (!switchRequestsSnapshot.empty) {
            let imageUrl = '';
            if (boxData.imageRef) {
              imageUrl = await getDownloadURL(ref(storage, boxData.imageRef));
            }
            additionalBoxesData.push({ id: boxDoc.id, imageUrl, ...boxData });
          }
        }));
  
        setAdditionalBoxes(additionalBoxesData);
      } catch (error) {
        console.error('Error fetching additional boxes:', error);
      }
    };
  
    fetchAdditionalBoxes();
  }, [user]);
  
  
  const handleSelectUserBox = (box) => {
    setSelectedUserBox(box);
  };
  



  const removeFromWishlist = async (boxId) => {
    if (!user) {
      console.log("User not authenticated.");
      return;
    }
  
    try {
      const boxRef = db.collection('boxes').doc(boxId);
      const boxSnapshot = await boxRef.get();
      const boxData = boxSnapshot.data();
  
      // Check if the box belongs to the current user
      if (boxData.userId !== user.uid) {
        console.log("Box does not belong to the current user.");
        return;
      }
  
      const switchRequestsRef = boxRef.collection('switchRequests');
      const existingRequests = await switchRequestsRef.where('userId', '==', user.uid).get();
  
      if (!existingRequests.empty) {
        existingRequests.forEach(doc => {
          switchRequestsRef.doc(doc.id).delete();
        });
  
        console.log("User removed from box:", boxId);
  
        // Optionally, you can update the state to remove the box from the wishlist immediately
        setAdditionalBoxes(prevAdditionalBoxes => prevAdditionalBoxes.filter(box => box.id !== boxId));
      } else {
        console.log("User is not in the wishlist for box:", boxId);
      }
    } catch (error) {
      console.error("Error removing user from box wishlist:", error);
    }
  };
  


  return (
    <div className="parentComponent">
      <div className="leftSide">
        <h2>User Boxes</h2>
        <div className="boxContainer">
          {userBoxes.map((box) => (
            <div key={box.id} className={`box ${selectedUserBox === box ? 'selected' : ''}`} onClick={() => handleSelectUserBox(box)}>
              <img src={box.imageUrl || 'placeholder-image-url'} alt={box.productName} />
              <div className="boxDetails">
                <h3>{box.productName}</h3>
                <p>Type: {box.type}</p>
                <p>Location: {box.location}</p>
                <p>Evaluation Price: {box.EvaluationPrice}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rightSide">
        <h2>Wishlist</h2>
        <div className="boxContainer">
          {additionalBoxes.map((box) => (
            <div key={box.id} className="box">
              <img src={'https://images-ext-1.discordapp.net/external/GuEfrENZrrYJocJMEA0jHxVd0HLEVfTeMokIXsSKkrE/%3Fid%3DOIP.iqldYf72fpKKy0NYd9wVkAHaJH%26pid%3DApi%26P%3D0%26h%3D180/https/tse4.explicit.bing.net/th?format=webp&width=219&height=270'} />
              <div className="boxDetails">
                <h3>{box.productName}</h3>
                <p>Type: {box.type}</p>
                <p>Location: {box.location}</p>
                <p>Evaluation Price: {box.EvaluationPrice}</p>
                <button onClick={() => removeFromWishlist(box.id)}>Remove from Wishlist</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default CompareBoxes;