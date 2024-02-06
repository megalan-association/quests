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
import { Avatar, Chip, Divider } from "@nextui-org/react";
import { useState } from "react";
import React from "react";
import { CheckIcon } from "@radix-ui/react-icons";

const Room = ({ room }: { room: roomData }) => {
  const router = useRouter();
  const session = useSession({ required: true });
  const [selectedSocieties, setSelectedSocieties] = useState<roomSocieties[]>(
    [],
  );
  const [data, setData] = useState(room);

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

  return (
    <Layout>
      <h1 className="w-full pt-6 text-center text-3xl font-bold">
        {room.info.name} Room
      </h1>
      <Divider />
      <div className="space-y-2 p-4">
        <p className="text-lg">Filter by Societies</p>
        <div className="space-x-2">
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
            .filter((s) => !selectedSocieties.map((ss) => ss.id).includes(s.id))
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
      <Divider />
      <div className="space-y-8 px-4 py-8">
        {data.incompleteTasks.map((task, idx) => (
          <React.Fragment key={idx}>
            <TaskCard
              key={task.id}
              data={task}
              showComplete
              isCompleted={false}
              userId={session.data.user.id}
            />
          </React.Fragment>
        ))}
      </div>
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
              />
            ))}
          </div>
        </>
      )}
    </Layout>
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