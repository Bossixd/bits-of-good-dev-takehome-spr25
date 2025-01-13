import React, { useEffect, useState } from "react";

import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";

import TableData from "@/components/table/TableData";
import Status from "@/components/table/Status";

import { TrashIcon } from "../icons/TrashIcon";

interface TableProps {
    title: string;
    putItem: boolean;
    setPutItem: React.Dispatch<React.SetStateAction<boolean>>;
}

type StatusVariant = "none" | "completed" | "pending" | "approved" | "rejected";

export default function Table({ title, putItem, setPutItem }: TableProps) {
    const statusList = ["All", "Pending", "Approved", "Completed", "Rejected"];
    const [currentStatus, setCurrentStatus] = useState("All");

    const unusedTableStyle = "bg-[#f2f2f2] text-[#666666] hover:bg-[#eff6ff]";
    const currentTableStyle = "bg-[#0070ff] text-white";

    const statusVariants = ["pending", "approved", "completed", "rejected"];
    const [page, setPage] = React.useState(1);
    const [data, setData] = React.useState([]);

    const updateRequest = () => {
        console.log("Update Request");
        fetch(
            `http://localhost:3000/api/request?page=${page}` +
                (statusVariants.includes(currentStatus)
                    ? `?status=${currentStatus}`
                    : "")
        )
            .then((res) => res.json())
            .then((data) => setData(data));
    };

    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    const updateSelectedIds = (updateId: string) => {
        if (updateId === "") {
            setSelectedIds([]);
            return;
        }

        if (selectedIds.includes(updateId)) {
            setSelectedIds(selectedIds.filter((id) => id !== updateId));
        } else {
            setSelectedIds([...selectedIds, updateId]);
        }
    };

    useEffect(() => {
        console.log(selectedIds);
    }, [selectedIds]);

    const updateBatchStatus = (id: string, status: StatusVariant) => {
        fetch("http://localhost:3000/api/request", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: selectedIds,
                status: status,
            }),
        }).then(() => {
            updateRequest();
            setSelectedIds([]);
        });
    };

    const [totalRequests, setTotalRequests] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);

    const updatePage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const updateTotalRequests = () => {
        console.log("Update Total Requests");
        fetch(
            "http://localhost:3000/api/util/get_request_count" +
                (statusList.includes(currentStatus)
                    ? `?status=${currentStatus}`
                    : "")
        )
            .then((res) => res.json())
            .then((data) => {
                setTotalRequests(data);
                setTotalPages(Math.ceil(data / PAGINATION_PAGE_SIZE));
            });
    };

    const fixPage = () => {
        console.log("fix page");
        if (page > totalPages) {
            updatePage(totalPages);
        }
        console.log(totalPages);
    };

    const batchDelete = () => {
        fetch("http://localhost:3000/api/request", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: selectedIds,
            }),
        }).then(() => {
            updateTotalRequests();
        });
    };

    useEffect(() => {
        if (putItem) {
            setPutItem(false);
        }
        updateTotalRequests();
        fixPage();
        updateRequest();
    }, [totalRequests, totalPages, putItem]);

    return (
        <div
            className={
                "relative border-[#000000] border-2 rounded-lg w-[90vw] h-[60vh] overflow-visible"
            }
        >
            <div className="flex flex-row items-center justify-between">
                <div className="px-6 text-base font-normal pt-4">{title}</div>
                <div className="flex flex-row gap-2 px-6 pt-4">
                    <div className="pr-2">
                        <Status
                            id=""
                            variant="none"
                            updateStatus={updateBatchStatus}
                        />
                    </div>
                    <div
                        className="border-l-2 pl-2 flex items-center"
                        onClick={() => {
                            batchDelete();
                        }}
                    >
                        <TrashIcon />
                    </div>
                </div>
            </div>
            <div className="flex flex-row px-5 gap-2 pt-4">
                {statusList.map((item) => (
                    <div
                        className={
                            (currentStatus == item
                                ? currentTableStyle
                                : unusedTableStyle) +
                            " px-[19px] py-[9px] rounded-t-lg"
                        }
                        key={item}
                        onClick={() => setCurrentStatus(item)}
                    >
                        {item}
                    </div>
                ))}
            </div>
            <TableData
                currentStatus={currentStatus.toLowerCase()}
                selectedIds={selectedIds}
                updateSelectedIds={updateSelectedIds}
                data={data}
                setData={setData}
                page={page}
                setPage={setPage}
                statusList={statusVariants}
                updateRequest={updateRequest}
                totalRequests={totalRequests}
                updateTotalRequests={updateTotalRequests}
                updatePage={updatePage}
            />
        </div>
    );
}
