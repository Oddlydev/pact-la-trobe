import React from "react";

type ResourcesCardProps = {
  image: string;
  category: string;
  description: string;
  link: string;
  linkType?: "internal" | "external";
};

export default function ResourcesCard({
  image,
  category,
  description,
  link,
  linkType = "internal",
}: ResourcesCardProps) {
  const isExternal = linkType === "external";

  return (
    <div
      className={[
        "group flex flex-col items-start w-full",
        "p-3 pb-4 gap-5",
        "rounded-[12px] border border-brand-2 bg-transparent",
        "shadow-[0_0_40px_0_rgba(171,190,194,0.30)]",
        "transition-all duration-300 ease-out",
        "hover:shadow-[inset_0_0_20px_rgba(171,190,194,0.40)] hover:-translate-y-1",
      ].join(" ")}
    >
      {/* Image */}
      <div className="flex h w-full justify-center items-center rounded-lg overflow-hidden">
        <img
          src={image}
          alt={category}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col items-start gap-3 w-full">
        <p className="text-[10px] uppercase text-gray-400 tracking-wide">
          {category}
        </p>
        <p className="text-base text-brand-3 line-clamp-3">{description}</p>

        {/* Link Button */}
        <a
          href={link}
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className={[
            "flex items-center gap-1 rounded-full border border-brand-3",
            "px-[14px] py-2 text-sm font-semibold leading-5",
            "transition-all duration-300 ease-out",
            "text-black bg-transparent",
            // Card hover → filled button (black bg, white text, white border)
            "group-hover:border-brand-2 group-hover:bg-brand-3 group-hover:text-white",
          ].join(" ")}
        >
          Read more
          {isExternal ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              className="transition-colors duration-300"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.5737 4.28281H11.2636C10.9635 4.28281 10.7203 4.03958 10.7203 3.73955C10.7203 3.43951 10.9635 3.19629 11.2636 3.19629H14.8853C15.1853 3.19629 15.4286 3.43951 15.4286 3.73955V7.36128C15.4286 7.66131 15.1853 7.90454 14.8853 7.90454C14.5853 7.90454 14.342 7.66131 14.342 7.36128V5.05109L8.02598 11.3672C7.81382 11.5793 7.46985 11.5793 7.25769 11.3672C7.04554 11.155 7.04554 10.811 7.25769 10.5989L13.5737 4.28281Z"
                fill="currentColor"
              />
              <path
                d="M8.36616 4.4639C8.55615 4.46121 8.73286 4.56109 8.82863 4.72519C8.92441 4.88928 8.92441 5.09224 8.82863 5.25633C8.73286 5.42043 8.55615 5.52024 8.36616 5.51755C7.05192 5.51755 6.0734 5.52109 5.3844 5.59884C4.69541 5.67659 4.33965 5.82128 4.13326 6.02788C3.92688 6.23449 3.78258 6.59024 3.70524 7.27902C3.6279 7.9678 3.62499 8.94579 3.62499 10.2587C3.62499 11.5712 3.62954 12.5489 3.70833 13.2373C3.78712 13.9258 3.93254 14.2822 4.14047 14.4895C4.34839 14.6968 4.70466 14.8408 5.39266 14.9186C6.08065 14.9963 7.05706 14.9998 8.36615 14.9998C9.67508 14.9998 10.6518 14.9959 11.3396 14.9175C12.0275 14.8391 12.3836 14.6944 12.5918 14.4864C12.8 14.2784 12.9452 13.9223 13.024 13.2342C13.1028 12.5462 13.1073 11.569 13.1073 10.2587C13.1046 10.0687 13.2044 9.892 13.3685 9.79622C13.5326 9.70045 13.7356 9.70045 13.8997 9.79622C14.0638 9.892 14.1636 10.0687 14.1609 10.2587C14.1609 11.57 14.161 12.5623 14.0703 13.3536C13.9797 14.1449 13.7908 14.7778 13.3367 15.2314C12.8826 15.6849 12.2489 15.8738 11.458 15.9639C10.6671 16.054 9.67593 16.0534 8.36616 16.0534C7.05655 16.0534 6.06513 16.0553 5.27435 15.966C4.48358 15.8766 3.851 15.6886 3.39659 15.2355C2.94218 14.7823 2.75153 14.1494 2.66093 13.3577C2.57032 12.566 2.57141 11.5722 2.57141 10.2587C2.57141 8.94545 2.57002 7.95197 2.65887 7.16067C2.74769 6.36932 2.93396 5.73679 3.38732 5.28291C3.84068 4.82904 4.47442 4.6407 5.26608 4.55136C6.0578 4.46201 7.05139 4.4639 8.36616 4.4639Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="transition-colors duration-300"
            >
              <path
                d="M15 9H3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.25 12.75s3.75-2.76 3.75-3.75-3.75-3.75-3.75-3.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </a>
      </div>
    </div>
  );
}
