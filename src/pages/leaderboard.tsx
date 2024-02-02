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
    <main className="flex min-h-screen flex-col items-center justify-start">
      <div className="container flex flex-col items-center justify-center gap-4 space-y-2 p-4">
        <h1>Leaderboards</h1>
        <StatusProgressBar />
        <Table
          aria-label="Example table with client side pagination"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
            <TableColumn key="points">Points</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.name}>
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
    </main>
  );
}
