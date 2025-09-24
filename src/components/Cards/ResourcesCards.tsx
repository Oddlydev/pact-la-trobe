import React from "react";

export type ResourcesCardProps = {
  id?: string;
  title: string;
  image: string;
  category: string;
  description: string;
  link: string;
  linkType?: "internal" | "external";
};

export default function ResourcesCard({
  title,
  image,
  category,
  description,
  link,
  linkType = "internal",
}: ResourcesCardProps) {
  const isExternal = linkType === "external";

  return (
    <a
      href={link}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={[
        "group flex flex-col items-start w-full",
        "p-3 pb-4 gap-5",
        "rounded-[12px] border border-brand-2 bg-[rgba(0,0,0,0.00)]",
        "shadow-[0_0_40px_0_rgba(171,190,194,0.30)]",
        "transition-all duration-300 ease-out",
        "hover:shadow-[inset_0_0_40px_rgba(171,190,194,0.40)] hover:-translate-y-1",
      ].join(" ")}
    >
      {/* Image */}
      <div className="flex h w-full justify-center items-center rounded-lg overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>

      {/* Content */}
      <div className="flex flex-col items-start gap-2.5 w-full">
        <p className="text-[10px] leading-2.5 uppercase text-gray-400 tracking-wide">
          {category}
        </p>

        {/* Title */}
        <p className="text-base text-brand-3 line-clamp-3">{title}</p>

        {/* Description */}
        <p
          className="text-sm text-gray-600 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      {/* CTA Button */}
      <div
        className={[
          "flex items-center gap-1 rounded-full border border-brand-3 mt-2",
          "px-[14px] py-2 text-sm font-semibold leading-5",
          "transition-all duration-300 ease-out",
          "text-black bg-[rgba(0,0,0,0.00)]",
          "group-hover:border-brand-2 group-hover:bg-brand-3 group-hover:text-white",
        ].join(" ")}
      >
        Read more
        {isExternal ? (
          // External link icon (uses currentColor now!)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="currentColor"
            className="transition-colors duration-300"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.5738 4.53281H11.2636C10.9636 4.53281 10.7203 4.28958 10.7203 3.98955C10.7203 3.68951 10.9636 3.44629 11.2636 3.44629H14.8853C15.1854 3.44629 15.4286 3.68951 15.4286 3.98955V7.61128C15.4286 7.91131 15.1854 8.15454 14.8853 8.15454C14.5853 8.15454 14.3421 7.91131 14.3421 7.61128V5.30109L8.02601 11.6172C7.81385 11.8293 7.46988 11.8293 7.25772 11.6172C7.04557 11.405 7.04557 11.061 7.25772 10.8489L13.5738 4.53281ZM8.36619 4.7139C8.55618 4.71121 8.73289 4.81109 8.82866 4.97519C8.92444 5.13928 8.92444 5.34224 8.82866 5.50633C8.73289 5.67043 8.55618 5.77024 8.36619 5.76755C7.05195 5.76755 6.07343 5.77109 5.38443 5.84884C4.69544 5.92659 4.33968 6.07128 4.13329 6.27788C3.92691 6.48449 3.78261 6.84024 3.70527 7.52902C3.62793 8.2178 3.62502 9.19579 3.62502 10.5087C3.62502 11.8212 3.62957 12.7989 3.70836 13.4873C3.78715 14.1758 3.93257 14.5322 4.1405 14.7395C4.34842 14.9468 4.70469 15.0908 5.39269 15.1686C6.08068 15.2463 7.05709 15.2498 8.36618 15.2498C9.67511 15.2498 10.6518 15.2459 11.3397 15.1675C12.0276 15.0891 12.3836 14.9444 12.5919 14.7364C12.8001 14.5284 12.9452 14.1723 13.024 13.4842C13.1028 12.7962 13.1073 11.819 13.1073 10.5087C13.1046 10.3187 13.2045 10.142 13.3686 10.0462C13.5327 9.95045 13.7356 9.95045 13.8997 10.0462C14.0638 10.142 14.1636 10.3187 14.1609 10.5087C14.1609 11.82 14.161 12.8123 14.0704 13.6036C13.9798 14.3949 13.7909 15.0278 13.3368 15.4814C12.8827 15.9349 12.2489 16.1238 11.458 16.2139C10.6671 16.304 9.67596 16.3034 8.36619 16.3034C7.05658 16.3034 6.06516 16.3053 5.27438 16.216C4.48361 16.1266 3.85103 15.9386 3.39662 15.4855C2.94221 15.0323 2.75156 14.3994 2.66096 13.6077C2.57035 12.816 2.57144 11.8222 2.57144 10.5087C2.57144 9.19545 2.57005 8.20197 2.6589 7.41067C2.74772 6.61932 2.93399 5.98679 3.38735 5.53291C3.84071 5.07904 4.47445 4.8907 5.26611 4.80136C6.05783 4.71201 7.05142 4.7139 8.36619 4.7139Z"
            />
          </svg>
        ) : (
          // Internal link icon
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
      </div>
    </a>
  );
}
