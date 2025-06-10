export default function LandingPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Welcome to{" "}
          <span className="text-gray-500">
            MEDI<span className="text-red-500">X</span>BOT
          </span>
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          Your personal medication management assistant.
        </p>
        <p className="text-md text-gray-600 mb-6">
          Keep track of your medications, set reminders, and manage your health
          with ease.
        </p>
        <a
          href="/admin/dashboard"
          className="px-6 py-3 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          Get Started
        </a>
      </div>
    </>
  );
}
