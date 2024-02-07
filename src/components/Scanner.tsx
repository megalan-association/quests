import React, { useRef, useEffect } from "react";
import QrScanner from "qr-scanner";

interface ScannerProps {
  onScan: (result: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  let scanner: QrScanner | null = null;

  useEffect(() => {
    if (videoRef.current) {
      scanner = new QrScanner(videoRef.current, (result) => {
        onScan(result);
      });

      scanner.start();

      return () => {
        if (scanner) {
          scanner.stop();
        }
      };
    }
  }, [onScan]);

  return <video ref={videoRef}></video>;
};

export default Scanner;
