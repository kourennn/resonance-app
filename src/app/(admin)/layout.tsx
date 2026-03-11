import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-wrapper">
      <Sidebar />
      <main className="content-area animate-fade">
        {children}
      </main>
    </div>
  );
}
