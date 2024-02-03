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

  const taskMutation = api.task.create.useMutation();

  const societies = useRef([]);
  const name = useRef("");
  const desc = useRef("");
  const points = useRef(100);
  const isActive = useRef(false);

  const handleSubmit = () => {
    handleChange();
    taskMutation.mutate({
      name: name.current,
      description: desc.current,
      activated: isActive.current,
      points: points.current,
      societies: societies.current,
    })
  }

  return (
    <div className="flex flex-col gap-2">
      
    </div>
  );
}
