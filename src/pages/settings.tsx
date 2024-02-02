import JoinSociety from "~/components/joinSociety";
import LeaveSociety from "~/components/leaveSociety";
import { getServerAuthSession } from "~/server/auth";
import { Session } from "next-auth";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
  type NextPage,
} from "next";
import { useSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const Settings = () => {
  const { data: session } = useSession();
  console.log(session);

  return (
    <main className=" flex min-h-screen flex-col items-center justify-start">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <JoinSociety />
        <LeaveSociety isAuthorized={session?.user.type === "ADMIN"} />
      </div>
    </main>
  );
};

export default Settings;
