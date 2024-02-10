import { api } from "~/utils/api";
import React from "react";
import { useState } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Progress,
  Input,
  CardBody,
  Card,
} from "@nextui-org/react";

type Props = {
  currentName: string;
  handleChange: () => void;
};

export default function ChangeName({ currentName, handleChange }: Props) {
  const total = 2;
  const color = "primary";
  const variant = "flat";
  const headerStep1 = "Enter a new name.";
  const headerStep2 = "Are you sure you want to change your name?";

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentStep, setCurrentStep] = useState(0);
  const [newName, setNewName] = useState<string>("");

  const changeNameMutation = api.user.changeName.useMutation();

  const handleSubmit = () => {
    changeNameMutation.mutate({
      name: newName,
    });
    handleClose();
    handleChange();
  };

  const handleClose = () => {
    setNewName("");
    setCurrentStep(0);
  };

  const handleCancel = () => {
    setCurrentStep(0);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onPress={onOpen} className="max-w-fit" color="primary">
        Change name
      </Button>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        onClose={() => handleClose()}
      >
        <ModalContent className="max-h-[50vh]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center">
                <span className="text-3xl font-bold">Change your name</span>
              </ModalHeader>
              <ModalBody className="flex flex-col items-center overflow-y-scroll">
                <p>{currentStep == 0 ? headerStep1 : headerStep2}</p>
                <Progress
                  aria-label="Form progress"
                  value={(currentStep / (total - 1)) * 100}
                  className="max-w-sm py-2"
                />
                <div className="w-full overflow-y-scroll">
                  {currentStep === 0 && (
                    <Input
                      size="lg"
                      type="string"
                      variant="bordered"
                      isRequired
                      classNames={{
                        inputWrapper:
                          "group-data-[focus=true]:border-primary/50",
                      }}
                      label="Enter a new name"
                      placeholder=""
                      value={newName}
                      isClearable={true}
                      onClear={() => setNewName("")}
                      onValueChange={(value) => setNewName(value)}
                    />
                  )}
                  {currentStep === total - 1 && (
                    <div className="flex w-full flex-col items-center justify-center p-2">
                      <Card shadow="sm">
                        <CardBody className="flex flex-row items-center space-x-2 text-center">
                          <p className="text-black/60">{currentName}</p>
                          <ArrowRightIcon />
                          <p>{newName}</p>
                        </CardBody>
                      </Card>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                {currentStep === 0 && (
                  <div className="flex w-full flex-row justify-end gap-2">
                    <Button
                      variant={variant}
                      color={color}
                      onPress={() =>
                        setCurrentStep((prev) =>
                          prev < total - 1 ? prev + 1 : prev,
                        )
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}
                {currentStep === total - 1 && (
                  <div className="flex w-full flex-row justify-between gap-2">
                    <Button
                      variant="light"
                      color="danger"
                      onPress={() => handleCancel()}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onPress={() => {
                        handleSubmit();
                        onClose();
                      }}
                    >
                      Yes
                    </Button>
                  </div>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
