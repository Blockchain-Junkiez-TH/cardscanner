"use client"
import React, { useState, useRef, useCallback, useEffect } from 'react';

import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import CardValidator from 'card-validator';
import { FaRegCopy, FaRegCheckCircle } from "react-icons/fa";
import { MdFiberManualRecord, MdDeleteOutline } from "react-icons/md";
import { IoStop } from "react-icons/io5";

const extractCardNumber = (text) => {
    const cleanedText = text.replace(/\s+/g, '');
    const has13to19DigitNumber = cleanedText.match(/\d{13,19}/g);
    if (has13to19DigitNumber) {
        let remainingText = text;
        for (let number of has13to19DigitNumber) {
            const validation = CardValidator.number(number);
            if (validation.isValid) {
                const regex = new RegExp(number, 'g');
                remainingText = remainingText.replace(regex, '').trim();
                return { validCardNumber: number, remainingText: remainingText };
            }
        }
    }
    return { validCardNumber: null, remainingText: text };
};

function identifyAndSaveExpDate(inputString) {
    const expDateFormats = [
        /\b(0[1-9]|1[0-2])\/\d{2}\b/,
        /\b(0[1-9]|1[0-2])-\d{2}\b/,
        /\b(0[1-9]|1[0-2])\/\d{4}\b/,
        /\b(0[1-9]|1[0-2])-\d{4}\b/,
    ];

    for (let format of expDateFormats) {
        const match = inputString.match(format);
        if (match) {
            return match[0] || '';
        }
    }
    return null;
}

const CardScanner = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [expDate, setExpDate] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [captureInterval, setCaptureInterval] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [ccv, setCCV] = useState('');
    const [allRecords, setAllRecords] = useState([]);
    const webcamRef = useRef(null);

    const validateAndAddCCV = () => {
        if (ccv.length === 3 && /^\d{3}$/.test(ccv)) {
            setAllRecords((prevRecords) => [
                ...prevRecords,
                `${cardNumber} ${expDate} CCV: ${ccv}`,
            ]);
            setShowModal(false);
        } else {
            alert("Invalid CCV. Please enter a valid 3-digit number.");
        }
    };

    const capture = useCallback(async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
            setIsProcessing(false);
            return;
        }

        Tesseract.recognize(imageSrc, 'eng')
            .then(({ data: { text } }) => {
                const { validCardNumber, remainingText } = extractCardNumber(text);
                let expDate = '';
                if (validCardNumber) {
                    expDate = identifyAndSaveExpDate(remainingText);
                }

                if (validCardNumber) {
                    setCardNumber(validCardNumber);
                    setExpDate(expDate || '');
                    setCameraActive(false);
                    setShowModal(true);
                }
                setIsProcessing(false);
            })
            .catch(err => {
                console.error('OCR error:', err);
                setCardNumber('Error processing image');
                setIsProcessing(false);
            });
    }, [isProcessing]);

    useEffect(() => {
        if (cameraActive && !captureInterval) {
            const interval = setInterval(capture, 1000);
            setCaptureInterval(interval);
        }
        return () => {
            if (captureInterval) {
                clearInterval(captureInterval);
                setCaptureInterval(null);
            }
        };
    }, [cameraActive, capture, captureInterval]);

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <h1 className="my-3 text-2xl font-bold">Credit Card Scanner</h1>
            <div className="w-[90vw] h-[90vw] max-w-[600px] max-h-[600px] flex flex-col justify-center items-center">
                {!cameraActive ? (
                    <button onClick={() => setCameraActive(true)} className="btn-black">
                        <div className="flex flex-row justify-center items-center">
                            <MdFiberManualRecord size="1.5em" className="mr-2" color="red" />
                            SCAN
                        </div>
                    </button>
                ) : (
                    <>
                        <div className="flex flex-row justify-center items-center relative">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full relative"
                            />
                        </div>
                        <button onClick={() => setCameraActive(false)} className="btn-black">
                            <div className="flex flex-row justify-center items-center">
                                <IoStop size="1.5em" className="mr-2" color="white" />
                                STOP
                            </div>
                        </button>
                    </>
                )}
            </div>

            {showModal && (
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <ModalHeader>
                        <button onClick={() => setShowModal(false)} className="close-btn">X</button>
                    </ModalHeader>
                    <ModalBody>
                        <input
                            type="text"
                            maxLength={3}
                            value={ccv}
                            onChange={(e) => setCCV(e.target.value)}
                            placeholder="Enter CCV"
                            className="input-box"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <button onClick={() => setShowModal(false)} className="btn-black">Cancel</button>
                        <button onClick={validateAndAddCCV} className="btn-black">Submit</button>
                    </ModalFooter>
                </Modal>
            )}

            {allRecords.length > 0 && (
                <div>
                    <h2 className="mt-5 text-xl font-bold">All Records</h2>
                    <ul>
                        {allRecords.map((record, index) => (
                            <li key={index}>{record}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CardScanner;
