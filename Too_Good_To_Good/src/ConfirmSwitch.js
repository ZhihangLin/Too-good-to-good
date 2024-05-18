import React, { useState, useEffect } from 'react';
import './ConfirmSwitch.css';
import { useStateValue } from './StateProvider';
import { db, storage } from './firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { useHistory } from 'react-router-dom';
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { deleteField } from 'firebase/firestore'; // Correct import for deleteField

function ConfirmSwitch() {
    const [{ user }, dispatch] = useStateValue(); // Use dispatch from StateProvider
    const [userBoxes, setUserBoxes] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchUserBoxes = async () => {
            if (!user) return;

            try {
                const userBoxesRef = query(collection(db, 'boxes'), where('userId', '==', user.uid));
                const snapshot = await getDocs(userBoxesRef);
                const userBoxesData = await Promise.all(snapshot.docs.map(async (docSnap) => {
                    const data = docSnap.data();
                    let imageUrl = '';
                    if (data.imageRef) {
                        imageUrl = await getDownloadURL(ref(storage, data.imageRef));
                    }

                    // Fetch subcollection documents
                    const subcollectionSnapshot = await getDocs(collection(docSnap.ref, 'SwitchBoxes'));
                    const subBoxes = await Promise.all(subcollectionSnapshot.docs.map(async (subDocSnap) => {
                        const subBoxData = subDocSnap.data();
                        // Fetch details of each sub box
                        const subBoxDoc = await getDoc(doc(db, 'boxes', subBoxData.boxId));
                        const subBox = subBoxDoc.data();
                        return { id: subBoxDoc.id, ...subBox };
                    }));

                    return { id: docSnap.id, imageUrl, subBoxes, ...data };
                }));
                setUserBoxes(userBoxesData);

                // Calculate the counter and update the global state
                const otherUserBoxCount = userBoxesData.reduce((count, userBox) => {
                    return count + userBox.subBoxes.length;
                }, 0);

                localStorage.setItem('boxCounter', otherUserBoxCount);
                dispatch({
                    type: 'UPDATE_BOX_COUNTER',
                    count: otherUserBoxCount,
                });
            } catch (error) {
                console.error('Error fetching user boxes:', error);
            }
        };

        fetchUserBoxes();
    }, [user, dispatch]);

    const handleWantToSwitch = (currentBoxId, subBoxId, subBoxLocation) => {
        console.log(`Current Box ID: ${currentBoxId}, Want to switch with sub-box ID: ${subBoxId}`);

        if (!subBoxId || !currentBoxId) {
            console.error("Box IDs are missing!");
            return;
        }
        // Navigate to SavePlace page with location as a parameter along with box IDs
        history.push(`/save-place/${encodeURIComponent(subBoxLocation)}/${currentBoxId}/${subBoxId}`);
        window.location.reload();
    };

    const handleRemoveSwitch = async (currentBoxId, subBoxId) => {
        try {
            // Remove switch location and time for both boxes in Firestore
            await updateDoc(doc(db, "boxes", currentBoxId), {
                switchLocation: deleteField(),
                switchDate: deleteField()
            });
            await updateDoc(doc(db, "boxes", subBoxId), {
                switchLocation: deleteField(),
                switchDate: deleteField()
            });

            // Remove the other user's box from the SwitchBoxes subcollection
            const currentBoxSwitchBoxRef = query(collection(db, 'boxes', currentBoxId, 'SwitchBoxes'), where('boxId', '==', subBoxId));
            const subBoxSwitchBoxRef = query(collection(db, 'boxes', subBoxId, 'SwitchBoxes'), where('boxId', '==', currentBoxId));

            const currentBoxSwitchBoxSnapshot = await getDocs(currentBoxSwitchBoxRef);
            const subBoxSwitchBoxSnapshot = await getDocs(subBoxSwitchBoxRef);

            const batch = db.batch();
            currentBoxSwitchBoxSnapshot.forEach(docSnap => {
                batch.delete(docSnap.ref);
            });
            subBoxSwitchBoxSnapshot.forEach(docSnap => {
                batch.delete(docSnap.ref);
            });
            await batch.commit();

            // Remove the other user's box from local state
            setUserBoxes(prevUserBoxes => {
                return prevUserBoxes.map(userBox => {
                    if (userBox.id === currentBoxId) {
                        return {
                            ...userBox,
                            subBoxes: userBox.subBoxes.filter(subBox => subBox.id !== subBoxId)
                        };
                    }
                    return userBox;
                });
            });

            // Update the counter
            const otherUserBoxCount = userBoxes.reduce((count, userBox) => {
                return count + userBox.subBoxes.length;
            }, 0);
            localStorage.setItem('boxCounter', otherUserBoxCount);
            dispatch({
                type: 'UPDATE_BOX_COUNTER',
                count: otherUserBoxCount,
            });

            alert('Switch location, time, and other user’s box removed successfully!');
        } catch (error) {
            console.error('Error removing switch data: ', error);
            alert('Failed to remove switch location, time, and other user’s box.');
        }
        window.location.reload();
    };

    const hasSwitchDetails = (userBox, subBox) => {
        return userBox.switchLocation && userBox.switchDate && subBox.switchLocation && subBox.switchDate;
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
                                    <button onClick={() => handleRemoveSwitch(userBox.id, subBox.id)}>Remove Switch</button>
                                    {hasSwitchDetails(userBox, subBox) && (
                                        <button onClick={() => console.log('Switch Details')}>Switch Detail</button>
                                    )}
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
