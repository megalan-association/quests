import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";
import { api } from "~/utils/api";
import StatusProgressBar from "~/components/statusProgressBar";

export default function App() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const leaderboardArgs = api.progress.leaderboard.useQuery(undefined, {
    retry: false,
    refetchInterval: 20000,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });

  const leaderboard = leaderboardArgs.isSuccess ? leaderboardArgs.data : [];

  const pages = Math.ceil(leaderboard.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return leaderboard.slice(start, end);
  }, [page, leaderboard]);

  return (
    <main className="flex h-screen flex-col justify-start overflow-y-clip">
      <div className="container flex w-full h-full flex-col items-center justify-top gap-4 space-y-2 p-4">
        <h1>Leaderboards</h1>
        <StatusProgressBar />
        <div className="flex h-full w-full overflow-y-scroll">
          <Table aria-label="Example table with dynamic content" className="w-full" isHeaderSticky={true}>
            <TableHeader columns={[{key: "name", label: "Name"}, {key: "points", label: "Points"}]}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={leaderboard}>
              {(item) => (
                <TableRow>
                  {(columnKey) =>
                    columnKey === "points" ? (
                      <TableCell>
                        {Number(getKeyValue(item, columnKey))}
                      </TableCell>
                    ) : (
                      <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                    )
                  }
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
