import { GetServerSideProps } from "next";
import React from "react";
import AdminDashboard from "~/components/AdminDashboard";
import { getServerAuthSession } from "~/server/auth";
import ParticipantDashboard from "~/components/ParticipantDashboard";
import { GetRoomList } from "~/server/api/routers/room";
import { StatusInfo, getStatus } from "~/server/api/routers/progress";

export type RoomInfo = {
  id: string;
  name: string;
  image: string | null;
};

type PropsType = {
  userName: string;
  isAdmin: boolean;
  rooms: RoomInfo[];
  status: StatusInfo;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userName: session.user.name || "",
      isAdmin: session.user.type === "ADMIN",
      rooms: await GetRoomList(),
      status: await getStatus(session.user.id),
    },
  };
};

const Dashboard: React.FC<PropsType> = (props) => {
  return props.isAdmin ? (
    <AdminDashboard />
  ) : (
    <ParticipantDashboard
      userName={props.userName}
      rooms={props.rooms}
      status={props.status}
    />
  );
};

export default Dashboard;
