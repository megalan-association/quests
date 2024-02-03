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
import { headers } from "next/headers";

type Props = {
  handleChange: () => void;
};

export default function CreateTask({ handleChange }: Props) {
  const total = 6;
  const color = "primary";
  const variant = "flat";
  const headerSteps=[
    "Choose the participating society/societies for this task",
    "Enter a brief and unique name for your task which is understandable at first glance.",
    "Write up a description for a user to complete your task",
    "Assign a points to your task",
    "Is your task starting now, or at another time? You can activate or deactivate a task at a later time in the \"Manage Tasks\" section",
    "Here is a preview of your task",
  ]

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentStep, setCurrentStep] = useState(0);

  const taskMutation = api.task.create.useMutation();

  const [societies, setSocieties] = useState([]);
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
                <p>{headers[currentStep as keyof typeof headers]}</p>
                <Progress
                  aria-label="Form progress"
                  value={(currentStep / (total - 1)) * 100}
                  className="max-w-sm py-2"
                />
                <div>
                  
                </div>
              </ModalBody>
              <ModalFooter>
                
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
