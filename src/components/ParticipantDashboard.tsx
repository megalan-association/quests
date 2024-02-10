import { Cog6ToothIcon, MapIcon } from "@heroicons/react/16/solid"
import { Button } from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import StatusProgressBar from "./statusProgressBar"
import { RoomInfo } from "~/pages/dashboard"

type PropsType = {
  userName: string,
  rooms: RoomInfo[]
}

const ParticipantDashboard: React.FC<PropsType> = (props) => {
  return (
    <main className="w-full lg:w-[1024px] mx-auto p-2 sm:p-4">
      <h2 className="text-4xl font-bold">Hi, {props.userName}</h2>
      <div>
        <StatusProgressBar />
      </div>
      <div className="hidden sm:block text-center py-1">
        <Button
          as={Link}
          href="/settings"
          color="primary"
          startContent={<Cog6ToothIcon className="w-4 h-4" />}
          className="w-64 font-bold mr-1"
        >
          Settings
        </Button>
          <Button
            /*
              Uncomment below attributes and fill in href when page exists
              as={Link}
              href=""
            */
            color="primary"
            startContent={<MapIcon className="w-4 h-4" />}
            className="w-64 font-bold ml-1"
          >
            Venue Map
          </Button>
      </div>
      <div className="block sm:hidden text-center py-1">
          <Button
            as={Link}
            href="/settings"
            color="primary"
            startContent={<Cog6ToothIcon className="w-4 h-4" />}
            className="w-64 font-bold"
          >
            Settings
          </Button>
      </div>
      <div className="block sm:hidden text-center py-1">
        <Button
          /*
            Uncomment below attributes and fill in href when page exists
            as={Link}
            href=""
          */
          color="primary"
          startContent={<MapIcon className="w-4 h-4" />}
          className="w-64 font-bold"
        >
          Venue Map
        </Button>
      </div>
      <div>
        <h3 className="text-lg font-bold">MegaLAN Rooms</h3>
        <div className="block sm:grid sm:grid-cols-2 lg:grid-cols-3 mx-auto">
          {props.rooms.map((r) => (
            <div className="p-1">
              <Button
                key={r.id}
                as={Link}
                href={`/rooms/${r.id}`}
                size="lg"
                startContent={r.image 
                  ? <Image src={r.image} alt="" className="h-8 w-8" height={32} width={32} /> 
                  : <div className="h-8 w-8 rounded-full bg-primary-500" />}
                className="w-full text-2xl font-bold"
              >
                {r.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default ParticipantDashboard