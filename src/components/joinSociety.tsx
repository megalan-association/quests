import { api } from "~/utils/api";
import React from "react";
import { useState, useEffect, useRef } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio, input, Progress, Input, Image, Avatar } from "@nextui-org/react";
import DefaultIcon from "../../public/default.png"

export default function JoinSociety() {
  const total = 2;
  const color = "primary";
  const variant = "flat";
  const headerStep1 = "You can find your society token by checking the MegaLan Discord"
  const headerStep2 = "Are you sure you want to join this society?"

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [currentStep, setCurrentStep] = useState(1);
  const [societyToken, setSocietyToken] = useState('');
  const [error, setError] = useState(false);
  const societyInfo = useRef<{ name: string; id: number; image: string | null; }>();
  const [isSubmit, setIsSubmit] = useState(false);
  const societyArgs = api.admin.getSocietyName.useQuery({token: societyToken}, {enabled: isSubmit, retry: false});
  if (societyArgs.isSuccess) {
    societyInfo.current = societyArgs.data;
  } else {
    societyInfo.current = undefined;
  }

  const joinSocietyMutation = api.admin.joinSociety.useMutation();
  const handleSubmit = () => {
    if (societyInfo.current != undefined) {
      joinSocietyMutation.mutate({
        id: societyInfo.current.id,
      })
    }
    
    handleClose();
  }

  const handleClose = () => {
    societyInfo.current = undefined;
    setCurrentStep(0);
    setSocietyToken('');
    setError(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onPress={onOpen} className="max-w-fit">Open Modal</Button>                    {/** CHANGE */}
      <Modal 
        isOpen={isOpen} 
        placement="top-center"
        onOpenChange={onOpenChange} 
        onClose={() => handleClose()}
      >
        <ModalContent className='h-fit'>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center">
                <span className="font-bold text-3xl">Join a society</span>                   {/** CHANGE */}
              </ModalHeader>  
              <ModalBody>
                <p>{currentStep == 0 ? headerStep1 : headerStep2}</p>
                <Progress aria-label="Form progress" value={(currentStep / (total - 1)) * 100} className="max-w-sm py-2"/>
                <div>
                  {currentStep === 0 &&
                    <Input 
                      size="lg"
                      type="string"
                      variant="bordered"
                      classNames={{inputWrapper: "group-data-[focus=true]:border-primary/50"}}
                      value={societyToken}
                      label="Enter Society Token"
                      placeholder=""
                      isInvalid={societyArgs.isError}
                      errorMessage={societyArgs.isError && societyArgs.error.message}
                      isRequired
                      isClearable={true}
                      onClear={() => setSocietyToken("")}
                      onValueChange={(value) => {setSocietyToken(value); setError(false);}}
                    />
                  }
                  {currentStep === total - 1 && societyInfo.current &&
                    <div className="flex flex-row items-center justify-center space-x-4">
                        <Avatar 
                          size="lg"
                          className="drop-shadow-lg"
                          src={societyInfo.current.image ? societyInfo.current.image : DefaultIcon.src}
                          alt={`${societyInfo.current.name} icon`}
                        />
                        <p>{societyInfo.current.name} lorem ipsum</p>
                    </div>
                  }
                </div>
              </ModalBody>
              <ModalFooter>
                {currentStep === 0 &&
                  <div className="flex flex-row gap-2 w-full justify-end">
                    <Button
                      variant={variant}
                      color={color}
                      onPress={() => {
                        setIsSubmit(true)
                        setTimeout(() => {
                          setIsSubmit(false);
                        }, 50);
                        setTimeout(() => {
                          if (societyArgs.isSuccess) {
                            setCurrentStep((prev) => (prev < (total - 1) ? prev + 1 : prev));
                          }
                        }, 50);
                      }}
                    >
                      Next
                    </Button>
                  </div>
                }
                {currentStep === total - 1 &&
                  <div className="flex flex-row gap-2 w-full justify-between">
                    <Button
                      variant="light"
                      color="danger"
                      onPress={() => handleClose()}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onPress={() =>{
                        handleSubmit();
                        onClose();
                      }}
                      isDisabled={societyArgs.isError && !societyInfo}
                    >
                      Submit
                    </Button>
                  </div>
                }
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
  }