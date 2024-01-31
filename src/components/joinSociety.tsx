import { api } from "~/utils/api";
import React from "react";
import { useState, useEffect, useRef } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio, input, Progress, Input} from "@nextui-org/react";

export default function JoinSociety() {
  const total = 2;
  const color = "primary";
  const variant = "flat";
  const headerStep1 = "You can find your society token by checking the MegaLan Discord"
  const headerStep2 = "We've found your society!"

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [currentStep, setCurrentStep] = useState(1);
  const [societyToken, setSocietyToken] = useState('');
  const [error, setError] = useState(false);
  const societyInfo = useRef<{ name: string; id: number; image: string | null; }>();

  const submit = useRef(false);

  const societyArgs = api.admin.getSocietyName.useQuery({token: societyToken}, {enabled: submit.current, retry: false});
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
    setCurrentStep(1);
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
        <ModalContent className='h-[50vh]'>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center">
                <span className="font-bold text-3xl">Join a society</span>                   {/** CHANGE */}
              </ModalHeader>  
              <ModalBody>
                <p className="text-lg h-16">{currentStep == 1 ? headerStep1 : headerStep2}</p>
                <Progress aria-label="Form progress" value={(currentStep / total) * 100} className="max-w-sm my-4"/>
                <div>
                  {currentStep === 1 &&
                    <Input 
                      size="lg"
                      type="string"
                      value={societyToken}
                      label="Enter Society Token"
                      isInvalid={error}
                      errorMessage={error && "Society token is invalid"}
                      placeholder=""
                      isRequired
                      isClearable={true}
                      onClear={() => setSocietyToken("")}
                      onValueChange={(value) => {setSocietyToken(value); setError(false);}}
                    />
                  }
                  {currentStep === total &&
                    <div>
                      {societyInfo.current &&
                        <span>{societyInfo.current?.name}</span>
                      }
                    </div>
                  }
                </div>
              </ModalBody>
              <ModalFooter>
                {currentStep === 1 &&
                  <div className="flex flex-row gap-2 w-full justify-end">
                    <Button
                      variant={variant}
                      color={color}
                      onPress={() => {
                        submit.current = true;
                        setTimeout(() => {
                          submit.current = false
                        }, 50);
                        setTimeout(() => {
                          if (societyArgs.isSuccess) {
                            setCurrentStep((prev) => (prev < total ? prev + 1 : prev));
                            setError(false);
                          } else {
                            setError(true);
                          }
                        }, 300);
                      }}
                    >
                      NEXT
                    </Button>
                  </div>
                }
                {currentStep === total &&
                  <div className="flex flex-row gap-2 w-full justify-between">
                    <Button
                      variant={variant}
                      color="default"
                      onPress={() => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev))}
                    >
                      RUN IT BACK
                    </Button>
                    <Button
                      color="primary"
                      onPress={() =>{
                        handleSubmit()
                      }}
                      isDisabled={societyArgs.isError && !societyInfo}
                    >
                      SUBMIT
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