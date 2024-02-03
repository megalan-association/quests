import { api } from "~/utils/api";
import React, { useRef } from "react";
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
  Avatar,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import DefaultIcon from "../../public/default.png";

type Society = {
  name: string;
  id: number;
  image: string | null;
};

type Props = {
  isAuthorized: boolean;
  handleChange: () => void;
};

export default function LeaveSociety({ isAuthorized, handleChange }: Props) {
  const total = 2;
  const headerStep1 = "Choose a society from the list below to leave.";
  const headerStep2 = "Are you sure you want to leave this society?";

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentStep, setCurrentStep] = useState(0);
  const [chosenSociety, setChosenSociety] = useState<Society>();

  const societyListArgs = api.admin.getAdminSocietyList.useQuery(undefined, {
    enabled: isAuthorized,
    retry: false,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });
  const leaveSocietyMutation = api.admin.leaveSociety.useMutation();

  if (!isAuthorized) {
    return <></>;
  }

  const societyList = societyListArgs.data
    ? societyListArgs.data.societies
    : [];

  const handleSubmit = () => {
    if (chosenSociety) {
      leaveSocietyMutation.mutate({
        id: chosenSociety.id,
      });
      handleCancel();
      handleChange();
    }
  };

  const handleSelect = (id: React.Key) => {
    // Because we are preselecting, find should not return undefined...
    setChosenSociety(societyList?.find((society) => society.id == id));
    setCurrentStep((prev) => (prev < total - 1 ? prev + 1 : prev));
  };

  const handleCancel = () => {
    console.log("Handling Cancel");
    // Do not refresh the society list if there was no change.
    setCurrentStep(0);
    setChosenSociety(undefined);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onPress={onOpen} className="max-w-fit" color="danger">
        Leave a society
      </Button>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        onClose={() => handleCancel()}
      >
        <ModalContent className="max-h-[50vh]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center">
                <span className="text-3xl font-bold">Leave a society</span>
              </ModalHeader>
              <ModalBody className="flex flex-col items-center overflow-y-scroll">
                <p>{currentStep == 0 ? headerStep1 : headerStep2}</p>
                <Progress
                  aria-label="Form progress"
                  value={(currentStep / (total - 1)) * 100}
                  className="max-w-sm py-2"
                />
                <div className="w-full overflow-y-scroll">
                  {currentStep === 0 && societyList && (
                    <div className="flex h-fit max-w-sm rounded-small border-small border-default-200 px-1 py-2 dark:border-default-100">
                      <Listbox
                        items={societyList}
                        label="Society List"
                        onAction={(key: React.Key) => handleSelect(key)}
                        variant="flat"
                      >
                        {(item) => (
                          <ListboxItem
                            key={item.id}
                            textValue={item.name}
                            showDivider={true}
                          >
                            <div className="flex flex-row items-center gap-2">
                              <Avatar
                                alt={item.name}
                                className="flex-shrink-0"
                                size="md"
                                src={item.image ? item.image : DefaultIcon.src}
                              />
                              <div className="flex flex-col">
                                <span>{item.name}</span>
                              </div>
                            </div>
                          </ListboxItem>
                        )}
                      </Listbox>
                    </div>
                  )}
                  {currentStep === total - 1 && chosenSociety && (
                    <div className="flex flex-row items-center justify-center space-x-4 p-2">
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
