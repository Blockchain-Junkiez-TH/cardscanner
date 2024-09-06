# Local Credit Card Scanner (by TH)

A React-based credit card scanner built with Next.js and integrated with `react-webcam`, `Tesseract.js` (for OCR), and `card-validator` (for credit card validation). This app captures images via webcam, extracts credit card numbers and expiration dates, and validates the information.

## Features

- **Webcam Integration**: Uses the device camera to capture images for processing.
- **Optical Character Recognition (OCR)**: Powered by `Tesseract.js` to extract text from images.
- **Credit Card Validation**: Uses `card-validator` to identify and validate credit card numbers.
- **Expiration Date Detection**: Identifies various expiration date formats from the scanned image.
- **Copy to Clipboard**: Easily copy detected card details and all records to the clipboard.
- **History Management**: Stores a list of all detected card numbers and expiration dates.

## Tech Stack

- **Next.js**: Framework for building the web application.
- **React.js**: UI components for interactive experiences.
- **Tesseract.js**: OCR library for extracting text from images.
- **card-validator**: Utility for validating credit card numbers.
- **react-webcam**: Provides the webcam interface to capture images.
- **Tailwind CSS**: For styling the components.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Blockchain-Junkiez-TH/cardscanner.git
    cd credit-card-scanner
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:3000`.

## How It Works

1. Click on **Start Scanning** to activate the camera and begin scanning for credit card numbers.
2. The app will attempt to capture an image every second and run OCR to extract the card number and expiration date.
3. If a valid credit card number is detected, it will display on the screen along with the expiration date.
4. You can click the copy icon to copy the detected card number and expiration date to the clipboard.
5. The detected card numbers and expiration dates are saved in the history and can be copied all at once.
6. Use the **Scan Again** button to restart scanning.

## Usage Notes

- The app supports both front-facing and rear-facing cameras. For mobile devices, it will default to the rear camera.
- The app can detect and validate 13 to 19-digit card numbers and expiration dates in the format `MM/YY` or `MM/YYYY`.
- You can stop the camera by clicking the **Stop Camera** button, and the OCR process will stop.

## Dependencies

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tesseract.js](https://tesseract.projectnaptha.com/)
- [card-validator](https://www.npmjs.com/package/card-validator)
- [react-webcam](https://www.npmjs.com/package/react-webcam)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)




## License

This project is licensed under the MIT License.

---

Feel free to contribute to this project by submitting issues and pull requests!
