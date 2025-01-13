import React, { Dispatch, SetStateAction, use, useEffect } from "react";

import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";

import HeaderItem from "@/components/table/HeaderItem";
import Status from "@/components/table/Status";
import { LeftArrowIcon } from "../icons/LeftArrowIcon";
import { RightArrowIcon } from "../icons/RightArrowIcon";
import { DashIcon } from "../icons/DashIcon";
import { TickIcon } from "../icons/TickIcon";

interface TableDataProps {
    currentStatus: string;
    selectedIds: string[];
    updateSelectedIds: (updateId: string) => void;
    data: any[];
    setData: Dispatch<SetStateAction<never[]>>;
    page: number;
    setPage: (page: number) => void;
    statusList: string[];
    updateRequest: () => void;
    totalRequests: number;
    updateTotalRequests: () => void;
    updatePage: (page: number) => void;
}

type StatusVariant = "none" | "completed" | "pending" | "approved" | "rejected";

export default function TableData({
    currentStatus,
    selectedIds,
    updateSelectedIds,
    data,
    setData,
    page,
    setPage,
    statusList,
    updateRequest,
    totalRequests,
    updateTotalRequests,
    updatePage,
}: TableDataProps) {
    const headerList = [
        "Name",
        "Item Requested",
        "Created",
        "Updated",
        "Status",
    ];

    const headerWidths = [
        "w-[20%]",
        "w-[35%]",
        "w-[15%]",
        "w-[15%]",
        "w-[%15]",
    ];

    const updateStatus = (id: string, status: StatusVariant) => {
        fetch("http://localhost:3000/api/request", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                status: status,
            }),
        }).then(() => {
            updateRequest();
        });
    };

    useEffect(() => {
        updateRequest();
    }, [page]);

    useEffect(() => {
        setPage(1);
        updateTotalRequests();
        fetch(
            `http://localhost:3000/api/request?page=${page}` +
                (statusList.includes(currentStatus)
                    ? `&status=${currentStatus}`
                    : "")
        )
            .then((res) => res.json())
            .then((data) => setData(data));
        console.log(currentStatus);
    }, [currentStatus]);

    useEffect(() => {
        updateTotalRequests();
    }, []);

    const [allButtonSelected, setAllButtonSelected] = React.useState(false);

    const updateAllButton = () => {
        if (allButtonSelected) {
            setAllButtonSelected(false);
        } else {
            setAllButtonSelected(true);
        }
    };

    return (
        <div className="relative overflow-x-auto h-full">
            <table className="w-full text-sm text-left text-[#667085] whitespace-nowrap">
                <thead className="text-xs bg-[#fcfcfd] border-b border-[#eaecf0]">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 flex items-center justify-center"
                        >
                            <div
                                className="flex items-center justify-center"
                                onClick={() => {
                                    if (selectedIds.length != 0) {
                                        updateSelectedIds("");
                                    }
                                }}
                            >
                                <div
                                    className={
                                        "w-4 h-4 border-[1.3px] border-[#d0d5dd] rounded-[2.2px] " +
                                        (selectedIds.length != 0
                                            ? "border-[#0070ff] hover:bg-[#eff6ff]"
                                            : "")
                                    }
                                ></div>
                                <div
                                    className={
                                        "absolute w-max h-max flex items-center justify-center"
                                    }
                                >
                                    <div
                                        className={
                                            selectedIds.length != 0
                                                ? ""
                                                : "hidden"
                                        }
                                    >
                                        <DashIcon />
                                    </div>
                                </div>
                            </div>
                        </th>
                        {headerList.map((item, index) => (
                            <HeaderItem
                                className={headerWidths[index]}
                                title={item}
                                key={item}
                            />
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item: any) => (
                        <tr
                            className={
                                "border-b border-[#eaecf0]" +
                                (selectedIds.includes(item._id)
                                    ? " bg-[#eff6ff]"
                                    : "")
                            }
                            key={item._id}
                        >
                            <td className="px-6 py-2">
                                <div
                                    className="flex items-center justify-center"
                                    onClick={() => {
                                        updateSelectedIds(item._id)
                                    }}
                                >
                                    <div
                                        className={
                                            "w-4 h-4 border-[1.3px] rounded-[2.2px] " +
                                            (selectedIds.includes(item._id)
                                                ? "bg-[#0070ff] border-[#0070ff]"
                                                : "border-[#d0d5dd] hover:bg-[#eff6ff]")
                                        }
                                    ></div>
                                    <div
                                        className={
                                            "absolute w-max h-max flex items-center justify-center"
                                        }
                                    >
                                        <div
                                            className={
                                                selectedIds.includes(item._id)
                                                    ? ""
                                                    : "hidden"
                                            }
                                        >
                                            <TickIcon />
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-2">{item.requestorName}</td>
                            <td className="px-6 py-2">{item.itemRequested}</td>
                            <td className="px-6 py-2">{item.createdDate}</td>
                            <td className="px-6 py-2">{item.lastEditedDate}</td>
                            <td className="px-6 py-2">
                                <Status
                                    id={item._id}
                                    variant={item.status}
                                    updateStatus={updateStatus}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex items-center justify-end gap-2 pt-2 pr-2 text-[#667085]">
                <div className="">
                    {Math.min(
                        (page - 1) * PAGINATION_PAGE_SIZE + 1,
                        totalRequests
                    )}
                    -{Math.min(page * PAGINATION_PAGE_SIZE, totalRequests)} of{" "}
                    {totalRequests}
                </div>
                <div
                    className="px-[10px] py-2 bg-[#fcfcfd] border-2 border-[#eaecf0] rounded"
                    onClick={() => updatePage(page - 1)}
                >
                    <LeftArrowIcon />
                </div>
                <div
                    className="px-[10px] py-2 bg-[#fcfcfd] border-2 border-[#eaecf0] rounded"
                    onClick={() => updatePage(page + 1)}
                >
                    <RightArrowIcon />
                </div>
            </div>
        </div>
    );
}
