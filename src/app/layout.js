// app/layout.js
import Navbar from "@/components/Shared/Navbar";
import "./globals.css";

// 1. Ei metadata object-ti tab-er naam ebong description control korbe
export const metadata = {
  title: "GymNest",
  description:
    "Welcome to GymNest, the ultimate community platform for fitness enthusiasts.",
  icons: {
    icon: "/assets/logox.png", // Apnar tab-er ba browser-er choto logo icon (Favicon)
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Ei script-ti prothomei run hoye white flash bondho korbe */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem("gymnest-theme") || "dark";
                if (savedTheme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
