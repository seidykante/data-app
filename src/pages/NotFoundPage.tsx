import Card from "../components/common/Card";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="p-8">
        <h1 className="text-4xl font-bold text-center text-red-500 mb-4">
          404
        </h1>
        <h3 className="text-3xl font-bold text-center pb-4">Page Not Found </h3>
        <p className="text-center text-gray-600 mb-6">
          The page you are looking for does not exist.
        </p>
        <div className="flex justify-center">
          <a
            href="/"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Go to Home
          </a>
        </div>
      </Card>
    </div>
  );
}
