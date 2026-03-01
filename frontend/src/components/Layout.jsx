import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6">
        <h1 className="text-2xl font-bold mb-10">Tutor CRM</h1>

        <nav className="space-y-4">
          <Link
            to="/"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Students
          </Link>

          <Link
            to="/lessons"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Lessons
          </Link>

          <Link
            to="/invoices"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Invoices
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10">
        {children}
      </main>

    </div>
  );
}