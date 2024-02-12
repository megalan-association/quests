import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import TaskCard from "~/components/TaskCard";
import {
  getRoomData,
  roomData,
  roomSocieties,
  roomTask,
} from "~/server/api/routers/room";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import Layout from "../_layout";
import { Avatar, Chip, Divider, Image, Progress } from "@nextui-org/react";
import { useState } from "react";
import React from "react";
import { CheckCircledIcon, CheckIcon } from "@radix-ui/react-icons";
import CompleteTaskModal from "~/components/CompleteTaskModal";
import * as Toast from "@radix-ui/react-toast";
import UnAuthorized from "~/components/unauthorized";

const Room = ({ room }: { room: roomData }) => {
  const router = useRouter();
  const session = useSession({ required: true });
  const [selectedSocieties, setSelectedSocieties] = useState<roomSocieties[]>(
    [],
  );
  const [data, setData] = useState(room);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationToast, setShowConfirmationToast] = useState(false);
  const [selectedTask, setSelectedTask] = useState(-1);
  const util = api.useUtils();

  const progress = api.progress.roomStatus.useQuery(
    { roomId: room.info.id },
    { keepPreviousData: true, refetchOnWindowFocus: false },
  );

  if (router.isFallback || session.status === "loading") {
    return <div>Loading...</div>;
  }

  const handleFilterSelect = (soc: roomSocieties) => {
    const societies = selectedSocieties.filter((s) => s.id !== soc.id);
    societies.push(soc);
    setSelectedSocieties([...societies]);
    handleFilter(societies);
  };

  const handleFilterDeselect = (soc: roomSocieties) => {
    const societies = selectedSocieties.filter((s) => s.id !== soc.id);
    setSelectedSocieties([...societies]);
    handleFilter(societies);
  };

  const handleFilter = (socList: roomSocieties[]) => {
    if (socList.length === 0) {
      setData({ ...room });
      return;
    }

    const incompleteTasks: roomTask[] = [];
    const completedTasks: roomTask[] = [];

    let add = false;
    room.incompleteTasks.forEach((t) => {
      t.societies.forEach((s) => {
        if (socList.map((sl) => sl.id).includes(s.id)) {
          add = true;
        }
      });

      if (add) incompleteTasks.push(t);
      add = false;
    });

    room.completedTasks.forEach((t) => {
      t.societies.forEach((s) => {
        if (socList.map((sl) => sl.id).includes(s.id)) {
          add = true;
        }
      });

      if (add) completedTasks.push(t);
      add = false;
    });

    setData({ ...room, completedTasks, incompleteTasks });
  };

  const handleModalClose = (success: boolean) => {
    // fetch latest room data incase user completed task after closing modal
    util.room.getRoomData
      .fetch({ roomId: room.info.id })
      .then((updatedData) => setData({ ...updatedData }));

    setShowModal(false);
    if (success) setTimeout(() => setShowConfirmationToast(true), 500);
  };

  if (session.data.user.type !== "PARTICIPANT")
    return <UnAuthorized permissionsType="PARTICIPANT" />;

  return (
    <>
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={showConfirmationToast}
          onOpenChange={setShowConfirmationToast}
          className="ToastRoot"
        >
          <Toast.Title className="flex flex-row items-center space-x-2 font-semibold text-foreground">
            <CheckCircledIcon className="h-6 w-6 text-green-500" />
            <h1>Successfully Completed Task</h1>
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="ToastViewport" />
      </Toast.Provider>
      <CompleteTaskModal
        isOpen={showModal}
        handleClose={(success) => handleModalClose(success)}
        taskId={selectedTask}
        userId={session.data.user.id}
      />
      <Layout padding={false}>
        <div className="h-36 w-full overflow-hidden object-cover object-center">
          <Image
            src={room.info.image ?? undefined}
            alt="room-image"
            radius="none"
            loading="lazy"
          />
        </div>
        <h1 className="w-full px-4 pt-6 text-center text-3xl font-bold">
          {room.info.name}
        </h1>
        <div className="space-y-2 p-4">
          <div className="flex flex-row justify-between">
            <p className="text-medium font-bold">Progress</p>
            <p className="text-medium">
              {progress.data?.completedPoints} /{" "}
              {progress.data?.totalTasksPoints} pts
            </p>
          </div>
          <Progress
            aria-label="progress"
            size="md"
            isIndeterminate={progress.isLoading || progress.isError}
            value={progress.data?.completedPoints ?? 0}
            maxValue={progress.data?.totalTasksPoints ?? 10}
            color="warning"
          />
          <p className="text-sm text-foreground/60">
            Completed {progress.data?.completedTasks} out of{" "}
            {progress.data?.totalTasks} Tasks
          </p>
        </div>
        <div className="space-y-2 p-4">
          <p className="text-medium font-bold">Filter Societies</p>
          <div className="flex flex-wrap gap-2">
            {selectedSocieties.map((soc, idx) => (
              <Chip
                key={idx}
                avatar={
                  <Avatar
                    src={soc.image ?? undefined}
                    alt="society-logo"
                    name={soc.name}
                    fallback
                  />
                }
                onClick={() => handleFilterDeselect(soc)}
                endContent={<CheckIcon />}
                size="lg"
                radius="sm"
                color="success"
              >
                {soc.name}
              </Chip>
            ))}
            {room.societies
              .filter(
                (s) => !selectedSocieties.map((ss) => ss.id).includes(s.id),
              )
              .map((soc, idx) => (
                <Chip
                  key={idx}
                  avatar={
                    <Avatar
                      src={soc.image ?? undefined}
                      alt="society-logo"
                      name={soc.name}
                      fallback
                    />
                  }
                  onClick={() => handleFilterSelect(soc)}
                  size="lg"
                  radius="sm"
                >
                  {soc.name}
                </Chip>
              ))}
          </div>
        </div>
        {data.incompleteTasks.length > 0 && (
          <div className="space-y-8 px-4 py-8">
            {data.incompleteTasks.map((task, idx) => (
              <React.Fragment key={idx}>
                <TaskCard
                  key={task.id}
                  data={task}
                  showComplete
                  isCompleted={false}
                  handleShowModal={(id) => {
                    setSelectedTask(id);
                    setShowModal(true);
                  }}
                  isAdmin={false}
                  handleActivate={(status) => {}}
                />
              </React.Fragment>
            ))}
          </div>
        )}
        {data.completedTasks.length > 0 && (
          <>
            <h1 className="pt-8 text-center text-xl font-bold">
              Completed Tasks
            </h1>
            <div className="space-y-8 p-4">
              {data.completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  data={task}
                  showComplete
                  isCompleted={true}
                  handleShowModal={(id) => {}}
                  isAdmin={false}
                  handleActivate={(status) => {}}
                />
              ))}
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  let id = ctx.params?.id;

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const roomId = parseInt(id as string, 10);
  const room = await getRoomData(roomId, session.user.id);

  return {
    props: {
      room,
      session,
    },
  };
};

export default Room;
