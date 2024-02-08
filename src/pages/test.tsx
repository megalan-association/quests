import AdminDashboard from "~/components/AdminDashboard"
import Layout from "./_layout"
import { ParticipantData } from "./dashboard"
import ParticipantDashboard from "~/components/ParticipantDashboard"

type PropsType = {
  userName: string,
  participantData: ParticipantData
}

const test: React.FC = () => {
  
  const userProps: PropsType = {
    userName: "cockatoo",
    participantData: {
      rooms: [
        {
          id: "1",
          name: "cockatoo room 1",
          image: null
        },
        {
          id: "2",
          name: "cockatoo room 2",
          image: null
        },
        {
          id: "3",
          name: "cockatoo room 3",
          image: null
        },
        {
          id: "4",
          name: "cockatoo room 4",
          image: null
        },
        {
          id: "5",
          name: "cockatoo room 5",
          image: null
        },
        {
          id: "6",
          name: "cockatoo room 6",
          image: null
        },
        {
          id: "7",
          name: "cockatoo room 7",
          image: null
        },
        {
          id: "8",
          name: "cockatoo room 8",
          image: null
        },
        {
          id: "9",
          name: "cockatoo room 9",
          image: null
        },
      ],
      status: {
        completedPoints: 20,
        totalTasksPoints: 40,
        completedTasks: 20,
        totalTasks: 30
      }
    }
  }
  return (
    <Layout>
      <ParticipantDashboard 
        userName={userProps.userName} 
        participantData={userProps.participantData}
      />
    </Layout>
  )
}

export default test