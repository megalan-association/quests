import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Avatar,
} from "@nextui-org/react";
import { api } from "~/utils/api";
import StatusProgressBar from "~/components/statusProgressBar";

import DefaultIcon from "../../public/default.png";

type User = {
  id: number;
  name: string | null;
  image: string | null;
  points: number;
};

export default function App() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const leaderboardArgs = api.progress.leaderboard.useQuery(undefined, {
    retry: false,
    refetchInterval: 20000,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });

  const leaderboard: User[] = leaderboardArgs.isSuccess
    ? leaderboardArgs.data
    : [];

  const pages = Math.ceil(leaderboard.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return leaderboard.slice(start, end);
  }, [page, leaderboard]);

  const renderCell = React.useCallback(
    (index: number, user: User, columnKey: React.Key) => {
      switch (columnKey) {
        case "index":
          return <p>{index}</p>;
        case "name":
          return (
            <div className="flex flex-row items-center space-x-4">
              <div className="">
                <Avatar
                  size="sm"
                  src={user.image ? user.image : DefaultIcon.src}
                />
              </div>
              <p>{user.name}</p>
            </div>
          );
        case "points":
          return <p>{Number(user.points)}</p>;
        default:
          return user[columnKey as keyof typeof user];
      }
    },
    [],
  );

  return (
    <main className="flex h-screen flex-col justify-start overflow-y-clip p-6">
      <div className="justify-top container flex h-full w-full flex-col items-center gap-4 space-y-2">
        <h1>Leaderboards</h1>
        <StatusProgressBar />
        <div className="flex h-full w-full overflow-y-scroll">
          <Table
            aria-label="Example table with custom cells"
            isHeaderSticky={true}
            isStriped={true}
            classNames={{wrapper: "p-4 pt-0 shadow-none"}}
          >
            <TableHeader
              columns={[
                { key: "name", label: "Name" },
                { key: "points", label: "Points" },
              ]}
            >
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(index, item, columnKey)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
