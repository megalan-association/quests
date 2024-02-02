import { Card, CardBody, Progress } from "@nextui-org/react";
import { api } from "~/utils/api";

export default function StatusProgressBar() { 
  const statusArgs = api.progress.status.useQuery(undefined, { retry: false, refetchOnWindowFocus: true });
  const status = statusArgs.isSuccess ? statusArgs.data : undefined;

  if (!status || !status.totalTasksPoints) {
    return <>Loading...</>
  }

  const thresholds = {
    40: status.totalTasksPoints * 0.40,
    65: status.totalTasksPoints * 0.65,
    85: status.totalTasksPoints * 0.85,
    100: status.totalTasksPoints,
  }

  let milestoneEnd: number;

  const completedPoints = status.completedPoints ? status.completedPoints : 0;
  let milestoneStart = 0;

  if (completedPoints === 0) {
    milestoneEnd = thresholds[40];
  } else if (completedPoints > thresholds[85]) {
    milestoneStart = thresholds[85];
    milestoneEnd = thresholds[100];
  } else if (completedPoints > thresholds[65]) {
    milestoneStart = thresholds[65];
    milestoneEnd = thresholds[85];
  } else if (completedPoints > thresholds[40]) {
    milestoneStart = thresholds[40];
    milestoneEnd = thresholds[65];
  } else { // (completedPoints > 0) {
    milestoneEnd = thresholds[40];
  }

  return (
    <div className="flex flex-row items-center w-full max-w-sm">
      {/**
      <div className="flex flex-col text-center">
        <p className="text-2xl font-bold">{completedPoints}</p>
        <p className="">Total points!</p>
      </div>
      */}
      <div className="flex flex-col text-center p-2">
        <p className="text-2xl font-bold">{(completedPoints / status.totalTasksPoints) * 100}%</p>
      </div>
      <div className="flex flex-col w-full align-middle">
        <div className="flex flex-row justify-between align-bottom items-center">
          <p className="font-bold">
            Progress
          </p>
          <p className="text-black/60 text-xs">
            {milestoneEnd - completedPoints} pts to { Object.keys(thresholds).find(key => thresholds[Number(key) as keyof typeof thresholds] === milestoneEnd)}% completion
          </p>
        </div>
        <Progress size="md" aria-label="Loading..." value={((completedPoints - milestoneStart) / milestoneEnd) * 100} />
        <p className="text-black/60 text-xs">Completed <span className="font-bold">{status.completedTasks}</span> out of <span className="font-bold">{status.totalTasks}</span> total tasks</p>
      </div>
    </div> 
  )
}