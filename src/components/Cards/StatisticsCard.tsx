import React from "react";

export type StatisticsCardProps = {
  title?: string;
  subtitle?: string;
  value?: string;
  className?: string;
};

export default function StatisticsCard({
  title = "Lorem ipsum dolor",
  subtitle = "Lorem ipsum dolor sit amet consectetur",
  value = "50%",
  className = "",
}: StatisticsCardProps) {
  return (
    <div
      className={[
        "flex flex-col items-start",
        "rounded-lg border-3 border-gray-300 bg-[rgba(0,0,0,0.00)]",
        "shadow-[inset_0_0_50px_0_rgba(171,190,194,0.25)]",
        "bg-[rgba(0,0,0,0.00)]",
        "p-3.5",
        "transition-all duration-300",
        "hover:shadow-sm hover:shadow-black/10 hover:border-gray-300",
        className,
      ].join(" ")}
    >
      <h3
        className={[
          "text-base font-semibold leading-[100%] tracking-normal",
          "text-black font-dmsans",
        ].join(" ")}
      >
        {title}
      </h3>
      <p
        className={[
          "mt-1 text-ellipsis",
          "text-xs font-normal leading-4 tracking-normal",
          "text-gray-500 font-dmsans",
        ].join(" ")}
      >
        {subtitle}
      </p>
      <p
        className={[
          "mt-3.5 text-lg font-semibold leading-[100%] tracking-[0.4px]",
          "text-gray-600 font-dmsans",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}
