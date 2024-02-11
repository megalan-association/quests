import { Cog6ToothIcon, MapIcon } from "@heroicons/react/16/solid";
import { Button, Card, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import StatusProgressBar from "./statusProgressBar";
import { RoomInfo } from "~/pages/dashboard";
import Layout from "~/pages/_layout";
import { StatusInfo } from "~/server/api/routers/progress";

type PropsType = {
  userName: string;
  rooms: RoomInfo[];
  status: StatusInfo;
};

const ParticipantDashboard: React.FC<PropsType> = (props) => {
  return (
    <Layout>
      <main className="flex w-full flex-col items-center px-4">
        <h1 className="pb-6 pt-6 text-3xl font-bold">Hi, {props.userName}</h1>
        <StatusProgressBar status={props.status} />
        <div className="flex w-full max-w-96 flex-col space-y-4 px-8 pt-8">
          <Button
            as={Link}
            href="/map"
            color="primary"
            startContent={<MapIcon className="h-4 w-4" />}
          >
            Venue Map
          </Button>
          <Button
            as={Link}
            href="/settings"
            color="primary"
            startContent={<Cog6ToothIcon className="h-4 w-4" />}
          >
            Settings
          </Button>
        </div>
        <div className="flex w-full flex-col items-center pt-8">
          <h3 className="pb-4 text-2xl font-bold">Rooms</h3>
          <div className="grid grid-cols-2 gap-4">
            {props.rooms.map((r) => (
              <a href={`/rooms/${r.id}`} key={r.id}>
                <Card
                  radius="lg"
                  isFooterBlurred
                  className="aspect-square border-none"
                  key={r.id}
                >
                  <Image
                    alt={r.name + "-image"}
                    className="h-full object-cover"
                    height={200}
                    src={r.image ?? "/default.png"}
                    width={200}
                    priority
                  />
                  <CardFooter className="absolute bottom-0 z-10 w-full rounded-lg">
                    <p className="font-bold text-white/80">{r.name}</p>
                  </CardFooter>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ParticipantDashboard;
