import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

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
        <ModalBody>
          <p>Ask a Society Executive to scan this</p>
          {/* TODO: Generate QR Code for This Task */}
          <Image src="/default.png" />
          <p>
            {userId}:{taskId}
          </p>
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
