import { $Enums } from "@prisma/client";
import { useSession } from "next-auth/react";
import UnAuthorized from "~/components/unauthorized";
import Layout from "../_layout";
import CreateTask from "~/components/createTask";
import { getServerAuthSession } from "~/server/auth";
import { GetServerSideProps } from "next";

import {
  getAdminSocietyList,
  getAllSocieties,
} from "~/server/api/routers/admin";
import { api } from "~/utils/api";
import TaskCard from "~/components/TaskCard";
import EditTask from "~/components/editTask";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { roomTask } from "~/server/api/routers/room";

export type Societies = {
  id: number;
  name: string;
  image: string | null;
};

export default function ManageTasks({
  joinedSocieties,
  allSocieties,
}: {
  joinedSocieties: Societies[];
  allSocieties: Societies[];
}) {
  const { data: session, update: update } = useSession({ required: true });

  const tasks = api.admin.getAllTask.useQuery(undefined, {
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
  });

  const [showEdit, setShowEdit] = useState(false);
  
  const [selectedTask, setSelectedTask] = useState<roomTask | undefined>();

  if (!session) {
    return <>Loading...</>;
  } else if (session.user.type !== "ADMIN") {
    return <UnAuthorized />;
  }

  const handleShowEdit = (id: number) => {
    console.log(id);
    // get old task data from all tasks
    // setshow modal
    
    const newSelectedTask = tasks.data?.find((task) => task.id == id);
    
    if (!newSelectedTask) return;

    console.log("New task selected");
    console.log(newSelectedTask);
    
    setSelectedTask(newSelectedTask);

    setShowEdit(true);
  };

  const handleClose = () => {
    setShowEdit(false);
    setSelectedTask(undefined);
  }

  const handleActivate = (id: number, status: boolean) => {
    console.log(id);
  };

  const handleChange = async () => {
    // give it half a second for the db to update when the user updates anything
    setTimeout(() => {
      update();
    }, 500);
  };

  return (
    <>

    <Layout>
      <main className="flex flex-col items-center">
        {selectedTask && <EditTask oldTask={selectedTask} handleClose={handleClose} isOpen={showEdit} />}
        <CreateTask
          handleChange={handleChange}
          joinedSocieties={joinedSocieties}
          allSocieties={allSocieties}
        />
        <div className="p-4 space-y-4">
          {tasks.data?.map((task) => (
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
      allSocieties: allSocieties,
    },
  };
};
