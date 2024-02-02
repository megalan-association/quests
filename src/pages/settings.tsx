import JoinSociety from "~/components/joinSociety";
import LeaveSociety from "~/components/leaveSociety";
import { getServerAuthSession } from "~/server/auth";
import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import ChangeName from "~/components/changeName";

const Settings = () => {
  const { data: session } = useSession({ required: true });

  if (!session?.user.name) {
    return <>Loading...</>;
  }

  return (
    <main className=" flex min-h-screen flex-col items-center justify-start">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1>Hello {session?.user.name}</h1>
        <ChangeName currentName={session?.user.name} />
        <JoinSociety />
        <LeaveSociety isAuthorized={session?.user.type === "ADMIN"} />
      </div>
    </main>
  );
};

export default Settings;

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

  return {
    props: { session },
  };
};
