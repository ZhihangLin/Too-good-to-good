import React, { useState, useEffect } from 'react';
import './SwitchDetail.css';
import { useStateValue } from './StateProvider';
import { useParams } from 'react-router-dom';
import { db, storage } from './firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function SwitchDetail() {
    const [{ user }] = useStateValue();
    const { currentBoxId, subBoxId } = useParams();
    const [currentBox, setCurrentBox] = useState(null);
    const [subBox, setSubBox] = useState(null);
    const [currentMessage, setCurrentMessage] = useState("");
    const [subMessage, setSubMessage] = useState("");
    const [messages, setMessages] = useState({});
    const [subBoxImageUrl, setSubBoxImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBoxDetails = async () => {
            try {
                const [currentBoxDoc, subBoxDoc] = await Promise.all([
                    db.collection('boxes').doc(currentBoxId).get(),
                    db.collection('boxes').doc(subBoxId).get()
                ]);

                const currentBoxData = currentBoxDoc.data();
                const subBoxData = subBoxDoc.data();

                if (currentBoxData.imageRef) {
                    currentBoxData.imageUrl = await getDownloadURL(ref(storage, currentBoxData.imageRef));
                }

                if (subBoxData.status === 'Finish Switch' && subBoxData.imageRef) {
                    const imageUrl = await getDownloadURL(ref(storage, subBoxData.imageRef));
                    setSubBoxImageUrl(imageUrl);
                }

                setCurrentBox({ id: currentBoxId, ...currentBoxData });
                setSubBox({ id: subBoxId, ...subBoxData });

                const fetchMessages = async (boxId) => {
                    const messagesSnapshot = await db.collection('boxes').doc(boxId).collection('Messages').orderBy('timestamp').get();
                    return messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                };

                const [currentBoxMessages, subBoxMessages] = await Promise.all([
                    fetchMessages(currentBoxId),
                    fetchMessages(subBoxId)
                ]);

                setMessages({
                    [currentBoxId]: currentBoxMessages,
                    [subBoxId]: subBoxMessages
                });

                setLoading(false);
            } catch (err) {
                setError('Error fetching box details');
                console.error('Error fetching box details:', err);
                setLoading(false);
            }
        };

        fetchBoxDetails();
    }, [currentBoxId, subBoxId]);

    const handleLeaveMessage = async (boxId, message, setMessage) => {
        if (!message) return;

        try {
            await db.collection('boxes').doc(boxId).collection('Messages').add({
                message,
                timestamp: new Date(),
                userId: user.uid
            });
            setMessage("");

            const messagesSnapshot = await db.collection('boxes').doc(boxId).collection('Messages').orderBy('timestamp').get();
            const updatedMessages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(prevMessages => ({
                ...prevMessages,
                [boxId]: updatedMessages
            }));
        } catch (error) {
            console.error('Error leaving message:', error);
        }
    };

    const handleSwitchFinish = async (currentBoxId) => {
        if (!currentBoxId) {
            console.error("Current Box ID is missing!");
            return;
        }

        try {
            await db.collection('boxes').doc(currentBoxId).update({ status: 'Finish Switch' });
            alert('Switch marked as finished successfully!');
        } catch (error) {
            console.error('Error marking switch as finished:', error);
        }
    };

    const renderBoxDetail = (box, boxId, message, setMessage, isUserBox = false) => (
        <div className="boxDetail3">
            {box ? (
                <div>
                    <img 
                        src={boxId === subBoxId && box.status !== 'Finish Switch' 
                            ? 'https://images-ext-1.discordapp.net/external/GuEfrENZrrYJocJMEA0jHxVd0HLEVfTeMokIXsSKkrE/%3Fid%3DOIP.iqldYf72fpKKy0NYd9wVkAHaJH%26pid%3DApi%26P%3D0%26h%3D180/https/tse4.explicit.bing.net/th?format=webp&width=219&height=270' 
                            : box.imageUrl || 'placeholder-image-url'} 
                        alt={box.productName} 
                    />
                    <h3>{box.productName}</h3>
                    <p>Type: {box.type}</p>
                    <p>Location: {box.location}</p>
                    <p>Evaluation Price: {box.EvaluationPrice}</p>
                    <div className="messages">
                        {messages[boxId] && messages[boxId].map(msg => (
                            <p key={msg.id}>
                                {msg.message} - {new Date(msg.timestamp.toDate()).toLocaleString()}
                            </p>
                        ))}
                    </div>
                    {isUserBox && (
                        <>
                            <TextField
                                sx={{ mb: 2, width: '100%', backgroundColor: 'white', marginTop: '5px'}}
                                label="Leave a message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                multiline
                            />
                            <Button
                                sx={{
                                    backgroundColor: '#007bff', 
                                    marginLeft: '4px', 
                                    marginTop: '4px', 
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#0056b3',
                                    }
                                }}
                                onClick={() => handleLeaveMessage(boxId, message, setMessage)}
                            >
                                Leave Message
                            </Button>
                            <Button
                                sx={{
                                    backgroundColor: '#007bff', 
                                    marginLeft: '4px', 
                                    marginTop: '4px', 
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#0056b3',
                                    }
                                }}
                                onClick={() => handleSwitchFinish(boxId)}
                            >
                                Finish Switch
                            </Button>
                        </>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="parentComponent">
            <div className="userBoxContainer1">
                {renderBoxDetail(currentBox, currentBoxId, currentMessage, setCurrentMessage, true)}
            </div>
            <div className="subBoxesContainer1">
                {renderBoxDetail(subBox, subBoxId, subMessage, setSubMessage)}
            </div>
        </div>
    );
}

export default SwitchDetail;