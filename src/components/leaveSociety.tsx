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

export default function LeaveSociety() {
  const total = 2;
  const headerStep1 = "Choose a society from the list below to leave";
  const headerStep2 = "Are you sure you want to leave this society?";

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [currentStep, setCurrentStep] = useState(0);
  const [chosenSociety, setChosenSociety] = useState<Society>();
  const [societyList, setSocietyList] = useState<Society[] | undefined>(
    undefined,
  );

  const societyListArgs = api.admin.getAdminSocietyList.useQuery(undefined, {
    enabled: societyList === undefined,
    retry: false,
    refetchOnWindowFocus: false,
  });
  if (societyListArgs.isSuccess) {
    setSocietyList(societyListArgs.data ? societyListArgs.data.societies : []);
  }

  const leaveSocietyMutation = api.admin.leaveSociety.useMutation();

  const handleSubmit = () => {
    if (chosenSociety) {
      leaveSocietyMutation.mutate({
        id: chosenSociety.id,
      });
      if (leaveSocietyMutation.isSuccess) {
        handleCancel();
      } else {
        console.log("Uh oh...: Left a society that the user was not a part of");
      }
    }
  };

  const handleSelect = (id: React.Key) => {
    if (typeof id == "number") {
      // Because we are preselecting, find should not return undefined...
      setChosenSociety(societyList?.find((society) => society.id == id));
      setCurrentStep((prev) => (prev < total - 1 ? prev + 1 : prev));
    }
  };

  const handleCancel = () => {
    console.log("Handling Cancel");
    // Do not refresh the society list if there was no change.
    setCurrentStep(0);
    setChosenSociety(undefined);
  };

  const handleOpen = () => {
    setSocietyList(undefined);
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onPress={handleOpen} className="max-w-fit" color="primary">
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
                    <div className="w-full max-w-[260px] rounded-small border-small border-default-200 px-1 py-2 dark:border-default-100">
                      <Listbox
                        classNames={{
                          base: "max-w-xs",
                          list: "max-h-[300px] overflow-scroll",
                        }}
                        items={societyList}
                        label="Society List"
                        onAction={(key: React.Key) => handleSelect(key)}
                        variant="flat"
                      >
                        {(item) => (
                          <ListboxItem key={item.id} textValue={item.name}>
                            <div className="flex items-center gap-2">
                              <Avatar
                                alt={item.name}
                                className="flex-shrink-0"
                                size="sm"
                                src={item.image ? item.image : DefaultIcon.src}
                              />
                              <div className="flex flex-col">
                                <span className="text-small">{item.name}</span>
                              </div>
                            </div>
                          </ListboxItem>
                        )}
                      </Listbox>
                    </div>
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
