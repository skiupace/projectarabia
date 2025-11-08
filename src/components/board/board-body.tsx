export interface BoardBodyProps {
  children: React.ReactNode;
}
export default function BoardBody({ children }: BoardBodyProps) {
  return (
    <div className="max-w-6xl w-full mx-auto flex flex-col items-start justify-start px-2 py-4 h-fit bg-amber-50">
      {children}
    </div>
  );
}
