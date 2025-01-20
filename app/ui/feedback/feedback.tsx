import { useState } from "react";
import { validationErrorsToString } from "../../dashboard/(overview)/general-interface/helpers";
import { DBResult } from "../../lib/actions/actions";
import { LSDParrot } from "../lottie-animations/parrot";
import './style.css';


export default function Feedback<T>({result}: {result: DBResult<T>}) {

    return (
        <>
            {result.success ?
                <SuccessParrot autoClose={true} />
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


const SuccessParrot = ({autoClose}: {autoClose: boolean}) => {
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
        <div className={`flex flex-col ${fade}`}>
            <LSDParrot n_animations={1} />
            <div className="flex items-center justify-center mt-60 mr-72">
                <p>Successo!!</p>
            </div>
        </div>
    );
};