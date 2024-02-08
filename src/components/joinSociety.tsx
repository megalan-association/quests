import { api } from "~/utils/api";
import React from "react";
import { useState } from "react";
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
  Avatar,
} from "@nextui-org/react";
import DefaultIcon from "../../public/default.png";
import { Society } from "~/server/api/routers/admin";

type Props = {
  handleChange: () => void;
};

export default function JoinSociety({ handleChange }: Props) {
  const total = 2;
  const color = "primary";
  const variant = "flat";
  const headerStep1 =
    "You can find your society token by checking the MegaLan Discord";
  const headerStep2 = "Are you sure you want to join this society?";

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [currentStep, setCurrentStep] = useState(0);
  const [societyToken, setSocietyToken] = useState("");
  const [chosenSociety, setChosenSociety] = useState<{
    name: string;
    id: number;
    image: string | null;
  }>();
  const [isSubmit, setIsSubmit] = useState(false);

  // Submit only on the state 
  const societyArgs = api.admin.getSocietyName.useQuery(
    { token: societyToken },
    { enabled: isSubmit, retry: false },
  );

  // If we did fetch something, and we are expecting a response
  if (societyArgs.isFetched && isSubmit) {
    // We received response, not expecting a response
    // This is to avoid using stale data from the previous submit
    setIsSubmit(false);
    if (societyArgs.isSuccess) {
      setChosenSociety(societyArgs.data);
      setCurrentStep((prev) => (prev < total - 1 ? prev + 1 : prev));
    }
  }

  const joinSocietyMutation = api.admin.joinSociety.useMutation();

  const handleSubmit = () => {
    if (chosenSociety != undefined) {
      joinSocietyMutation.mutate({
        id: chosenSociety.id,
      });
    }

    handleCancel();
    handleChange();
  };

  const handleCancel = () => {
    console.log("Handling Cancel");
    setChosenSociety(undefined);
    setCurrentStep(0);
    setSocietyToken("");
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onPress={onOpen} className="max-w-fit" color="primary">
        Join a society
      </Button>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        onClose={() => handleCancel()}
      >
        <ModalContent className="h-fit">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center">
                <span className="text-3xl font-bold">Join a society</span>
              </ModalHeader>
              <ModalBody>
                <p>{currentStep == 0 ? headerStep1 : headerStep2}</p>
                <Progress
                  aria-label="Form progress"
                  value={(currentStep / (total - 1)) * 100}
                  className="max-w-sm py-2"
                />
                <div>
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
                      label="Enter Society Token"
                      placeholder=""
                      value={societyToken}
                      isClearable={true}
                      onClear={() => setSocietyToken("")}
                      onValueChange={(value) => setSocietyToken(value)}
                      isInvalid={societyArgs.isError}
                      errorMessage={
                        societyArgs.isError && societyArgs.error.message
                      }
                    />
                  )}
                  {currentStep === total - 1 && chosenSociety && (
                    <div className="flex flex-row items-center justify-center space-x-4">
                      <Avatar
                        size="lg"
                        className="drop-shadow-md"
                        src={
                          chosenSociety.image
                            ? chosenSociety.image
                            : DefaultIcon.src
                        }
                        alt={`${chosenSociety.name} icon`}
                      />
                      <p>{chosenSociety.name}</p>
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
                      onPress={() => {
                        setChosenSociety(undefined);
                        setIsSubmit(true);
                      }}
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
                      Join
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
