'use client';

import React, { useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './style.css'; 
import { useState } from 'react';

const Spinner: React.FC<{ isActive: boolean }> = ({ isActive }) => {

  const [render, setRender] = useState(false);

  useEffect(() => {
    if(isActive) {
      setRender(true);
    }
    else {
      setTimeout(() => {
        setRender(false);
      }, 1000);
    }
  }, [isActive]);

  return (
    <>
      {render && (
        <div className={`spinner ${isActive ? 'visible' : 'hidden'}`}>
          <div className="spinner-content">
            <div className="spinner-icon">
                <SpinnerAnimation />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SpinnerAnimation = () => {
  return (
    <DotLottieReact
      src="https://lottie.host/1ae6eb34-48d3-45c7-a75c-25b53a18cf86/PbUb53mAfD.lottie"
      loop
      autoplay
    />
  );
};

export default Spinner;
