import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useParams, useHistory } from 'react-router-dom';
import { db } from './firebase';
import { doc, updateDoc } from "firebase/firestore";

function SwitchTime() {
    const { location, currentBoxId, switchBoxId } = useParams();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const history = useHistory();

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSubmit = async () => {
        if (!currentBoxId || !switchBoxId) {
            console.error("Invalid box IDs");
            alert("Invalid box IDs");
            return;
        }

        const currentBoxRef = doc(db, "boxes", currentBoxId);
        const switchBoxRef = doc(db, "boxes", switchBoxId);

        try {
            await updateDoc(currentBoxRef, {
                switchDate: selectedDate
            });
            await updateDoc(switchBoxRef, {
                switchDate: selectedDate
            });

            alert('Switch date set successfully!');
            history.push('/');
            window.location.reload();
        } catch (error) {
            console.error('Error updating documents: ', error);
            alert('Failed to update switch date.');
        }
    };

    return (
        <div className="switch-time-container">
            <h1>Select a Date for Switching Boxes</h1>
            <div className="datepicker-wrapper">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    inline
                />
            </div>
            <button className="confirm-date-button" onClick={handleSubmit}>
                Confirm Date
            </button>
        </div>
    );
}

export default SwitchTime;