"use client"
import React, { useState, useRef, useCallback, useEffect } from 'react';




import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import CardValidator from 'card-validator';
import { FaRegCopy } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdFiberManualRecord } from "react-icons/md";
import { IoStop } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";

import { IoMdClose } from "react-icons/io";






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
    const webcamRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const [videoConstraints, setVideoConstraints] = useState({ facingMode: "user" });
    const [allRecords, setAllRecords] = useState([]);
    const [copied2, setCopied2] = useState(false);
    const [openModal, setOpenModal] = useState(true);
    const [cvc, setcvc] = useState('');


    useEffect(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            setVideoConstraints({ facingMode: { exact: "environment" } });
        }
    }, []);

    const copyText = () => {
        if (cardNumber) {
            navigator.clipboard.writeText(cardNumber + ' ' + expDate)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        }
    };

    const copyText2 = () => {
        if (allRecords && allRecords.length > 0) {
            const textToCopy = allRecords.join('\n');
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    setCopied2(true);
                    setTimeout(() => setCopied2(false), 800);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        }
    };

    const capture = useCallback(async () => {
        if (isProcessing) return;

        setIsProcessing(true);

        const imageSrc = webcamRef.current.getScreenshot();

        // Log image source
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

                if (validCardNumber && expDate) {

                    setCardNumber(validCardNumber);
                    setExpDate(expDate || '');
                    //setAllRecords((prevRecords) => [...prevRecords, validCardNumber + ' ' + (expDate || '')]);
                    clearInterval(captureInterval);
                    setCaptureInterval(null);
                    setCameraActive(false);
                }
                setIsProcessing(false);
            })
            .catch(err => {
                console.error('OCR error:', err); // Log the OCR error
                setCardNumber('Error processing image');
                setIsProcessing(false);
            });
    }, [captureInterval, isProcessing]);


    useEffect(() => {
        if (cameraActive && !captureInterval) {

            const interval = setInterval(capture, 700); // Keep capturing every 800ms
            setCaptureInterval(interval);
        }
        return () => {
            if (captureInterval) {

                clearInterval(captureInterval);
                setCaptureInterval(null); // Clear the interval state
            }
        };
    }, [cameraActive, capture, captureInterval]);



    const submitRecord = () => {
        setAllRecords((prevRecords) => [...prevRecords, cardNumber + ' ' + expDate + ' ' + cvc]);
        handleClose();
    }

    const handleClose = () => {
        setcvc('');
        setCardNumber('');
        setExpDate('');
        setOpenModal(false);
    }

    return (
        <div className="w-full flex flex-col justify-center items-center relative">

            {cardNumber && expDate && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md z-50 flex items-center justify-center">
                    <div className="border-2 rounded-xl text-center border-gray-700 bg-[#8371F1] relative w-fit p-4 flex flex-col justify-center items-center">
                        <button className="absolute top-2 right-2" onClick={() => handleClose()}><IoMdClose /></button>

                        
                        <p className="font-semibold text-2xl">Card's found!</p>
                        <p className="font-medium text-xl mb-4">{cardNumber} {expDate}</p>
                        <p className="font-semibold text-2xl ">Enter cvc</p>
                        <input
                            type="number"
                            className="border-2 w-[150px] border-gray-700 rounded-md my-3 text-center p-2 text-xl"
                            maxLength={3}
                            pattern="\d{3}"
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                            }}
                            onChange={(e) => setcvc(e.target.value)}
                        />

                        <button className="btn-black" onClick={()=>submitRecord()}>Submit</button>
                    </div>
                </div>
            )}

            <h1 className="my-3 text-2xl font-bold">Credit Card Scanner</h1>
            <div className="w-[90vw] h-[90vw] max-w-[600px] max-h-[600px] flex flex-col justify-center items-center">
                {!cameraActive ? (



                    allRecords.length > 0 ? (
                        <>
                            {cardNumber && (
                                <div>
                                    <p className="mb-2 font-bold">Detected Credit Card Number</p>
                                    <div onClick={copyText} className="mb-4 w-full flex flex-row text-center justify-center items-center">
                                        <p>{cardNumber} {expDate}</p>{copied ? <FaRegCheckCircle size="1em" className="ml-2" color="green" /> : <FaRegCopy size="1em" className="ml-2" />}
                                    </div>
                                </div>
                            )}
                            <button onClick={() => setCameraActive(true)} className="btn-black">
                                <div className="flex flex-row justify-center items-center">
                                    <MdFiberManualRecord size="1.5em" className="mr-2" color="red" />
                                    Scan Again
                                </div>

                            </button>
                        </>
                    ) : (
                        <button onClick={() => setCameraActive(true)} className="btn-black">
                            <div className="flex flex-row justify-center items-center">
                                <MdFiberManualRecord size="1.5em" className="mr-2" color="red" />
                                SCAN
                            </div>
                        </button>
                    )



                ) : (
                    <>
                        <div className="flex flex-row justify-center items-center relative">
                            {/* Text Overlay */}
                            <div
                                className="
                                flex flex-row justify-center items-top
                                absolute top-0 left-0 bottom-0 right-0  
                                align-text-bottom text-black text-lg font-bold 
                                bg-black bg-opacity-0 py-2 z-10
                                "
                                style={{ pointerEvents: 'none' }}
                            >
                                <MdFiberManualRecord size="1.5em" className="mr-1" color="#b50707" />
                                Scanning...
                            </div>

                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                screenshotQuality={1.0}
                                className="w-full h-full relative"
                                videoConstraints={videoConstraints}
                            />

                        </div>

                        <br />
                        <button onClick={() => setCameraActive(false)} className="btn-black">
                            <div className="flex flex-row justify-center items-center">
                                <IoStop size="1.5em" className="mr-2" color="white" />
                                STOP
                            </div>
                        </button>
                        {/*
                      <button onClick={capture} disabled={isProcessing} className="btn-black">
                        {isProcessing ? 'Processing...' : 'Scan Card'}
                      </button>
                    */}
                    </>

                )}
            </div>

            {allRecords.length > 0 && (
                <div>
                    <h2 onClick={copyText2} className="mt-5 text-xl font-bold w-full flex flex-row text-center justify-center items-center">
                        All Records
                        {copied2 ? <FaRegCheckCircle size="1em" className="ml-2" color="green" /> : <FaRegCopy size="1em" className="ml-2 mr-8" />}
                        <MdDeleteOutline size="1.3em" onClick={() => setAllRecords([])} />
                    </h2>
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
