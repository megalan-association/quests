import type { GetServerSidePropsContext, InferGetServerSidePropsType, GetServerSideProps } from "next"
import JoinSociety from "~/components/joinSociety"
import LeaveSociety from "~/components/leaveSociety"
import { authOptions, getServerAuthSession } from "~/server/auth"
import { Session } from "next-auth"

/**
export const getServerSideProps = async (context: {req: GetServerSidePropsContext["req"], res: GetServerSidePropsContext["res"]}) => {
  const session = await getServerAuthSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  console.log({props: {
    session,
  }})

  return {
    props: {
      session,
    },
  }
*/
export const getServerSideProps: GetServerSideProps<{
    session: Session | null;
  }> = async ctx => {
    return {
      props: {
        session: await getServerAuthSession(ctx),
      },
    };
};

export default function Settings({ session }: any) {
  console.log(session)
  
  return (
    <main className=" flex min-h-screen flex-col items-center justify-start">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <JoinSociety />
      {/**<LeaveSociety isAuthorized={session.user.type === "ADMIN"}/>*/}
      </div>
    </main>
  )
}