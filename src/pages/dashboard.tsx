import { UsersIcon } from "@heroicons/react/16/solid"
import { GetServerSideProps } from "next"
import React from "react"
import AdminDashboard from "~/components/AdminDashboard"
import { ssrStatus } from "~/server/api/routers/progress"
import { roomData, ssrGetRoomList } from "~/server/api/routers/room"
import { getServerAuthSession } from "~/server/auth"
import Layout from "./_layout"
import ParticipantDashboard from "~/components/ParticipantDashboard"

type RoomInfo = {
  id: string,
  name: string,
  image: string | null
}

type StatusInfo = {
  completedPoints: number | null,
  totalTasksPoints: number | null,
  completedTasks: number,
  totalTasks: number,
};

export type ParticipantData = {
  rooms: RoomInfo[],
  status: StatusInfo
}

type PropsType = {
  userName: string,
  isAdmin: boolean,
  participantData: ParticipantData | null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx)
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  if (session.user.type == "ADMIN") {
    return {
      props: {
        userName: session.user.name || "",
        isAdmin: true,
        participantData: null
      }
    }
  } else {
    const roomsList = await ssrGetRoomList()
    const userStatus = await ssrStatus(session)
    return {
      props: {
        userName: session.user.name || "",
        isAdmin: false,
        participantData: {
          rooms: roomsList,
          status: userStatus,
          leaderboard: 
        }
      }
    }
  }
} 

const Dashboard: React.FC<PropsType> = (props) => {
  if (props.isAdmin) {
    return (
      <Layout>
        <AdminDashboard />
      </Layout>
    )
  } else if (props.participantData) {
    return (
      <Layout>
        <ParticipantDashboard 
          userName={props.userName} 
          participantData={props.participantData}
         />
      </Layout>
    )
  } else {
    return <Layout><></></Layout>
  }
}

export default Dashboard