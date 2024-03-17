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
                  id = "123123"
                  type = "Eletronic product"
                  minprice = {75}
                  maxprice = {100}
                  image = ""
                  location="queens"
                  />
                <Box 
                  id = "98374897"
                  type = "Book"
                  minprice = {150}
                  maxprice = {180}
                  image = ""
                  location = "brooklyn"/>
            </div>

            <div className='home__row'>
                <Box 
                  id = "123679124"
                  type = "Eletronic product"
                  minprice = {50}
                  maxprice = {80}
                  image = ""
                  location="queens"
                  />
                  <Box 
                  id = "76583746"
                  type = "Eletronic product"
                  minprice = {10}
                  maxprice = {20}
                  image = ""
                  location="queens"
                  />
                  <Box 
                  id = "23752364"
                  type = "Eletronic product"
                  minprice={25}
                  maxprice={35}
                  image = ""
                  location="queens"
                  />
            </div>

        </div>

    </div>
  );
}

export default Home;
