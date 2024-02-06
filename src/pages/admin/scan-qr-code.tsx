import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
  Skeleton,
} from "@nextui-org/react";
import Layout from "../_layout";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import Scanner from "~/components/Scanner";
import * as Toast from "@radix-ui/react-toast";
import {
  CameraIcon,
  CheckCircledIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { api } from "~/utils/api";

const ScanQRCode = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scanned, setScanned] = useState(false);

  let scanner: QrScanner | null = null;
  const completeTaskMutation = api.task.complete.useMutation();

  const handleScan = async (result: string) => {
    const res = result.split(":");
    const userId = Number(res[0]);
    const taskId = Number(res[1]);

    if (!(userId && taskId)) {
      return;
    }

    try {
      await completeTaskMutation.mutateAsync({ taskId, userId });
      setScanned(true);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  useEffect(() => {
    QrScanner.listCameras(true);

    if (videoRef.current) {
      scanner = new QrScanner(
        videoRef.current,
        (result) => {
          handleScan(result.data);
        },
        { maxScansPerSecond: 0.75, highlightScanRegion: true },
      );
      scanner.setCamera("environment");

      scanner.start();

      return () => {
        if (scanner) {
          scanner.stop();
        }
      };
    }
  }, []);

  return (
    <Layout>
      <h1 className="w-full px-4 pt-6 text-center text-3xl font-bold">
        Scan QR Codes
      </h1>
      <p className="w-full text-center text-foreground/60">
        Give the Scanner a Moment to Start
      </p>
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={scanned}
          onOpenChange={setScanned}
          className="ToastRoot"
        >
          <Toast.Title className="flex flex-row items-center space-x-2 font-semibold text-foreground">
            <CheckCircledIcon className="h-6 w-6 text-green-500" />
            <h1>Scanned Task Successfully</h1>
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="ToastViewport" />
      </Toast.Provider>
      <video
        ref={videoRef}
        className="aspect-square overflow-hidden rounded-lg object-cover p-4"
      />
    </Layout>
  );
};

export default ScanQRCode;
