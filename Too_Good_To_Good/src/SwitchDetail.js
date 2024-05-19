import React, { useState, useEffect } from 'react';
import './SwitchDetail.css';
import { useStateValue } from './StateProvider';
import { db, storage } from './firebase';
import { getDownloadURL, ref } from 'firebase/storage';

function SwitchDetail() {
    const [{ user }] = useStateValue();
    const [userBoxes, setUserBoxes] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState({});
  
    useEffect(() => {
      const fetchUserBoxes = async () => {
        if (!user) return;
  
        try {
          const userBoxesRef = db.collection('boxes')
            .where('userId', '==', user.uid)
            .where('status', '==', 'Boxes Switch');
  
          const snapshot = await userBoxesRef.get();
          const userBoxesData = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            let imageUrl = '';
            if (data.imageRef) {
              imageUrl = await getDownloadURL(ref(storage, data.imageRef));
            }
  
            // Fetch messages for the user box
            const messagesSnapshot = await doc.ref.collection('Messages').get();
            const userBoxMessages = messagesSnapshot.docs.map(messageDoc => {
              const messageData = messageDoc.data();
              return { ...messageData, id: messageDoc.id };
            });
            setMessages(prevMessages => ({
              ...prevMessages,
              [doc.id]: userBoxMessages
            }));
  
            // Fetch subcollection documents
            const subcollectionSnapshot = await doc.ref.collection('SwitchBoxes').get();
            const subBoxes = await Promise.all(subcollectionSnapshot.docs.map(async (subDoc) => {
              const subBoxData = subDoc.data();
              const subBoxDoc = await db.collection('boxes')
                .doc(subBoxData.boxId)
                .get();
              const subBox = subBoxDoc.data();
  
              // Fetch messages for each subBox
              const subBoxMessagesSnapshot = await subBoxDoc.ref.collection('Messages').get();
              const subBoxMessages = subBoxMessagesSnapshot.docs.map(messageDoc => {
                const messageData = messageDoc.data();
                return { ...messageData, id: messageDoc.id };
              });
              setMessages(prevMessages => ({
                ...prevMessages,
                [subBoxDoc.id]: subBoxMessages
              }));
  
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
  
      

  const handleLeaveMessage = async (currentBoxId, subBoxId) => {
    if (!subBoxId || !currentBoxId) {
      console.error("Box IDs are missing!");
      return;
    }

    try {
      // Add message to Messages subcollection of the selected subBox
      const messagesCollectionRef = db.collection('boxes')
        .doc(subBoxId)
        .collection('Messages');

      await messagesCollectionRef.add({
        message,
        timestamp: new Date(),
        userId: user?.uid
      });

      // Fetch updated messages to display
      const messagesSnapshot = await messagesCollectionRef.get();
      const subBoxMessages = messagesSnapshot.docs.map(messageDoc => {
        const messageData = messageDoc.data();
        return { ...messageData, id: messageDoc.id };
      });
      setMessages(prevMessages => ({
        ...prevMessages,
        [subBoxId]: subBoxMessages
      }));

      setMessage("");

      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSwitchFinish = async (subBoxId) => {
    if (!subBoxId) {
      console.error("SubBox ID is missing!");
      return;
    }

    try {
      // Update status of sub-box to "Finish Switch"
      await db.collection('boxes').doc(subBoxId).update({ status: 'Finish Switch' });

      alert('Switch marked as finished successfully!');
    } catch (error) {
      console.error('Error marking switch as finished:', error);
    }
  };

  const handleDoNotWantSwitch = async () => {
    try {
      // Update status of user box and sub-boxes to "Not Switch"
      const batch = db.batch();

      userBoxes.forEach(userBox => {
        batch.update(db.collection('boxes').doc(userBox.id), { status: 'Not Switch' });
        userBox.subBoxes.forEach(subBox => {
          batch.update(db.collection('boxes').doc(subBox.id), { status: 'Not Switch' });
        });
      });

      await batch.commit();

      alert('Status updated to Not Switch successfully!');
    } catch (error) {
      console.error('Error updating status to Not Switch:', error);
    }
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
              <div className="messages">
                {messages[userBox.id] && messages[userBox.id].map((msg, index) => (
                  <p key={index}>
                    {msg.message} - {new Date(msg.timestamp?.toDate()).toLocaleString()}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="subBoxes">
            {userBox.subBoxes.map((subBox) => (
              <div key={subBox.id} className="box">
                <img
                  src={
                    subBox.status === 'Finish Switch'
                      ? subBox.imageUrl
                      : 'https://images-ext-1.discordapp.net/external/GuEfrENZrrYJocJMEA0jHxVd0HLEVfTeMokIXsSKkrE/%3Fid%3DOIP.iqldYf72fpKKy0NYd9wVkAHaJH%26pid%3DApi%26P%3D0%26h%3D180/https/tse4.explicit.bing.net/th?format=webp&width=219&height=270'
                  }
                  alt={subBox.productName}
                />
                <div className="boxDetails">
                  <h3>{subBox.productName}</h3>
                  <p>Type: {subBox.type}</p>
                  <p>Location: {subBox.location}</p>
                  <p>Evaluation Price: {subBox.EvaluationPrice}</p>
                  <div className="leaveMessage">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Leave a message"
                    />
                    <button onClick={() => handleLeaveMessage(userBox.id, subBox.id)}>Leave Message</button>
                  </div>
                  <div className="messages">
                    {messages[subBox.id] && messages[subBox.id].map((msg, index) => (
                      <p key={index}>
                        {msg.message} - {new Date(msg.timestamp?.toDate()).toLocaleString()}
                      </p>
                    ))}
                  </div>
                  <button onClick={() => handleSwitchFinish(subBox.id)}>Switch Finish</button>
                  <button onClick={handleDoNotWantSwitch}>Do Not Want Switch</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
  
  
  export default SwitchDetail;