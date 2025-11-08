import BoardBody from "./board-body";
import BoardHeader from "./board-header";
import BoardFooter from "./board-footer";
export interface BoardLayoutProps {
  children: React.ReactNode;
}

export default function BoardLayout({ children }: BoardLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <BoardHeader />
      <BoardBody>{children}</BoardBody>
      <BoardFooter />
    </div>
  );
}
