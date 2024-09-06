import CardScanner from './components/cardScanner.js';
import { BiLinkExternal } from "react-icons/bi";

export default function Home() {
  return (
    <div className="w-full min-h-[100vh] flex flex-col items-center justify-between">
      <div className="flex-grow flex flex-col items-center justify-center">
        <CardScanner />
      </div>

      {/* Footer for credit */}
      <div className="w-full text-center">
        <p className="text-sm text-gray-600 flex flex-row items-center justify-center w-full">
          Developed by
          <a
            href="https://github.com/Blockchain-Junkiez-TH/cardscanner"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-blue-900 hover:underline flex flex-row items-center"
          >
            TH <BiLinkExternal className="ml-1" />
          </a>
        </p>
      </div>
    </div>
  );
}
