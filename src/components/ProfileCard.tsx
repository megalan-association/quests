import { Avatar, Card, CardBody } from "@nextui-org/react";
import { PersonIcon } from "@radix-ui/react-icons";
import { Session } from "next-auth";

type Props = {
  name?: string;
  image?: string;
  //   handleChange: () => void;
};

const ProfileCard: React.FC<Props> = ({ name, image }) => {
  return (
    <Card shadow="sm">
      <CardBody className="flex flex-row items-center space-x-4 px-4">
        <Avatar
          alt="pfp"
          src={image ?? undefined}
          showFallback
          fallback={<PersonIcon className="text-black" />}
          size="md"
        />
        <p className="text-lg text-black/80">{name ?? "User"}</p>
      </CardBody>
    </Card>
  );
};
export default ProfileCard;
