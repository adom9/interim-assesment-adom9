import { useState, useEffect } from "react";
import { getAllCrypto, getTopGainers, getNewListings, addCrypto } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const TABS = [
  { key: "all", label: "All Assets", fetch: getAllCrypto },
  { key: "gainers", label: "Top Gainers", fetch: getTopGainers },
  { key: "new", label: "New Listings", fetch: getNewListings },
];

const Home = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    price: "",
    image: "",
    change24h: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const fetchCryptos = async () => {
    setLoading(true);
    setError("");
    try {
      const tab = TABS.find((t) => t.key === activeTab);
      const data = await tab.fetch();
      setCryptos(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptos();
  }, [activeTab]);

  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        change24h: parseFloat(formData.change24h),
      };
      const data = await addCrypto(payload);
      setFormSuccess(data.message);
      setFormData({ name: "", symbol: "", price: "", image: "", change24h: "" });
      fetchCryptos();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Crypto App</h1>
            <p className="text-gray-500 text-sm">Student Project — Not affiliated with Coinbase</p>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/profile"
                className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                My Profile
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Add Crypto Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {showForm ? "Cancel" : "+ Add Cryptocurrency"}
          </button>
        </div>

        {/* Add Crypto Form */}
        {showForm && (
          <div className="bg-gray-900 rounded-2xl p-6 mb-6">
            <h2 className="text-white font-bold text-lg mb-4">Add Cryptocurrency</h2>
            {formError && (
              <div className="bg-red-900/40 border border-red-700 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="bg-green-900/40 border border-green-700 text-green-400 text-sm rounded-lg px-4 py-2 mb-4">
                {formSuccess}
              </div>
            )}
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Name" name="name" value={formData.name} onChange={handleFormChange} placeholder="Bitcoin" />
                <Field label="Symbol" name="symbol" value={formData.symbol} onChange={handleFormChange} placeholder="BTC" />
                <Field label="Price (USD)" name="price" type="number" value={formData.price} onChange={handleFormChange} placeholder="67000" min="0" step="any" />
                <Field label="24h Change (%)" name="change24h" type="number" value={formData.change24h} onChange={handleFormChange} placeholder="2.5" step="any" />
              </div>
              <Field label="Image URL" name="image" value={formData.image} onChange={handleFormChange} placeholder="https://example.com/btc.png" />
              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
              >
                {formLoading ? "Adding..." : "Add Cryptocurrency"}
              </button>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          <div className="flex border-b border-gray-800">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-white border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-400 text-center py-8 text-sm">{error}</div>
          ) : cryptos.length === 0 ? (
            <div className="text-gray-500 text-center py-8 text-sm">
              No cryptocurrencies found. Add one above!
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs uppercase">
                  <th className="text-left px-4 py-3">#</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-right px-4 py-3">Price</th>
                  <th className="text-right px-4 py-3">24h Change</th>
                </tr>
              </thead>
              <tbody>
                {cryptos.map((crypto, index) => (
                  <tr
                    key={crypto._id}
                    className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={crypto.image}
                          alt={crypto.symbol}
                          className="w-8 h-8 rounded-full object-cover bg-gray-700"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${crypto.symbol}&background=1e3a5f&color=60a5fa&bold=true&size=32`;
                          }}
                        />
                        <div>
                          <p className="text-white font-medium">{crypto.name}</p>
                          <p className="text-gray-500 text-xs">{crypto.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-white">
                      ${Number(crypto.price).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={crypto.change24h >= 0 ? "text-green-400" : "text-red-400"}>
                        {crypto.change24h >= 0 ? "+" : ""}
                        {Number(crypto.change24h).toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, name, value, onChange, placeholder, type = "text", ...rest }) => (
  <div>
    <label className="block text-gray-300 text-xs font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-600"
      {...rest}
    />
  </div>
);

export default Home;