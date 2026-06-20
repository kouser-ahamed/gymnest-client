const DashboardNavbar = ({ user }) => {
  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <header className="border-b border-divider bg-content1 px-6 py-5">
      <div>
        <p className="text-sm text-default-500">
          {greeting}
        </p>

        <h1 className="mt-1 text-3xl font-bold text-foreground">
          Welcome back,{" "}
          <span className="text-primary">
            {user?.name || "User"}
          </span>
        </h1>

        <p className="mt-2 text-default-500">
          Here's what's happening in your dashboard today.
        </p>
      </div>
    </header>
  );
};

export default DashboardNavbar;