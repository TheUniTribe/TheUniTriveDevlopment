import React from 'react';
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import Templates from '../Components/Templates';
import Footer from '../Components/Footer';
import StudentNetworkLanding from '@/Components/StudentNetworkLanding';

function Welcome() {
  return (
    <div>
      <Navbar />
      <StudentNetworkLanding/>
      <Hero />
      <Templates />
      <Footer /> 
    </div>
  );
}

export default Welcome;
