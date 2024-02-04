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
  Input,
  Avatar,
} from "@nextui-org/react";
import DefaultIcon from "../../public/default.png";
import Societies from "./createTaskComponents/societies";

type Props = {
  handleChange: () => void;
};

export default function CreateTask({ handleChange }: Props) {
  const total = 6;
  const color = "primary";
  const variant = "flat";
  // checkbox for 2nd society list (all societiwess
  // points max 500
  // Step 4 is the submit, 
  // error handling client side with nextui input fields (minimum length) 
  const headerSteps = [
    "Choose the participating society/societies for this task",
    "Enter a brief and unique name for your task which is understandable at first glance and Assign points to your task",
    "Write up a description for a user to complete your task",
    "Is your task available to complete? You can activate or deactivate a task at a later time in the \"Manage Tasks\" section",
    "Your task is created! Here is a preview of your task",
  ]

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentStep, setCurrentStep] = useState(0);
  const taskMutation = api.task.create.useMutation();

  const [societies, setSocieties] = useState<{id: number}[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [points, setPoints] = useState(100);
  const [isActive, setIsActive] = useState(false);

  const handleSubmit = () => {
    handleChange();
    taskMutation.mutate({
      name,
      description: desc,
      activated: isActive,
      points,
      societies,
    })
  }

  const handleCancel = () => {
    setCurrentStep(0);
    setSocieties([]);
    setName("");
    setDesc("");
    setPoints(100);
    setIsActive(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onPress={onOpen} className="max-w-fit" color="primary">
        Create a Task
      </Button>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        onClose={handleCancel}
      >
        <ModalContent className="h-fit">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center">
                <span className="text-3xl font-bold">Create a Task</span>
              </ModalHeader>
              <ModalBody>
                <p>{headerSteps[currentStep]}</p>
                <Progress
                  aria-label="Form progress"
                  value={(currentStep / (total - 1)) * 100}
                  className="max-w-sm py-2"
                />
                <div className="flex flex-col items-center">
                  {currentStep == 0 &&
                    <Societies setSocieties={(societies) => setSocieties(societies)} />
                  }
                  {currentStep == 1 &&
                    <div></div>
                  }
                  {currentStep == 2 &&
                    <div></div>
                  }
                  {currentStep == 3 &&
                    <div></div>
                  }
                  {currentStep == 4 &&
                    <div></div>
                  }
                </div>
              </ModalBody>
              <ModalFooter>
                {currentStep == 0 && societies.length > 0 &&
                  <div className="flex w-full flex-row justify-between gap-2">
                    <Button
                      variant="light"
                      color="danger"
                      onPress={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onPress={() => setCurrentStep((prev) => (prev < total - 1 ? prev + 1 : prev))}
                    >
                      Next Step
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
