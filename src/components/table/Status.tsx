import React, { useEffect } from "react";
import { DownArrowIcon } from "../icons/DownArrowIcon";
import { LeftArrowIcon } from "../icons/LeftArrowIcon";

type StatusVariant = "none" | "completed" | "pending" | "approved" | "rejected";

interface StatusProps {
    id: string;
    variant: StatusVariant;
    updateStatus: (id: string, status: StatusVariant) => void;
}

export default function Status({ id, variant, updateStatus }: StatusProps) {
    const variants: StatusVariant[] = [
        "pending",
        "approved",
        "completed",
        "rejected",
    ];

    const variantText: Record<StatusVariant, string> = {
        none: "Status",
        completed: "Completed",
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
    };

    const variantColor: Record<StatusVariant, string> = {
        none: "text-[#667085] text-m",
        completed: "bg-[#ecfdf3] text-[#037847] text-xs",
        pending: "bg-[#ffdac3] text-[#a43e00] text-xs",
        approved: "bg-[#ffebc8] text-[#7b5f2e] text-xs",
        rejected: "bg-[#ffd2d2] text-[#8d0402] text-xs",
    };

    const variantDot: Record<StatusVariant, string> = {
        none: "",
        completed: "bg-[#14ba6d]",
        pending: "bg-[#fd8033]",
        approved: "bg-[#ffbe4c]",
        rejected: "bg-[#d40400]",
    };

    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const dropdownButtonRef = React.useRef<HTMLDivElement>(null);

    const handleDropdown = () => {
        if (!dropdownRef.current) return;
        dropdownRef.current.classList.toggle("hidden");
    };

    useEffect(() => {
        const handleOutsideDropdown = (event: MouseEvent) => {
            if (
                !dropdownButtonRef.current?.contains(
                    event.target as HTMLElement
                )
            ) {
                dropdownRef.current?.classList.add("hidden");
            }
        };

        document.addEventListener("mouseup", handleOutsideDropdown);

        return () => {
            document.removeEventListener("mouseup", handleOutsideDropdown);
        };
    }, [dropdownRef]);

    return (
        <div className="relative">
            <div
                className="flex w-32 flex-row items-center justify-between border-2 border-[#eaecf0] rounded px-1 py-1 hover:bg-[#eff6ff]"
                onClick={handleDropdown}
                ref={dropdownButtonRef}
            >
                <div
                    className={
                        "flex flex-row items-center gap-2 px-2 py-1 rounded-full w-min " +
                        variantColor[variant]
                    }
                >
                    {variant !== "none" && (
                        <div
                            className={
                                "w-2 h-2 rounded-full " + variantDot[variant]
                            }
                        ></div>
                    )}
                    {variantText[variant]}
                </div>
                <div className="w-3 h-3 flex items-center justify-center">
                    <DownArrowIcon />
                </div>
            </div>

            <div
                ref={dropdownRef}
                className="absolute z-10 w-32 z-999 hidden bg-white divide-y divide-gray-100 rounded-lg shadow"
                id="dropdown"
            >
                <ul
                    className="text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownDefaultButton"
                >
                    {variants.map((variant) => (
                        <li key={variant} className="hover:bg-[#eff6ff]">
                            <div
                                onPointerDown={() => {
                                    updateStatus(id, variant);
                                }}
                                className={
                                    "flex flex-row items-center gap-2 px-2 py-1 mx-2 my-1 rounded-full text-xs w-min " +
                                    variantColor[variant]
                                }
                            >
                                <div
                                    className={
                                        "w-2 h-2 rounded-full " +
                                        variantDot[variant]
                                    }
                                ></div>
                                {variantText[variant]}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
