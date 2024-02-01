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

type Society = {
    name: string;
    id: number;
    image: string | null;
}

export default function LeaveSociety() {
  const total = 2;
  const color = "primary";
  const variant = "flat";
  const headerStep1 =
    "Choose a society from the list below to leave";
  const headerStep2 = "Are you sure you want to leave this society?";

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [currentStep, setCurrentStep] = useState(0);
  const [chosenSociety, setChosenSociety] = useState<Society>();
  const [societyList, setSocietyList] = useState<Society[] | undefined>(undefined);

  const societyListArgs = api.admin.getAdminSocietyList.useQuery(undefined, {enabled: societyList === undefined, retry: false, refetchOnWindowFocus: false});
  if (societyListArgs.isSuccess) {
    setSocietyList(societyListArgs.data ? societyListArgs.data.societies : []);
  }

  const leaveSocietyMutation = api.admin.leaveSociety.useMutation();

  const handleSubmit = () => {
    if (chosenSociety) {
        leaveSocietyMutation.mutate({
            id: chosenSociety.id,
        });

        handleCancel();
    }
  };

  // () => setCurrentStep((prev) => (prev < total - 1 ? prev + 1 : prev))

  const handleCancel = () => {
    console.log("Handling Cancel");
    setSocietyList(undefined); 
    setCurrentStep(0);
    setChosenSociety(undefined);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onPress={onOpen} className="max-w-fit" color="primary">
        Leave a society
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
                    <>
                        {/** Society . map into a list*/}
                    </>
                  )}
                  {currentStep === total - 1 && chosenSociety && (
                    <div className="flex flex-row items-center justify-center space-x-4">
                      <Avatar
                        size="lg"
                        className="drop-shadow-lg"
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
                      Leave Society
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
