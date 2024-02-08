import { GetServerSideProps } from "next"
import { getRoomList } from "~/server/api/routers/room"
import { getServerAuthSession } from "~/server/auth"
import { db } from "~/server/db"

type AdminData = {}

type UserData = {}

type PropsType = {
  userName: string,
  isAdmin: boolean,
  adminData: AdminData | null,
  userData: UserData | null
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

  } else {
    
  }
} 

const Dashboard = () => {

}

export default Dashboard