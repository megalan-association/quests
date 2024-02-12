import Layout from "../_layout";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { api } from "~/utils/api";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { useSession } from "next-auth/react";
import UnAuthorized from "~/components/unauthorized";

const ScanQRCode = () => {
  const { data: session } = useSession();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [scanned, setScanned] = useState(false);

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
    const initScanner = async () => {
      if (videoRef.current && videoContainerRef.current) {
        const scannerInstance = new QrScanner(
          videoRef.current,
          (result) => handleScan(result.data),
          {
            preferredCamera: "environment",
            maxScansPerSecond: 0.5,
            highlightScanRegion: true,
          },
        );

        await scannerInstance.start();

        setScanner(scannerInstance);
      }
    };

    initScanner();

    return () => {
      if (scanner) {
        scanner.stop();
      }
    };
  }, []);

  if (session && session.user.type !== "ADMIN")
    return <UnAuthorized permissionsType="ADMIN" />;

  return (
    <Layout padding>
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
      <h1 className="w-full px-4 pt-6 text-center text-3xl font-bold">
        Scan QR Codes
      </h1>
      <p className="w-full text-center text-foreground/60">
        Give the Scanner a Moment to Start
      </p>
      <div ref={videoContainerRef} className="overflow-hidden rounded-lg p-4">
        <video
          ref={videoRef}
          className="aspect-square overflow-hidden rounded-lg object-cover"
        />
      </div>
      <div className="px-4">
        <Button as={Link} href="/dashboard" color="primary" className="w-full">
          Back to Dashboard
        </Button>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  let id = ctx.params?.id;

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default ScanQRCode;
