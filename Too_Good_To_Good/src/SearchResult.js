import React, { useEffect, useState } from 'react';
import { useStateValue } from './StateProvider';
import './SearchResult.css';
import { Link } from 'react-router-dom';
import { db, storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';

function SearchResult() {
    const [{ searchResults = [] }, dispatch] = useStateValue();
    const [boxesWithImages, setBoxesWithImages] = useState([]);

    useEffect(() => {
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
          // Filter the boxes to only include those that match the search results
          const filteredBoxes = boxesDataWithImages.filter(box => searchResults.some(result => result.id === box.id));
          setBoxesWithImages(filteredBoxes);
      };

      if (searchResults.length > 0) {
          fetchImagesAndDetails();
      }
  }, [searchResults]);



    return (
        <div className="boxesDisplay">
            {boxesWithImages.length > 0 ? (
                boxesWithImages.map((box) => (
                    <Link to={`/result/${box.id}`} key={box.id} style={{ textDecoration: 'none' }}>
                        <div className="box1">
                            <img src={box.imageUrl || 'https://firebasestorage.googleapis.com/v0/b/tgtg-af1a6.appspot.com/o/images%2Ftransparency_demonstration_1.png?alt=media&token=dde7538e-df6d-47f8-ae0b-4c0df81c4b8d'} alt={box.type} />
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