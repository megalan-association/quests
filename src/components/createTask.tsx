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
  Select,
  SelectItem,
  Checkbox,
  Input,
  Textarea,
  Radio,
  RadioGroup,
} from "@nextui-org/react";

type Props = {
  handleChange: () => void;
};

// Collab is tracked on its own due to complicated data structure with nextui...
// We also have string values because of the weird way Select works with displaying values
const defaultTask = {
  main: "",
  name: "",
  desc: "",
  points: "100",
  activated: true,
};

const pointValues = [100, 200, 300, 400, 500];

export default function CreateTask({ handleChange }: Props) {
  const total = 4;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentStep, setCurrentStep] = useState(0);
  const [task, setTask] = useState(defaultTask);

  const [isCollab, setIsCollab] = React.useState(false);
  // "society1, society2"
  const [collabKeys, setCollabKeys] = React.useState(new Set<string>([]));
  const displayCollabKeys = React.useMemo(
    () => Array.from(collabKeys).join(", ").replaceAll("_", " "),
    [collabKeys],
  );

  const taskMutation = api.task.create.useMutation();
  const joinedSocietiesArgs = api.admin.getAdminSocietyList.useQuery(
    undefined,
    { retry: false, refetchOnWindowFocus: false },
  );
  const allSocietiesArgs = api.admin.getAllSocieties.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: true,
  });

  const joinedSocieties = joinedSocietiesArgs.data?.societies;
  const allSocieties = allSocietiesArgs.data;

  if (
    joinedSocietiesArgs.isError ||
    !joinedSocieties ||
    allSocietiesArgs.isError ||
    !allSocieties
  ) {
    return <>Loading...</>;
  }

  const handleSubmit = () => {
    let societyNames = [task.main];

    if (collabKeys.size > 0) {
      const collabNames = Array.from(collabKeys);
      societyNames.concat(collabNames);
    }

    const societies = societyNames.map(
      (name) => allSocieties.find((society) => society.name == name)!.id,
    );

    taskMutation.mutate({
      name: task.name,
      description: task.desc,
      activated: task.activated,
      points: Number(task.points),
      societies: societies.map((id: number) => ({ id: id })),
    });

    handleChange();
    handleCancel();
  };

  const handleCancel = () => {
    setCurrentStep(0);
    setIsCollab(false);
    setTask(defaultTask);
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
                {currentStep === 0 ? (
                  <p className="whitespace-pre-line">
                    Choose the participating society/societies for this task
                  </p>
                ) : currentStep === 1 ? (
                  <p className="whitespace-pre-line">
                    Enter a <b>brief and unique</b> name for your task which is
                    understandable at first glance and Assign points to your
                    task
                  </p>
                ) : currentStep === 2 ? (
                  <p className="whitespace-pre-line">
                    Write up a description for a user to complete your task
                  </p>
                ) : currentStep === 3 ? (
                  <p className="whitespace-pre-line">
                    You can activate or deactivate a task at a later time in the{" "}
                    <b>"Manage Tasks"</b> section
                  </p>
                ) : (
                  <p className="whitespace-pre-line">
                    Your task is created!
                    <br />
                    Here is a preview of your task
                  </p>
                )}
                <Progress
                  aria-label="Form progress"
                  value={(currentStep / (total - 1)) * 100}
                  className="max-w-sm py-2"
                />
                <div className="flex flex-col items-center">
                  {currentStep == 0 && (
                    <div className="flex w-full flex-col gap-8">
                      <Select
                        label="Your society"
                        className="max-w-sm"
                        isRequired={true}
                        itemType="string"
                        selectionMode="single"
                        selectedKeys={[task.main]}
                        onSelectionChange={(key) =>
                          setTask({
                            ...task,
                            main: String(Object.values(key)[0]),
                          })
                        }
                      >
                        {joinedSocieties.map((society) => (
                          <SelectItem key={society.name} value={society.name}>
                            {society.name}
                          </SelectItem>
                        ))}
                      </Select>
                      {task.main.length > 0 && (
                        <Checkbox
                          isSelected={isCollab}
                          onValueChange={() => setIsCollab(!isCollab)}
                        >
                          This task is a collab
                        </Checkbox>
                      )}
                      {isCollab && (
                        <Select
                          label="Collaboration Socities"
                          className="max-w-sm"
                          isRequired={true}
                          itemType="string"
                          selectionMode="multiple"
                          selectedKeys={displayCollabKeys}
                          // @ts-expect-error
                          onChange={setCollabKeys}
                        >
                          {allSocieties
                            .filter((society) => society.name != task.main)
                            .map((society) => (
                              <SelectItem
                                key={society.name}
                                value={society.name}
                              >
                                {society.name}
                              </SelectItem>
                            ))}
                        </Select>
                      )}
                    </div>
                  )}
                  {currentStep == 1 && (
                    <div className="flex w-full flex-col gap-4">
                      <Input
                        isRequired
                        type="string"
                        label="Task Name"
                        className="max-w-sm"
                        size="md"
                        isClearable={true}
                        value={task.name}
                        onValueChange={(value: string) =>
                          setTask({ ...task, name: value })
                        }
                        onClear={() => setTask({ ...task, name: "" })}
                      />
                      {task.name.length > 0 && (
                        <Select
                          label="Task points"
                          placeholder="Select the points value for this task"
                          className="max-w-sm"
                          isRequired={true}
                          itemType="number"
                          selectionMode="single"
                          selectedKeys={[task.points]}
                          onSelectionChange={(key) =>
                            setTask({ ...task, points: Object.values(key)[1] })
                          }
                        >
                          {pointValues.map((points) => (
                            <SelectItem
                              key={points}
                              value={points}
                              textValue={String(points)}
                            >
                              {points}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    </div>
                  )}
                  {currentStep == 2 && (
                    <Textarea
                      isRequired
                      label="Task Description"
                      labelPlacement="outside"
                      placeholder="Enter your task description"
                      className="max-w-sm"
                      value={task.desc}
                      onChange={(e) =>
                        setTask({ ...task, desc: e.target.value })
                      }
                    />
                  )}
                  {currentStep == 3 && (
                    <div className="flex flex-col gap-4">
                      <p>Is your task available to be completed right now?</p>

                      <RadioGroup
                        value={task.activated ? "yes" : "no"}
                        onChange={(e) =>
                          setTask({
                            ...task,
                            activated: e.target.value === "yes",
                          })
                        }
                      >
                        <Radio value="yes">Yes</Radio>
                        <Radio value="no">No</Radio>
                      </RadioGroup>
                      <p className="text-sm text-gray-600">
                        This is so participants do not try to complete a task
                        that is not yet set up or expired.
                      </p>
                    </div>
                  )}
                  {currentStep == 4 && <div></div>}
                </div>
              </ModalBody>
              <ModalFooter>
                {currentStep == 0 && task.main.length > 0 && (
                  <div className="flex w-full flex-row justify-between gap-2">
                    <Button variant="light" color="danger" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onPress={() =>
                        setCurrentStep((prev) =>
                          prev < total - 1 ? prev + 1 : prev,
                        )
                      }
                    >
                      Next Step
                    </Button>
                  </div>
                )}
                {currentStep == 1 && task.name.length > 0 && (
                  <div className="flex w-full flex-row justify-between gap-2">
                    <Button
                      color="primary"
                      onPress={() =>
                        setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev))
                      }
                    >
                      Back
                    </Button>
                    <Button
                      color="primary"
                      onPress={() =>
                        setCurrentStep((prev) =>
                          prev < total - 1 ? prev + 1 : prev,
                        )
                      }
                    >
                      Next Step
                    </Button>
                  </div>
                )}
                {currentStep == 2 && task.desc.length > 0 && (
                  <div className="flex w-full flex-row justify-between gap-2">
                    <Button
                      variant="light"
                      color="primary"
                      onPress={() =>
                        setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev))
                      }
                    >
                      Back
                    </Button>
                    <Button
                      color="primary"
                      onPress={() =>
                        setCurrentStep((prev) =>
                          prev < total - 1 ? prev + 1 : prev,
                        )
                      }
                    >
                      Next Step
                    </Button>
                  </div>
                )}
                {currentStep == 3 && (
                  <div className="flex w-full flex-row justify-between gap-2">
                    <Button
                      variant="light"
                      color="primary"
                      onPress={() =>
                        setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev))
                      }
                    >
                      Back
                    </Button>
                    <Button
                      color="primary"
                      onPress={() => {
                        handleSubmit();
                        onClose();
                      }}
                    >
                      Submit
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
