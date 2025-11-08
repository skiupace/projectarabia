export interface BoardBodyProps {
  children: React.ReactNode;
}
export default function BoardBody({ children }: BoardBodyProps) {
  return (
    <div className="min-w-4xl mx-auto flex flex-col items-start justify-start px-2 py-4 h-fit bg-amber-50">
      {children}
    </div>
  );
}
