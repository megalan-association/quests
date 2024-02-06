import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Modal,
} from "@nextui-org/react";
import { DotFilledIcon, DotIcon } from "@radix-ui/react-icons";
import { roomTask } from "~/server/api/routers/room";
import SeeMore from "./SeeMore";
import { useState } from "react";
import CompleteTaskModal from "./CompleteTaskModal";
import React from "react";

type Props = {
  data: roomTask;
  showComplete?: boolean;
  isCompleted?: boolean;
  userId?: number;
};

const TaskCard: React.FC<Props> = ({
  data,
  userId,
  isCompleted,
  showComplete,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <CompleteTaskModal
        isOpen={showModal}
        handleClose={() => setShowModal(false)}
        taskId={data.id}
        userId={userId ?? -1}
      />
      <Card>
        <CardHeader className="space-x-4">
          <AvatarGroup isBordered max={3} size="sm">
            {data.societies.map((soc, idx) => (
              <Avatar
                key={idx}
                alt="society-logo"
                src={soc.image ?? undefined}
                name={soc.name}
                fallback
              />
            ))}
          </AvatarGroup>
          <div className="flex flex-col">
            <h1 className="text-lg ">{data.name}</h1>
            <div className="flex flex-row items-center">
              {data.societies.map((soc, idx) => (
                <React.Fragment key={idx}>
                  <h1 className="text-sm text-foreground/60">{soc.name}</h1>
                  {idx !== data.societies.length - 1 && (
                    <DotFilledIcon className="text-foreground/60" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <SeeMore text={data.description} />
        </CardBody>
        {showComplete && (
          <>
            <Divider />
            <CardFooter className="flex flex-row justify-between">
              <Chip radius="sm" variant="flat" color="warning">
                {data.points} pts
              </Chip>
              {isCompleted ? (
                <Button size="md" variant="flat" color="success" isDisabled>
                  Task is Completed
                </Button>
              ) : (
                <Button
                  size="md"
                  variant="flat"
                  color="primary"
                  onClick={() => setShowModal(true)}
                >
                  Complete Task
                </Button>
              )}
            </CardFooter>
          </>
        )}
      </Card>
    </>
  );
};

export default TaskCard;