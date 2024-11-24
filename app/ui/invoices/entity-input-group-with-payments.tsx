'use client';
import { entitiesKeysDictionary, EntityKey } from "@/app/lib/entities.utils";
import EntityInputGroup from "./entity-input-group";
import { Transazione } from "@/app/lib/definitions";
import { Button } from "../button";
import Modal from "./modal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function EntityInputGroupWithPayments(
    entityName: string,
    entityDefaultValues: any,
    paymentValues: Transazione[],
    setPaymentValues: (value: SetStateAction<Transazione[]>) => void
) {

    // set pagamentiEntityName
    let pagamentiEntityName = 'pagamenti_' + entityName;
    if (entityName == 'partecipanti') pagamentiEntityName = 'incassi_partecipanti';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalHeader, setModalHeader] = useState(<p>The modal Header</p>);
    const [modalBody, setModalBody] = useState(<p>The modal Body</p>);
    const [modalButtons, setModalButtons] = useState(<p>The modal Buttons</p>);

    const openModal = (index: number) => {
        // whether the moadl is for adding a new payment, or for updating an existing payment
        const isAddPaymentModal = index == paymentValues.length;

        if (!isAddPaymentModal) {
            // ### set modal header ###
            setModalHeader(<p>Update Payment {index + 1}</p>);
            // ### set modal body ###
            // create a single payment value state, and update the payment values array when the single payment value changes
            const [paymentValue, setPaymentValue] = useSinglePaymentValue(paymentValues, setPaymentValues, index);
            // create a copy of the single payment value state that is binded to the modal body inputs
            const [paymentValueCopy, setPaymentValueCopy] = useState(paymentValue);
            const modalBodyInputs = (
                <EntityInputGroup
                    entityKeys={entitiesKeysDictionary[pagamentiEntityName] as EntityKey[]}
                    recordModel={paymentValueCopy}
                    setRecordModel={setPaymentValueCopy}
                />
            );
            setModalBody(modalBodyInputs);
            // ### set modal buttons ###
            const updatePaymentButton = <Button onClick={() => {
                setPaymentValue(paymentValueCopy ?? paymentValue);
            }}>Update Payment</Button>;
            setModalButtons(updatePaymentButton);
        }
        else { // add payment modal
            // ### set modal header ###
            setModalHeader(<p>Add Payment {index + 1}</p>);
            // ### set modal body ###
            const [newPayment, setNewPayment] = useAddPaymentValue();
            const modalBodyInputs = (
                <EntityInputGroup
                    entityKeys={entitiesKeysDictionary[pagamentiEntityName] as EntityKey[]}
                    recordModel={newPayment}
                    setRecordModel={setNewPayment as Dispatch<SetStateAction<any>>}
                />
            );
            setModalBody(modalBodyInputs);
            // ### set modal buttons ###
            setModalButtons(<Button 
                onClick={() => {
                    setPaymentValues(prevState => [...prevState, newPayment as Transazione]);
                    setIsModalOpen(false);                    
                }}>Add Payment</Button>);
            setIsModalOpen(true);
        }
    }
    const renderPaymentsInputs = paymentValues.map((pV, i) => (
        <div key={i} className="display: hidden">
            <EntityInputGroup
                entityKeys={entitiesKeysDictionary[pagamentiEntityName] as EntityKey[]}
                recordModel={pV}
            />
        </div>
    ));

    const renderUpdatePaymentsButtons = paymentValues.map((pV, i) => (
        <Button onClick={() => openModal(i)}>Update Payment {i + 1}</Button>
    ));
    const renderAddPaymentButton = <Button onClick={() => openModal(paymentValues.length)}>Add Payment</Button>;


    return <>
        <EntityInputGroup
            entityKeys={entitiesKeysDictionary[entityName] as EntityKey[]}
            recordModel={entityDefaultValues}
            inline={true}
        />
        <Modal header={modalHeader} body={modalBody} buttons={modalButtons} isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        {renderUpdatePaymentsButtons}
        {renderAddPaymentButton}
        {renderPaymentsInputs}
    </>;
}


/** create a single payment value state, and update the payment values array when the single payment value changes */
const useSinglePaymentValue = (
    paymentValues: Transazione[],
    setPaymentValues: Dispatch<SetStateAction<Transazione[]>>,
    i: number
): [Transazione, Dispatch<SetStateAction<Transazione>>] => {
    const [paymentValue, setPaymentValue] = useState(paymentValues[i]);
    useEffect(() => {
        setPaymentValues(prevState => {
            return prevState.map((pV, _i) => i == _i ? paymentValue : pV);
        });
        console.log('UseEffect, the new payment value is', paymentValue, 'and the payment values array is', paymentValues);
    }, [paymentValue]);
    return [paymentValue, setPaymentValue];
}

const useAddPaymentValue = () => {
    const [paymentValue, setPaymentValue] = useState({});
    return [paymentValue, setPaymentValue];
}