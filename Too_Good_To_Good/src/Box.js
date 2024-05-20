import React, { useState } from 'react';
import "./Box.css";
import { useStateValue } from './StateProvider';

function Box({ type, image, price, location }) {
  const [{ basket }, dispatch] = useStateValue();
  const [currentImage, setCurrentImage] = useState(image);

  const handleImageClick = () => {
    setCurrentImage('https://media.wired.com/photos/5b22c5c4b878a15e9ce80d92/1:1/w_1799,h_1799,c_limit/iphonex-TA.jpg');
  };

  const addToWishList = () => {
    dispatch({
      type: 'ADD_TO_WISHLIST',
      item: {
        type: type,
        image: currentImage,
        price: price,
        location: location,
      },
    });
  };

  return (
    <div className='box'>
      <div className='box__type'>
        <strong>{type}</strong>
        <p className= 'box__location'>
            <strong>{location}</strong>
        </p>
      </div>
      <img
        src={currentImage}
        alt=''
        onClick={handleImageClick}
      />
      <p>Click on The Picture To See What Happen</p>
      
    </div>
  );
}

function Box_two({ type, image, price, location }) {
  const [{ basket }, dispatch] = useStateValue();
  const [currentImage, setCurrentImage] = useState(image);

  const handleImageClick = () => {
    setCurrentImage('https://www.ikea.com/us/en/images/products/jaettelik-soft-toy-dinosaur-dinosaur-brontosaurus__0804796_pe769337_s5.jpg?f=s');
  };

  

  return (
    <div className='box'>
      <div className='box__type'>
        <strong>{type}</strong>
        <p className= 'box__location'>
            <strong>{location}</strong>
        </p>
      </div>
      <img
        src={currentImage}
        alt=''
        onClick={handleImageClick}
      />
      <p>Click on The Picture To See What Happen</p>
    </div>
  );
}

function Box_three({ type, image, price, location }) {
  const [{ basket }, dispatch] = useStateValue();
  const [currentImage, setCurrentImage] = useState(image);

  const handleImageClick = () => {
    setCurrentImage('https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=754&fit=clip');
  };

  

  return (
    <div className='box'>
      <div className='box__type'>
        <strong>{type}</strong>
        <p className= 'box__location'>
            <strong>{location}</strong>
        </p>
      </div>
      <img
        src={currentImage}
        alt=''
        onClick={handleImageClick}
      />
      <p>Click on The Picture To See What Happen</p>
    </div>
  );
}



export  {Box,Box_two,Box_three};