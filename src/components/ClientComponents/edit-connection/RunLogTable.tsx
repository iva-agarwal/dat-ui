import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { StreamTable } from "./StreamTable";
import {
    CheckCircledIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    CrossCircledIcon,
    CubeIcon,
    DotsVerticalIcon,
    ExclamationTriangleIcon,
    FileTextIcon,
} from "@radix-ui/react-icons";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { LazyLog, ScrollFollow } from "react-lazylog";

export type Streams = {
    name: string;
    documents: number;
    records: number;
};

export const columns: ColumnDef<Streams>[] = [
    {
        accessorKey: "stream",
        header: "Name",
    },
    {
        accessorKey: "documents_fetched",
        header: "No of Documents Fetched",
    },
    {
        accessorKey: "destination_record_updated",
        header: "No of Records Fetched",
    },
];

function RunLogTable({ logInstance, viewLogs }: { logInstance: any; viewLogs: any }) {
    const [arrow, setArrow] = React.useState(false);

    const toggleArrow = () => {
        setArrow(!arrow);
    };

    const convertLogs = () => {
        let allLogs = "";

        viewLogs.forEach((log) => {
            const json_msg = JSON.parse(log.message);
            const curLog = `${log.created_at} : ${log.updated_at} | ${json_msg.level} | ${json_msg.message}`;
            allLogs += `${curLog}\n`;
        });

        return allLogs;
    };

    let showLogs = convertLogs();
    // const logs =
    //     "Jul 08 11:48:31 gunicorn[3568132]: 2024-07-08 11:48:31.157 | DEBUG | datachannel.accounts.account_feature_service:fill_plan_features:39 - feature_id \nJul 08 11:48:31 gunicorn[3568132]: 2024-07-08 11:48:31.157 | DEBUG | datachannel.accounts.account_feature_service:fill_plan_features:40 - \n19Jul 08 11:48:31 gunicorn[3568132]: 2024-07-08 11:48:31.158 | DEBUG | datachannel.accounts.account_feature_service:fill_plan_features:42 - not in account plan";

    return (
        <div className="flex-col py-6 px-5 border-b">
            <div className="flex xl:flex-row flex-col xl:justify-between space-y-2">
                <div className="flex flex-row space-x-3 items-center">
                    {logInstance.status != "failed" && (
                        <>
                            {arrow ? (
                                <ChevronDownIcon className="cursor-pointer" width={25} height={25} onClick={toggleArrow} />
                            ) : (
                                <ChevronRightIcon className="cursor-pointer" width={25} height={25} onClick={toggleArrow} />
                            )}
                        </>
                    )}

                    {logInstance.status === "success" ? (
                        <CheckCircledIcon width={30} height={30} color="#047857" />
                    ) : logInstance.status === "failed" ? (
                        <CrossCircledIcon width={30} height={30} color="#DC2626" />
                    ) : (
                        <ExclamationTriangleIcon width={30} height={30} color="#A16207" />
                    )}

                    <p className="font-semibold">
                        {logInstance?.status === "success"
                            ? "Run Successful"
                            : logInstance.status === "failed"
                            ? "Run Failed"
                            : "Partial Success"}{" "}
                    </p>
                    {logInstance.status != "failed" && <p className="text-muted-foreground"> Size : {logInstance?.size}</p>}
                </div>

                <div className="flex flex-row space-x-3 items-center ml-9 xl:ml-0">
                    {logInstance.status != "failed" && (
                        <>
                            <div className="flex flex-row items-center space-x-1 border px-2 py-1 rounded-lg font-semibold hover:shadow-md">
                                <FileTextIcon width={15} height={15} />
                                <p>{logInstance?.documents_fetched} Documents</p>
                            </div>
                            <div className="flex flex-row items-center space-x-1 border px-2 py-1 rounded-lg font-semibold hover:shadow-md">
                                <CubeIcon width={15} height={15} />
                                <p>{logInstance?.destination_record_updated} Records</p>
                            </div>
                        </>
                    )}

                    <p className="text-muted-foreground"> {logInstance?.start_time}</p>

                    <Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <DotsVerticalIcon width={20} height={20} className="cursor-pointer" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-28 text-muted-foreground">
                                <DialogTrigger className="w-full">
                                    <DropdownMenuItem>
                                        <span>View Logs</span>
                                    </DropdownMenuItem>
                                </DialogTrigger>

                                <DropdownMenuItem>
                                    <span>Download Logs</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DialogContent className="size-10/12 max-w-none">
                            <Card className="p-5 m-4">
                                <DialogHeader>
                                    <DialogTitle className="mb-2">Run Logs</DialogTitle>
                                    {showLogs.length > 0 ? (
                                        <DialogDescription className="h-[470px]">
                                            <ScrollFollow
                                                startFollowing
                                                render={({ follow }) => (
                                                    <LazyLog extraLines={1} enableSearch text={showLogs} stream follow={follow} />
                                                )}
                                            />
                                        </DialogDescription>
                                    ) : (
                                        <DialogDescription className="flex justify-center">
                                            <div>No Run Logs to Display</div>
                                        </DialogDescription>
                                    )}
                                </DialogHeader>
                            </Card>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {arrow && (
                <div className="w-11/12 xl:w-9/12 mt-5 mb-8 xl:ml-10 mx-auto">
                    <StreamTable columns={columns} data={logInstance?.records_per_stream} />
                </div>
            )}
        </div>
    );
}

export default RunLogTable;