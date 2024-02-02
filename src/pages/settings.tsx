import JoinSociety from "~/components/joinSociety";
import LeaveSociety from "~/components/leaveSociety";
import { getServerAuthSession } from "~/server/auth";
import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import ChangeName from "~/components/changeName";
import { useEffect, useState } from "react";

const Settings = () => {
  const { data: session, update: update } = useSession({ required: true });
  const [onChange, setOnChange] = useState(false);

  if (!session?.user.name) {
    return <>Loading...</>;
  }

  const handleChange = () => {
    update();
    setOnChange(!onChange);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1>Hello {session?.user.name}</h1>
        <ChangeName currentName={session?.user.name} handleChange={() => handleChange()}/>
        <JoinSociety />
        <LeaveSociety isAuthorized={session?.user.type === "ADMIN"}/>
      </div>
    </main>
  );
};

export default Settings;

/**
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
*/