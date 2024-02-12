import { useSession } from "next-auth/react";
import UnAuthorized from "~/components/unauthorized";
import Layout from "../_layout";
import CreateTask from "~/components/createTask";
import { getServerAuthSession } from "~/server/auth";
import { GetServerSideProps } from "next";

import {
  getAdminSocietyList,
  getAllSocieties,
  getAllTask,
} from "~/server/api/routers/admin";
import { api } from "~/utils/api";
import TaskCard from "~/components/TaskCard";
import EditTask from "~/components/editTask";
import { useState } from "react";
import { roomTask } from "~/server/api/routers/room";
import type { Society, Task } from "~/server/api/routers/admin";

export default function ManageTasks({
  joinedSocieties,
  allSocieties,
  allTasks,
}: {
  joinedSocieties: Society[];
  allSocieties: Society[];
  allTasks: Task[];
}) {
  const { data: session, update: update } = useSession({ required: true });

  const [tasks, setTasks] = useState(allTasks);

  const [showEdit, setShowEdit] = useState(false);
  const initTask: roomTask = {
    id: -1,
    description: "",
    name: "",
    points: 100,
    societies: [],
    activated: false,
  };

  const [selectedTask, setSelectedTask] = useState<roomTask>(initTask);

  const utils = api.useUtils();
  const activateMutation = api.task.activate.useMutation();
  const deactivateMutation = api.task.deactivate.useMutation();

  if (!session) {
    return <>Loading...</>;
  } else if (session.user.type !== "ADMIN") {
    return <UnAuthorized permissionsType="ADMIN" />;
  }

  const handleShowEdit = (id: number) => {
    // get old task data from all tasks
    // setshow modal

    const newSelectedTask = tasks.find((task) => task.id == id);

    if (!newSelectedTask) return;

    setSelectedTask(newSelectedTask);

    setShowEdit(true);
  };

  const handleChange = () => {
    setTimeout(async () => {
      const newTasks = await utils.admin.getAllTask.fetch();
      setTasks(newTasks);
    }, 500);
  };

  const handleClose = () => {
    setShowEdit(false);
  };

  const handleActivate = (id: number, status: boolean) => {
    status
      ? activateMutation.mutate({ id: id })
      : deactivateMutation.mutate({ id: id });
  };

  return (
    <>
      <EditTask
        oldTask={selectedTask}
        handleChange={handleChange}
        handleClose={handleClose}
        isOpen={selectedTask && showEdit}
      />
      <Layout padding>
        <main className="flex flex-col items-center">
          <h1 className="w-full pb-10 pt-6 text-center text-3xl font-bold">
            Manage Tasks
          </h1>
          <div className="flex w-full flex-row justify-end px-4">
            <CreateTask
              handleChange={handleChange}
              joinedSocieties={joinedSocieties}
              allSocieties={allSocieties}
            />
          </div>
          <div className="w-screen space-y-4 p-4">
            {tasks?.map((task) => (
              <TaskCard
                key={task.id}
                data={task}
                handleShowModal={(id) => handleShowEdit(id)}
                handleActivate={(id, status) => handleActivate(id, status)}
                isAdmin={session.user.type === "ADMIN"}
              />
            ))}
          </div>
        </main>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const joinedSocieties = await getAdminSocietyList(session.user.id);
  const allSocieties = await getAllSocieties();
  const allTasks = await getAllTask(session.user.id);

  if (!joinedSocieties) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      joinedSocieties: joinedSocieties.societies,
      allSocieties,
      allTasks,
    },
  };
};
