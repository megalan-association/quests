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
        <div className="w-full px-4">
          <StatusProgressBar status={props.status} />
        </div>
        <div className="flex w-full max-w-96 flex-col space-y-4 px-4 pt-8">
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
          <div className="grid w-full grid-cols-2 gap-4">
            {props.rooms.map((r) => (
              <Link href={`/rooms/${r.id}`} key={r.id}>
                <Card
                  isPressable
                  radius="lg"
                  isFooterBlurred
                  className="aspect-square w-full border-none"
                  key={r.id}
                  shadow="md"
                >
                  <Image
                    alt={r.name + "-image"}
                    className="h-full w-full object-cover"
                    height={100}
                    src={r.image ?? "/default.png"}
                    width={100}
                    priority
                  />
                  <CardFooter className="absolute bottom-0 z-10 w-full rounded-lg">
                    <p className="text-sm font-bold text-white/80">{r.name}</p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ParticipantDashboard;
