'use client';

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import '@/app/dashboard/(overview)/style.css'

export const LSDParrot = ({n_animations = 1} : {n_animations: number}) => {
    return (
        <div className="flex flex-col">
            <div className="flex">
            {Array.from({ length: n_animations }).map((_, index) => (
                <div className={`lottie-container flex flex-col items-center ml-${index + 4}`} key={index}>
                    <DotLottieReact
                    src="https://lottie.host/aed46379-7dcc-4f59-a2a8-2ae4a1978602/5AhPoaU9YF.lottie"
                    loop
                    autoplay
                />
                </div>
            ))}
            </div>
        </div>
    );
};
