'use client';
import InputNumber from "@/app/ui/inputs/input-number";
import { LSDParrot } from "@/app/ui/lottie-animations/parrot";
import { useState } from "react";

export default function Settings() {
    const [parrotDimension, setParrotDimension] = useState(1);

    return (
        <div>
            <h1 className="mb-4 text-xl md:text-2xl">SETTINGS</h1>
            <div>
                <p>Customize the success animation style (on progress...).</p>
                <div className="flex justify-center">
                    <div className="flex flex-col">
                        <LSDParrot n_animations={parrotDimension} />
                        <div className="flex items-center justify-center mt-60 mr-72">
                            <InputNumber name="parrot-dimension" label='' value={parrotDimension.toString()} onChange={(e) => setParrotDimension(parseInt(e.target.value))} />
                            <div className="flex mt-5 flex-col items-center justify-center">
                                <p>-dimensional Pink Floyd Parrot</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


