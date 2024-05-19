import React, { useState, useEffect } from 'react';
import './SwitchDetail.css';
import { useStateValue } from './StateProvider';
import { useParams } from 'react-router-dom';
import { db, storage } from './firebase';
import { getDownloadURL, ref } from 'firebase/storage';

function SwitchDetail() {
    const [{ user }] = useStateValue();
    const { currentBoxId, subBoxId } = useParams();
    const [currentBox, setCurrentBox] = useState(null);
    const [subBox, setSubBox] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState({});

    useEffect(() => {
        const fetchBoxDetails = async () => {
            try {
                const currentBoxDoc = await db.collection('boxes').doc(currentBoxId).get();
                const currentBoxData = currentBoxDoc.data();
                if (currentBoxData.imageRef) {
                    currentBoxData.imageUrl = await getDownloadURL(ref(storage, currentBoxData.imageRef));
                }
                setCurrentBox({ id: currentBoxId, ...currentBoxData });

                const subBoxDoc = await db.collection('boxes').doc(subBoxId).get();
                const subBoxData = subBoxDoc.data();
                if (subBoxData.imageRef) {
                    subBoxData.imageUrl = await getDownloadURL(ref(storage, subBoxData.imageRef));
                }
                setSubBox({ id: subBoxId, ...subBoxData });

                // Fetch messages for both boxes
                const fetchMessages = async (boxId) => {
                    const messagesSnapshot = await db.collection('boxes').doc(boxId).collection('Messages').get();
                    return messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                };

                const currentBoxMessages = await fetchMessages(currentBoxId);
                const subBoxMessages = await fetchMessages(subBoxId);
                setMessages({
                    [currentBoxId]: currentBoxMessages,
                    [subBoxId]: subBoxMessages
                });
            } catch (error) {
                console.error('Error fetching box details:', error);
            }
        };

        fetchBoxDetails();
    }, [currentBoxId, subBoxId]);

    const handleLeaveMessage = async (boxId) => {
        if (!message) return;

        try {
            await db.collection('boxes').doc(boxId).collection('Messages').add({
                message,
                timestamp: new Date(),
                userId: user.uid
            });
            setMessage("");
            // Fetch updated messages
            const messagesSnapshot = await db.collection('boxes').doc(boxId).collection('Messages').get();
            const updatedMessages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(prevMessages => ({
                ...prevMessages,
                [boxId]: updatedMessages
            }));
        } catch (error) {
            console.error('Error leaving message:', error);
        }
    };

    return (
        <div className="switchDetail">
            <div className="boxDetail">
                {currentBox && (
                    <div>
                        <img src={currentBox.imageUrl || 'placeholder-image-url'} alt={currentBox.productName} />
                        <h3>{currentBox.productName}</h3>
                        <p>Type: {currentBox.type}</p>
                        <p>Location: {currentBox.location}</p>
                        <p>Evaluation Price: {currentBox.EvaluationPrice}</p>
                        <div className="messages">
                            {messages[currentBoxId] && messages[currentBoxId].map(msg => (
                                <p key={msg.id}>
                                    {msg.message} - {new Date(msg.timestamp.toDate()).toLocaleString()}
                                </p>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Leave a message"
                        />
                        <button onClick={() => handleLeaveMessage(currentBoxId)}>Leave Message</button>
                    </div>
                )}
            </div>
            <div className="boxDetail">
                {subBox && (
                    <div>
                        <img src={subBox.imageUrl || 'placeholder-image-url'} alt={subBox.productName} />
                        <h3>{subBox.productName}</h3>
                        <p>Type: {subBox.type}</p>
                        <p>Location: {subBox.location}</p>
                        <p>Evaluation Price: {subBox.EvaluationPrice}</p>
                        <div className="messages">
                            {messages[subBoxId] && messages[subBoxId].map(msg => (
                                <p key={msg.id}>
                                    {msg.message} - {new Date(msg.timestamp.toDate()).toLocaleString()}
                                </p>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Leave a message"
                        />
                        <button onClick={() => handleLeaveMessage(subBoxId)}>Leave Message</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SwitchDetail;