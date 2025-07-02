import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";

const USERS_PER_PAGE = 10;

interface User {
  id: number;
  username: string;
  avatar: string;
  reason: string;
  bannedBy: string;
  // add other fields if needed
}

// Dummy data example — replace with your real API calls!
const allUsersMock = Array.from({ length: 53 }, (_, i) => ({
  id: 1000 + i,
  username: `User${1000 + i}`,
  avatar: `img/avatar.png`, // random avatar
  reason: ["Exploiting", "Spamming", "Hacking"][i % 3],
  bannedBy: ["ModA", "ModB", "Admin"][i % 3],
}));

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState(allUsersMock);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter users on search change
  useEffect(() => {
    const filtered = allUsersMock.filter(
      (u) =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.id.toString().includes(search)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // reset to first page on search
  }, [search]);

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  const usersToShow = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  // Update title count with totalUsers and refresh every 5 seconds (mock)
  const [userCount, setUserCount] = useState(totalUsers);
  useEffect(() => {
    const interval = setInterval(() => {
      // Here you would fetch your real user count from your backend
      setUserCount(totalUsers);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalUsers]);

  // Close modal on Escape key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedUser(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Header */}
      <header className="flex justify-center mb-8">
        <img
          src="img/WASP-Logo-Dark-No-Bg.png"
          alt="WASP Logo"
          width={100}
          height={100}
          className="w-[100px] h-[100px] object-contain"
        />
        <div>
          <h1 className="text-4xl text-gray-700 font-bold">WASP</h1>
          <p className="text-gray-600 mt-1 text-sm">
            {userCount} Users Blacklisted &bull; Updates every 5 seconds
          </p>
        </div>
      </header>

      {/* Search bar */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by username or userId..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-gray-100 text-gray-500 bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />
      </div>

      {/* Table */}
      <div className="max-w-4xl mx-auto bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2 w-16">Avatar</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">UserId</th>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Banned By</th>
              <th className="px-4 py-2 w-20">Action</th> {/* New column */}
            </tr>
          </thead>
          <tbody>
            {usersToShow.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
            {usersToShow.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </td>
                <td className="px-4 py-2 text-gray-900 font-medium">
                  {user.username}
                </td>
                <td className="px-4 py-2 text-gray-900">{user.id}</td>
                <td className="px-4 py-2 text-gray-900">{user.reason}</td>
                <td className="px-4 py-2 text-gray-900">{user.bannedBy}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => setSelectedUser(user)}
                    aria-label={`View details for ${user.username}`}
                    className="p-1 text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {/* Eye Icon SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="max-w-4xl mx-auto flex justify-center space-x-2 mt-6">
        <button
          className="px-3 py-1 border text-gray-700 rounded disabled:opacity-50 transition-colors duration-300 ease-in-out"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 border rounded transition-colors duration-300 ease-in-out ${
              currentPage === i + 1
                ? "bg-blue-500 border-blue-500 text-white"
                : "text-gray-300 hover:bg-gray-200"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 border text-gray-700 rounded disabled:opacity-50 transition-colors duration-300 ease-in-out"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
          >
            <button
              onClick={() => setSelectedUser(null)}
              aria-label="Close modal"
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              &#x2715;
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl text-gray-900 font-bold mb-2">
                  {selectedUser.username}
                </h2>
                <p className="text-gray-900">
                  <strong>UserId:</strong> {selectedUser.id}
                </p>
                <p className="text-gray-900">
                  <strong>Reason:</strong> {selectedUser.reason}
                </p>
                <p className="text-gray-900">
                  <strong>Banned By:</strong> {selectedUser.bannedBy}
                </p>
              </div>

              <img
                src={selectedUser.avatar}
                alt={`${selectedUser.username} avatar`}
                className="w-20 h-20 rounded-full object-cover ml-4"
              />
            </div>
            {/* Add more details here if you have */}
            <p className="mt-4 text-sm text-gray-600 italic">
              More info about the user can go here.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 py-6  text-center">
        <p className="mb-2 text-gray-700">
          Need help or want to apply for your ban/blacklist? Join our Discord
          server!
        </p>
        <a
          href="https://discord.gg/your-invite-code" // <-- Replace with your Discord invite link
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
        >
          Join Discord & Open a Ticket
        </a>
      </footer>
    </div>
  );
}
