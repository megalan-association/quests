import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Chip,
  Divider,
  Modal,
} from "@nextui-org/react";
import { DotFilledIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { roomTask } from "~/server/api/routers/room";
import SeeMore from "./SeeMore";
import React from "react";

type Props = {
  data: roomTask;
  showComplete?: boolean;
  isCompleted?: boolean;
  handleShowModal: (id: number) => void;
  handleActivate: (status: boolean) => void;
  isAdmin: boolean;
};

const TaskCard: React.FC<Props> = ({
  data,
  isCompleted,
  showComplete,
  handleShowModal,
  handleActivate,
  isAdmin,
}) => {
  return (
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
      {isAdmin && (
        <>
          <Divider />
          <CardFooter className="flex flex-row justify-between">
            <Chip radius="sm" variant="flat" color="warning">
              {data.points} pts
            </Chip>
            <div className="flex flex-row space-x-2 px-2">
              <Checkbox
                defaultSelected={data.activated}
                onValueChange={handleActivate}
                color="success"
                classNames={{
                  base: "bg-default/40 rounded-xl",
                  label: "pr-2 text-sm text-foreground/80",
                }}
              >
                Activate
              </Checkbox>
            </div>
            <Button
              size="md"
              variant="flat"
              color="secondary"
              onClick={() => handleShowModal(data.id)}
              startContent={<Pencil2Icon />}
            >
              Edit
            </Button>
          </CardFooter>
        </>
      )}
      {!isAdmin && showComplete && (
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
                onClick={() => handleShowModal(data.id)}
              >
                Complete Task
              </Button>
            )}
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default TaskCard;
