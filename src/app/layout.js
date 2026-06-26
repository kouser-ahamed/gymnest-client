
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GymNest",
  description: "Fitness & Gym Management Platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var theme = localStorage.getItem("gymnest-theme");

                  if (!theme) {
                    theme = window.matchMedia("(prefers-color-scheme: dark)").matches
                      ? "dark"
                      : "light";
                    localStorage.setItem("gymnest-theme", theme);
                  }

                  document.documentElement.classList.toggle("dark", theme === "dark");
                } catch (e) {
                  document.documentElement.classList.add("dark");
                }
              })();
            `,
          }}
        />
      </head>

      <body className="min-h-full transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}




















// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Navbar from "@/components/Shared/Navbar";
// import Footer from "@/components/Shared/Footer";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "GymNest",
//   description: "Fitness & Gym Management Platform",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html
//       lang="en"
//       suppressHydrationWarning
//       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
//     >
//       <head>
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               (function () {
//                 try {
//                   var theme = localStorage.getItem("gymnest-theme");

//                   if (!theme) {
//                     theme = window.matchMedia("(prefers-color-scheme: dark)").matches
//                       ? "dark"
//                       : "light";
//                     localStorage.setItem("gymnest-theme", theme);
//                   }

//                   document.documentElement.classList.toggle("dark", theme === "dark");
//                 } catch (e) {
//                   document.documentElement.classList.add("dark");
//                 }
//               })();
//             `,
//           }}
//         />
//       </head>

//       <body className="flex min-h-full flex-col transition-colors duration-300">
//         <Navbar />
//         <main className="flex-1">{children}</main>
//         <Footer />
//       </body>
//     </html>
//   );
// }