import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useQRCode } from "next-qrcode";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  taskId: number;
  userId: number;
};

const CompleteTaskModal: React.FC<Props> = ({
  taskId,
  userId,
  isOpen,
  handleClose,
}) => {
  const { Canvas } = useQRCode();

  return (
    <Modal
      isOpen={isOpen}
      backdrop="blur"
      onClose={handleClose}
      placement="center"
    >
      <ModalContent>
        <ModalHeader>
          <h1>Complete Task</h1>
        </ModalHeader>
        <ModalBody className="flex flex-col items-center">
          <p className="text-center">
            Ask a Society Executive to scan this once you have completed this
            task
          </p>
          <Canvas
            text={userId + ":" + taskId}
            options={{
              errorCorrectionLevel: "M",
              scale: 4,
              width: 300,
              color: {
                dark: "#000000",
                light: "#FFFFFF",
              },
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            size="md"
            variant="flat"
            color="primary"
            onClick={handleClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CompleteTaskModal;
