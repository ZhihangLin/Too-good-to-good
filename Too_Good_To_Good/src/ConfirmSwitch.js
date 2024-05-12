import React, { useState, useEffect } from 'react';
import './ConfirmSwitch.css';
import { useStateValue } from './StateProvider';
import { db, storage } from './firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { useHistory } from 'react-router-dom';

function ConfirmSwitch() {
  const [{ user }] = useStateValue();
  const [userBoxes, setUserBoxes] = useState([]);
  const history = useHistory();

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

          // Fetch subcollection documents
          const subcollectionSnapshot = await doc.ref.collection('SwitchBoxes').get();
          const subBoxes = await Promise.all(subcollectionSnapshot.docs.map(async (subDoc) => {
            const subBoxData = subDoc.data();
            // Fetch details of each sub box
            const subBoxDoc = await db.collection('boxes').doc(subBoxData.boxId).get();
            const subBox = subBoxDoc.data();
            return { id: subBoxDoc.id, ...subBox };
          }));

          return { id: doc.id, imageUrl, subBoxes, ...data };
        }));
        setUserBoxes(userBoxesData);
      } catch (error) {
        console.error('Error fetching user boxes:', error);
      }
    };

    fetchUserBoxes();
  }, [user]);

  const handleWantToSwitch = (currentBoxId, subBoxId, subBoxLocation) => {
    // Handle what happens when "Want to Switch" button is clicked
    console.log(`Current Box ID: ${currentBoxId}, Want to switch with sub-box ID: ${subBoxId}`);

    if(!subBoxId || !currentBoxId) {
      console.error("Box IDs are missing!");
      return;
    }
    // Navigate to SavePlace page with location as a parameter along with box IDs
    history.push(`/save-place/${encodeURIComponent(subBoxLocation)}/${currentBoxId}/${subBoxId}`);
    window.location.reload();
  };


  return (
    <div className="parentComponent">
      {userBoxes.map((userBox) => (
        <div key={userBox.id} className="boxRow">
          <div className="box">
            <img src={userBox.imageUrl || 'placeholder-image-url'} alt={userBox.productName} />
            <div className="boxDetails">
              <h3>{userBox.productName}</h3>
              <p>Type: {userBox.type}</p>
              <p>Location: {userBox.location}</p>
              <p>Evaluation Price: {userBox.EvaluationPrice}</p>
            </div>
          </div>
          <div className="subBoxes">
            {userBox.subBoxes.map((subBox) => (
              <div key={subBox.id} className="box">
                <img src={'https://images-ext-1.discordapp.net/external/GuEfrENZrrYJocJMEA0jHxVd0HLEVfTeMokIXsSKkrE/%3Fid%3DOIP.iqldYf72fpKKy0NYd9wVkAHaJH%26pid%3DApi%26P%3D0%26h%3D180/https/tse4.explicit.bing.net/th?format=webp&width=219&height=270'} />
                <div className="boxDetails">
                  <h3>{subBox.productName}</h3>
                  <p>Type: {subBox.type}</p>
                  <p>Location: {subBox.location}</p>
                  <p>Evaluation Price: {subBox.EvaluationPrice}</p>
                  <button onClick={() => handleWantToSwitch(userBox.id, subBox.id, subBox.location)}>Want to Switch</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ConfirmSwitch;
