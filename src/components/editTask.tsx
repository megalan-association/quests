import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  SelectItem,
  Select,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { roomTask } from "~/server/api/routers/room";

type Props = {
  oldTask: roomTask;
  handleChange: () => void;
  handleClose: () => void;
  isOpen: boolean;
};

const pointValues = [100, 200, 300, 400, 500];

// name, desc, activated, points

export default function EditTask({
  oldTask,
  handleChange,
  handleClose,
  isOpen,
}: Props) {
  // Points need to be string for select to work smoothly
  const [newTask, setNewTask] = useState<roomTask | undefined>(undefined);
  const editMutation = api.task.edit.useMutation();

  const handleSubmit = () => {
    if (!newTask) {
      return;
    }

    editMutation.mutate({
      id: newTask.id,
      name: newTask.name,
      description: newTask.description,
      activated: newTask.activated,
      points: Number(newTask.points),
    });

    handleClose();
    handleChange();
  };

  useEffect(() => {
    const handleMount = () => {
      setNewTask({
        ...oldTask,
        points: oldTask.points,
      });
    };

    handleMount();
  }, [oldTask]);

  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      backdrop="blur"
      onClose={handleClose}
    >
      {newTask && (
        <ModalContent className="h-fit">
          <ModalHeader className="flex flex-col items-center">
            <span className="text-3xl font-bold">Edit a Task</span>
          </ModalHeader>
          <ModalBody>
            <div className="flex w-full flex-col gap-4">
              <Input
                isRequired
                type="string"
                label="Edit Task Name"
                className="max-w-sm"
                size="md"
                isClearable={true}
                value={newTask.name}
                onValueChange={(value: string) =>
                  setNewTask({ ...newTask, name: value })
                }
                onClear={() => setNewTask({ ...newTask, name: "" })}
              />
              <Select
                label="Task points"
                className="max-w-sm"
                isRequired={true}
                itemType="number"
                selectionMode="single"
                disallowEmptySelection={true}
                selectedKeys={[String(newTask.points)]}
                onSelectionChange={(key) =>
                  setNewTask({
                    ...newTask,
                    points: Number(Object.values(key)[1]),
                  })
                }
              >
                {pointValues.map((points) => (
                  <SelectItem
                    key={String(points)}
                    value={String(points)}
                    textValue={String(points)}
                  >
                    {points}
                  </SelectItem>
                ))}
              </Select>
              <Textarea
                isRequired
                label="Edit Task Description"
                labelPlacement="inside"
                placeholder="Edit your task description"
                className="max-w-sm"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="flex w-full flex-row justify-between gap-2">
              <Button
                variant="light"
                color="danger"
                onPress={() => handleClose()}
              >
                Cancel
              </Button>
              <Button color="primary" onPress={() => handleSubmit()}>
                Submit Changes
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
}
