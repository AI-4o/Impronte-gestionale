import { useState } from "react";
import { validationErrorsToString } from "../../dashboard/(overview)/general-interface/helpers";
import { DBResult } from "../../lib/actions/actions";
import { LSDParrot } from "../lottie-animations/parrot";
import './style.css';


export default function Feedback<T>({ result, autoClose = true }: { result: DBResult<T>, autoClose?: boolean }) {

    return (
        <>
            {result.success ?
                <SuccessParrot autoClose={autoClose} />
                :
                <div className="flex flex-col text-red-500 mt-10">
                    <p>Operazione fallita: </p>
                    <p>{result.errorsMessage}</p>
                    <p>{validationErrorsToString(result.errors)}</p>
                </div>
            }
        </>
    );
}


const SuccessParrot = ({ autoClose }: { autoClose: boolean }) => {
    const [render, setRender] = useState(true);
    const [fade, setFade] = useState('fade-in');

    if (autoClose) {
        setTimeout(() => {
            setFade('fade-out');
            setTimeout(() => {
                setRender(false);
            }, 2000); // Match the duration of the fade-out
        }, 1000);
    }

    return (
        render &&
        <div className={`flex flex-col items-center z-50 justify-center ${fade} absolute top-0 left-0 w-full h-full`}>
            <div>
                <LSDParrot n_animations={1} />
            </div>
            <div className="mt-48 text-green-500 text-2xl font-bold">
                <p>Successo!!</p>
            </div>
        </div>
    );
};