import React, { useEffect } from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Checkbox, Selection, select} from "@nextui-org/react";
import { api } from "~/utils/api";

type Props = {
  setSocieties: (societies: {id: number}[]) => void;
}
type Society = {
  name: string;
  id: number;
  image: string | null;
}

export default function Societies({ setSocieties }: Props) {
  const [primaryKey, setPrimaryKey] = React.useState<Society | undefined>(undefined);
  const [collabKeys, setCollabKeys] = React.useState(new Set<string>([]));

  const [isCollab, setIsCollab] = React.useState(false);

  const joinedSocietiesArgs = api.admin.getAdminSocietyList.useQuery(undefined, {retry: false, refetchOnWindowFocus: false});
  const allSocietiesArgs = api.admin.getAllSocieties.useQuery(undefined, {retry: false, refetchOnWindowFocus: true});
    
  const joinedSocieties = joinedSocietiesArgs.data?.societies;
  const allSocieties = allSocietiesArgs.data;

  const displayCollabKeys = React.useMemo(
    () => Array.from(collabKeys).join(", ").replaceAll("_", " "),
    [collabKeys]
  );

  useEffect(() => {
    // Collab keys are string because of stupid dropbox NextUI implementation that I'm too tired to change

    if (!allSocieties || !primaryKey) {
      return;
    }

    let societies = [primaryKey?.id];

    if (collabKeys.size > 0) {
      Array.from(collabKeys).map((collabName: string) => allSocieties.filter((society) => society.name === collabName)[0]).forEach((collab) => collab && societies.push(collab.id));
    }

    setSocieties(societies.map((socId) => ({"id": socId})));

  }, [primaryKey, collabKeys])

  if (joinedSocietiesArgs.isError || !joinedSocieties || allSocietiesArgs.isError || !allSocieties) {
    return <>Loading...</>
  }

  return (
    <div className="flex flex-col w-[80vw] md:w-[350px] gap-4">
      <Dropdown classNames={{base: "w-[80vw] md:w-[350px]"}} >
        <DropdownTrigger>
          <Button 
            variant="bordered"
          >
            {primaryKey ? primaryKey.name : "Select a society"}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Select Primary society"
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          onSelectionChange={(key) => {setPrimaryKey(joinedSocieties[Object.values(key)[0]])}}
        >
          {joinedSocieties.map((society, index) => <DropdownItem key={index}>{society.name}</DropdownItem>)}
        </DropdownMenu>
      </Dropdown> 

      {primaryKey &&
        <Checkbox isSelected={isCollab} onValueChange={() => {setIsCollab(!isCollab); setCollabKeys(new Set([]))}}>
          This task is a collab
        </Checkbox>
      }
      

      {isCollab &&
        <Dropdown classNames={{base: "w-[80vw] md:w-[350px]"}}>
          <DropdownTrigger>
            <Button 
              variant="bordered"
            >
              {displayCollabKeys.length > 0 ? displayCollabKeys : "Choose ONE or MORE collab societies"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Select Collab societies"
            variant="flat"
            closeOnSelect={false}
            disallowEmptySelection
            selectionMode="multiple"
            selectedKeys={collabKeys}
            // @ts-expect-error
            onSelectionChange={setCollabKeys}
          >
            {allSocieties.filter((society) => society.id !== primaryKey?.id).map((society) => <DropdownItem key={society.name}>{society.name}</DropdownItem>)}
          </DropdownMenu>
        </Dropdown>
      }
      
    </div>
    
  );
}