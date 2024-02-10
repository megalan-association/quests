import { GetServerSideProps } from "next"
import React from "react"
import AdminDashboard from "~/components/AdminDashboard"
import { getServerAuthSession } from "~/server/auth"
import Layout from "./_layout"
import ParticipantDashboard from "~/components/ParticipantDashboard"
import { ssrGetRoomList } from "~/server/api/routers/room"

export type RoomInfo = {
  id: string,
  name: string,
  image: string | null
}

// type StatusInfo = {
//   completedPoints: number | null,
//   totalTasksPoints: number | null,
//   completedTasks: number,
//   totalTasks: number,
// };

// export type ParticipantData = {
//   rooms: RoomInfo[],
//   status: StatusInfo
// }

type PropsType = {
  userName: string,
  isAdmin: boolean,
  rooms: RoomInfo[]
  // participantData: ParticipantData | null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx)
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false
      }
    }
  }

  return {
    props: {
      userName: session.user.name || "",
      isAdmin: session.user.type === "ADMIN",
      rooms: await ssrGetRoomList()
    }
  }

  // if (session.user.type == "ADMIN") {
  //   return {
  //     props: {
  //       userName: session.user.name || "",
  //       isAdmin: true,
  //       participantData: null
  //     }
  //   }
  // } else {
  //   const roomsList = await ssrGetRoomList()
  //   const userStatus = await ssrStatus(session)
  //   return {
  //     props: {
  //       userName: session.user.name || "",
  //       isAdmin: false,
  //       participantData: {
  //         rooms: roomsList,
  //         status: userStatus
  //       }
  //     }
  //   }
  // }
} 

const Dashboard: React.FC<PropsType> = (props) => {
  if (props.isAdmin) {
    return (
      <Layout>
        <AdminDashboard />
      </Layout>
    )
  } else {
    return (
      <Layout>
        <ParticipantDashboard 
          userName={props.userName} 
          rooms={props.rooms}
         />
      </Layout>
    )
  }
}

export default Dashboard