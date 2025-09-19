interface EntryHeaderProps {
  title?: string;
  date?: string;
  author?: string;
}

export default function EntryHeader({ title, date, author }: EntryHeaderProps) {
  return (
    <div className="py-8 text-center">
      {title && <h2 className="text-3xl font-bold">{title}</h2>}

      {date && author && (
        <div className="text-gray-600 text-sm">
          By {author} on <time>{new Date(date).toDateString()}</time>
        </div>
      )}
    </div>
  );
}
