import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db, storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';

function SearchResult() {
    const [boxesWithImages, setBoxesWithImages] = useState([]);
    const location = useLocation();

    useEffect(() => {
      const query = new URLSearchParams(location.search).get('query');

      const fetchImagesAndDetails = async () => {
          const snapshot = await db.collection('boxes').get();
          const boxesDataWithImages = await Promise.all(snapshot.docs.map(async (doc) => {
              const data = doc.data();
              let imageUrl = '';
              if (data.imageRef) {
                  imageUrl = await getDownloadURL(ref(storage, data.imageRef));
              }
              return {
                  id: doc.id,
                  imageUrl,
                  ...data
              };
          }));

          const filteredBoxes = boxesDataWithImages.filter(box =>
              box.productName.toLowerCase().includes(query.toLowerCase()) ||
              box.location.toLowerCase().includes(query.toLowerCase()) ||
              box.type.toLowerCase().includes(query.toLowerCase())
          );

          setBoxesWithImages(filteredBoxes);
      };

      if (query) {
          fetchImagesAndDetails();
      }
    }, [location.search]);

    return (
        <div className="boxesDisplay">
            {boxesWithImages.length > 0 ? (
                boxesWithImages.map((box) => (
                    <Link to={`/result/${box.id}`} key={box.id} style={{ textDecoration: 'none' }}>
                        <div className="box1">
                            <img src={box.imageUrl || 'placeholder-image-url'} alt={box.type} />
                            <div className="boxDetails">
                                <h3>{box.productName}</h3>
                                <p>Type: {box.type}</p>
                                <p>Origin Price: {box.originPrice}</p>
                                <p>Location: {box.location}</p>
                                <p>Notes: {box.notes}</p>
                                <p>Evaluation Price: {box.EvaluationPrice}</p>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <p>No results found</p>
            )}
        </div>
    );
}

export default SearchResult;
