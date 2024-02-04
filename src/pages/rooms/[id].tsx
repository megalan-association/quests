import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getRoomData, roomData } from "~/server/api/routers/room";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";

const Room = ({ room }: { room: roomData }) => {
  const router = useRouter();
  const session = useSession({ required: true });
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{room.info.name}</h1>
      <p>{JSON.stringify(room)}</p>
    </div>
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
