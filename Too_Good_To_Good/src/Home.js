import React from 'react';
import "./Home.css";
import Box from './Box';

function Home() {
  return (
    <div className='home'>
        <div className='home__container'>
            <img
            className='home__image'
            src='https://wp-media.familytoday.com/2013/07/featuredImageId3694.jpg' 
            alt=''/>

            <div className='home__row'>
                <Box 
                  type = "Eletronic product"
                  price = {75.00}
                  image = ""
                  location="queens"
                  />
                <Box 
                  type = "Book"
                  price = {155.00}
                  image = ""
                  location = "brooklyn"/>
            </div>

            <div className='home__row'>
                <Box 
                  type = "Eletronic product"
                  price = {75.00}
                  image = ""
                  location="queens"
                  />
                  <Box 
                  type = "Eletronic product"
                  price = {75.00}
                  image = ""
                  location="queens"
                  />
                  <Box 
                  type = "Eletronic product"
                  price = {75.00}
                  image = ""
                  location="queens"
                  />
            </div>

        </div>

    </div>
  );
}

export default Home;
