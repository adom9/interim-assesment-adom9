import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>

        <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold text-lg">{user?.name}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>

          <hr className="border-gray-800" />

          <div className="space-y-3">
            <InfoRow label="Full Name" value={user?.name} />
            <InfoRow label="Email Address" value={user?.email} />
            <InfoRow
              label="Member Since"
              value={user?.createdAt ? formatDate(user.createdAt) : "—"}
            />
            <InfoRow label="Account ID" value={user?.id} mono />
          </div>

          <hr className="border-gray-800" />

          <button
            onClick={handleLogout}
            className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-700 text-red-400 font-medium rounded-lg py-2.5 text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, mono = false }) => (
  <div className="flex justify-between items-start gap-4">
    <span className="text-gray-500 text-sm flex-shrink-0">{label}</span>
    <span
      className={`text-white text-sm text-right break-all ${
        mono ? "font-mono text-xs text-gray-400" : ""
      }`}
    >
      {value || "—"}
    </span>
  </div>
);

export default Profile;