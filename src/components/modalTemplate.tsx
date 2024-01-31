import { api } from "~/utils/api";
import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio, input, Progress} from "@nextui-org/react";

export default function ModalTemplate() {
  const total = 3;
  const color = "secondary";
  const variant = "flat";

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [currentPage, setCurrentPage] = React.useState(1);
  
  return (
    <div className="flex flex-col gap-2">
      <Button onPress={onOpen} className="max-w-fit">Open Modal</Button>              {/** CHANGE */}
      <Modal 
        isOpen={isOpen} 
        placement="top-center"
        onOpenChange={onOpenChange} 
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center">
                <span className="font-bold text-3xl">Modal Title</span>                                              {/** CHANGE */}
              </ModalHeader>  
              <ModalBody>
                <p className="text-lg">Flavour text do it here like this abc</p>
                <Progress aria-label="Form progress" value={(currentPage / total) * 100} className="max-w-sm"/>
                <div>
                
                </div>
              </ModalBody>

              <ModalFooter>
                <div className="flex flex-row gap-2 w-full justify-between">
                  <Button
                    variant={variant}
                    color={color}
                    onPress={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
                  >
                    BACK
                  </Button>
                  
                {currentPage === 3 ? 
                    <Button color="primary" onPress={onClose}>
                      SUBMIT
                    </Button>
                  :
                    <Button
                      variant={variant}
                      color={color}
                      onPress={() => setCurrentPage((prev) => (prev < total ? prev + 1 : prev))}
                    >
                      NEXT
                    </Button>
                }
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
  }