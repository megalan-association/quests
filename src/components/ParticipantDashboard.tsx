import { Cog6ToothIcon, MapIcon } from "@heroicons/react/16/solid"
import { Button } from "@nextui-org/react"
import Link from "next/link"
import { ParticipantData } from "~/pages/dashboard"

type PropsType = {
  userName: string,
  participantData: ParticipantData
}

const ParticipantDashboard: React.FC<PropsType> = (props) => {
  return (
    <main>
      <p>Progress bar and stats here</p>
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
      <p>Rooms list here</p>
    </main>
  )
}

export default ParticipantDashboard