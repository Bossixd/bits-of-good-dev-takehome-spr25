import React from "react";

interface HeaderItemProps {
    title: string;
    className?: string;
}

export default function HeaderItem({ title, className }: HeaderItemProps) {
    return (
        <th scope="col" className={"px-6 py-3 " + className}>
            {title}
        </th>
    );
}
