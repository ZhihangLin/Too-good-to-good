import React, { useState, useEffect } from 'react';
import './CompareBoxes.css';
import { useStateValue } from './StateProvider';
import { db, storage } from './firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import CheckBox from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

function CompareBoxes() {
  const [{ user }, dispatch] = useStateValue(); // Use dispatch from StateProvider
  const [userBoxes, setUserBoxes] = useState([]);
  const [selectedUserBoxes, setSelectedUserBoxes] = useState(new Set());
  const [selectedAdditionalBoxes, setSelectedAdditionalBoxes] = useState(new Set());
  const [additionalBoxes, setAdditionalBoxes] = useState([]);
  const [removedBoxIds, setRemovedBoxIds] = useState([]);

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
        // Filter out boxes with Evaluation Price 'not decide'
        const filteredUserBoxes = userBoxesData.filter(box => box.EvaluationPrice !== 'not decide');
        setUserBoxes(filteredUserBoxes);
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

  const removeFromWishlist = async (boxId) => {
    if (!user) {
      console.log("User not authenticated.");
      return;
    }

    try {
      const switchRequestsRef = db.collection('boxes').doc(boxId).collection('switchRequests');
      const existingRequests = await switchRequestsRef.where('userId', '==', user.uid).get();

      if (!existingRequests.empty) {
        existingRequests.forEach(doc => {
          switchRequestsRef.doc(doc.id).delete();
        });

        console.log("User removed from box:", boxId);

        // Update the removedBoxIds state to include the removed box ID
        setRemovedBoxIds(prevRemovedBoxIds => [...prevRemovedBoxIds, boxId]);

        // Optionally, you can update the state to remove the box from the wishlist immediately
        setAdditionalBoxes(prevAdditionalBoxes => prevAdditionalBoxes.filter(box => box.id !== boxId));
      } else {
        console.log("User is not in the wishlist for box:", boxId);
      }
    } catch (error) {
      console.error("Error removing user from box wishlist:", error);
    }
  };

  const toggleSelectUserBox = (box) => {
    const updatedSelectedUserBoxes = new Set(selectedUserBoxes);
    if (updatedSelectedUserBoxes.has(box.id)) {
      updatedSelectedUserBoxes.delete(box.id);
    } else {
      updatedSelectedUserBoxes.add(box.id);
    }
    setSelectedUserBoxes(updatedSelectedUserBoxes);
  };

  const toggleSelectAdditionalBox = (box) => {
    const updatedSelectedAdditionalBoxes = new Set(selectedAdditionalBoxes);
    if (updatedSelectedAdditionalBoxes.has(box.id)) {
      updatedSelectedAdditionalBoxes.delete(box.id);
    } else {
      updatedSelectedAdditionalBoxes.add(box.id);
    }
    setSelectedAdditionalBoxes(updatedSelectedAdditionalBoxes);
  };

  const confirmSwitch = async () => {
    if (!user) {
      console.log("User not authenticated.");
      return;
    }

    try {
      const batch = db.batch();

      selectedUserBoxes.forEach(async (userBoxId) => {
        // Check if the user box is already in the subcollection of selected additional boxes
        const additionalBoxId = Array.from(selectedAdditionalBoxes)[0];
        const switchRequestsRef = db.collection('boxes').doc(additionalBoxId).collection('SwitchBoxes');
        const existingSwitchRequest = await switchRequestsRef.where('boxId', '==', userBoxId).get();

        if (existingSwitchRequest.empty) {
          await switchRequestsRef.add({ userId: user.uid, boxId: userBoxId });
        } else {
          console.log("Sending switch request already.");
        }
      });

      
      await batch.commit();
      console.log("Boxes added to switched boxes.");

      // Update the counter
      const updatedBoxCount = selectedAdditionalBoxes.size;
      const currentCounter = parseInt(localStorage.getItem('boxCounter')) || 0;
      const newCounter = currentCounter + updatedBoxCount;
      localStorage.setItem('boxCounter', newCounter);


    } catch (error) {
      console.error("Error adding boxes to switched boxes:", error);
    }
  };

  return (
    <div className="parentComponent">
      <div className="leftSide">
        <h2 className='h2_ui'>User Boxes</h2>
        <div className="boxContainer">
          {userBoxes.map((box) => (
            <div key={box.id} className={`box ${selectedUserBoxes.has(box.id) ? 'selected' : ''}`} onClick={() => toggleSelectUserBox(box)}>
              <img src={box.imageUrl || 'placeholder-image-url'} alt={box.productName} />
              <div className="boxDetails">
                <h3>{box.productName}</h3>
                <p>Type: {box.type}</p>
                <p>Location: {box.location}</p>
                <p>Evaluation Price: {box.EvaluationPrice}</p>
                <div className="checkboxContainer">
                  <Checkbox
                    icon={<CheckBox />}
                    checkedIcon={<CheckBox />}
                    checked={selectedUserBoxes.has(box.id)}
                    onChange={() => toggleSelectUserBox(box)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rightSide">
        <h2 className='h2_ui'>Wishlist</h2>
        <div className="boxContainer">
          {additionalBoxes.map((box) => (
            <div key={box.id} className={`box ${selectedAdditionalBoxes.has(box.id) ? 'selected' : ''}`} onClick={() => toggleSelectAdditionalBox(box)}>
              <img src={'https://images-ext-1.discordapp.net/external/GuEfrENZrrYJocJMEA0jHxVd0HLEVfTeMokIXsSKkrE/%3Fid%3DOIP.iqldYf72fpKKy0NYd9wVkAHaJH%26pid%3DApi%26P%3D0%26h%3D180/https/tse4.explicit.bing.net/th?format=webp&width=219&height=270'} />
              <div className="boxDetails">
                <h3>{box.productName}</h3>
                <p>Type: {box.type}</p>
                <p>Location: {box.location}</p>
                <p>Evaluation Price: {box.EvaluationPrice}</p>
                <div className="checkboxContainer1">
                  <Checkbox
                    icon={<CheckBox />}
                    checkedIcon={<CheckBox />}
                    checked={selectedAdditionalBoxes.has(box.id)}
                    onChange={() => toggleSelectAdditionalBox(box)}
                  />
                </div>
                <div className='removeButtonContainer'>
                  <Button
                    sx={{
                      backgroundColor: 'red', color: 'white',
                      '&:hover': {
                        backgroundColor: 'darkred',
                      },
                      '& .MuiButton-startIcon': {
                        marginRight: '8px',
                      },
                    }}
                    startIcon={<DeleteIcon />}
                    onClick={() => removeFromWishlist(box.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='switchButtonContainer'>
          <Button
            sx={{
              backgroundColor: '#007bff', marginLeft: '4px', marginTop: '25px', color: 'white',
              '&:hover': {
                backgroundColor: '#0056b3',
              },
              '& .MuiButton-startIcon': {
                marginRight: '8px',
              },
            }}
            onClick={confirmSwitch}
          >
            Confirm Switch
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CompareBoxes;