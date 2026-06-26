import Footer from "@/components/Shared/Footer";
import Navbar from "@/components/Shared/Navbar";


export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}