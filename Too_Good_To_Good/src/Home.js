import React from 'react';
import "./Home.css";
import Header from './Header';
import Box from './Box';


function Home() {
  return (
    <div className='home'>
        <div className='home__container'>
        <Header />
            <img
            className='home__image'
            src='https://wp-media.familytoday.com/2013/07/featuredImageId3694.jpg' 
            alt=''/>

            <div className='home__row'>
                <Box />
            </div>

            <div className='home__row'>
                
            </div>

        </div>

    </div>
  );
}

export default Home;
