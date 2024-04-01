import React, { useEffect, useState } from 'react';
import { useStateValue } from './StateProvider';
import './SearchResult.css'; 
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

function SearchResult() {
  const [{ searchResults }, dispatch] = useStateValue();
  const [boxesWithImages, setBoxesWithImages] = useState([]);

  useEffect(() => {
    const fetchImagesAndDetails = async () => {
      if (searchResults?.length > 0) {
        const boxesDataWithImages = await Promise.all(
          searchResults.map(async (box) => {
            let imageUrl = '';
            if (box.imageRef) {
              try {
                imageUrl = await getDownloadURL(ref(storage, box.imageRef));
              } catch (error) {
                console.error("Error fetching image URL: ", error);
                imageUrl = 'default-placeholder-image-url'; // Fallback image URL in case of an error
              }
            }
            return { ...box, imageUrl };
          })
        );
        setBoxesWithImages(boxesDataWithImages);
      }
    };

    fetchImagesAndDetails();
  }, [searchResults]);

  return (
    <div className="boxesDisplay">
      {boxesWithImages.length > 0 ? (
        boxesWithImages.map((box) => (
          <div key={box.id} className="box1">
            <img src={box.imageUrl || 'default-placeholder-image-url'} alt={box.productName} />
            <div className="boxDetails">
              <h3>{box.productName}</h3>
              <p>Type: {box.type}</p>
              <p>Origin Price: {box.originPrice}</p>
              <p>Location: {box.location}</p>
              <p>Notes: {box.notes}</p>
              <p>Evaluation Price: {box.EvaluationPrice}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}

export default SearchResult;