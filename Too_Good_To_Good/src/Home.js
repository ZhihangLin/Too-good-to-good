import React from 'react';
import { useHistory } from "react-router-dom";
import "./Home.css";
import CreateLogin from './CreateLogin';
import {Box, Box_two, Box_three} from './Box';
import { StateProvider } from './StateProvider';

function Home() {
  const history = useHistory();
  const SignUPage = () => {
    history.push('/CreateLogin');
    window.location.reload();

   
  };
  const SeeMore =() =>{
    history.push('/ConfirmSwitch');
    window.location.reload();
      
  };
  
  return (
    <div className='home'>
       <img
              className='home__image'
              src='https://wp-media.familytoday.com/2013/07/featuredImageId3694.jpg' 
              alt=''/>
      
        <div className='home__container'>
            {/* <img
              className='home__image'
              src='https://wp-media.familytoday.com/2013/07/featuredImageId3694.jpg' 
              alt=''/> */}
            <div className='home__content'>
              <h1>Experience a unique journey at Too Good To Good</h1>
              <p>Advance your unique experience with cost-free mystery to unlock new possibilities and elevate your journey.</p>
              <button onClick={SignUPage}>Sign up</button>
            </div>
          
            
            
        

        </div>

        <div className='home__above'>
          <h1> Explore The Mystery</h1>

        </div>
       
        <div className='home__row'>
          
                <Box 
                  type="Electronic product"
                  
                  image="https://tse4.explicit.bing.net/th?id=OIP.iqldYf72fpKKy0NYd9wVkAHaJH&pid=Api&P=0&h=180"
                  location="queens"
                />
                <Box_two 
                  type="Toy"
                  
                  image="https://tse4.explicit.bing.net/th?id=OIP.iqldYf72fpKKy0NYd9wVkAHaJH&pid=Api&P=0&h=180"
                  location="brooklyn"
                />
                <Box_three
                  type="Book"
                  
                  image="https://tse4.explicit.bing.net/th?id=OIP.iqldYf72fpKKy0NYd9wVkAHaJH&pid=Api&P=0&h=180"
                  location="queens"
                />
                
            </div>
            <div className='home__below'>
          <h2 onClick={SeeMore}> Click Here To See More</h2>

        </div>
       
       

    </div>
  );
}

export default Home;