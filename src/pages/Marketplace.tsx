import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  MapPin,
  ShoppingCart,
  X,
  Package,
  Sprout,
  FlaskConical,
  AlertCircle,
  Loader2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

type Category = "all" | "seedling" | "input" | "produce";

interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  quantity: number;
  unit: string;
  location: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  profiles?: { full_name: string | null };
}

const categoryIcon = (cat: string) => {
  if (cat === "seedling")
    return <Sprout size={28} className="text-green-500" />;
  if (cat === "input")
    return <FlaskConical size={28} className="text-blue-500" />;
  return <Package size={28} className="text-orange-500" />;
};

const categoryColors: Record<string, string> = {
  seedling: "bg-green-100 text-green-700",
  input: "bg-blue-100 text-blue-700",
  produce: "bg-orange-100 text-orange-700",
};

export default function MarketplacePage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filtered, setFiltered] = useState<Listing[]>([]);
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("marketplace_listings")
      .select("*, profiles(full_name)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) setError("Failed to load listings. Please refresh.");
    else setListings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    let result = listings;
    if (category !== "all")
      result = result.filter((l) => l.category === category);
    if (search)
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(search.toLowerCase()) ||
          l.description.toLowerCase().includes(search.toLowerCase()) ||
          (l.location || "").toLowerCase().includes(search.toLowerCase()),
      );
    setFiltered(result);
  }, [category, search, listings]);

  const tabs: { key: Category; label: string }[] = [
    { key: "all", label: "All Listings" },
    { key: "seedling", label: "Seedlings" },
    { key: "input", label: "Farm Inputs" },
    { key: "produce", label: "Produce" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-[72px]">
        {/* Header */}
        <div className="bg-gray-900 py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-green-400 text-xs font-bold tracking-widest uppercase">
                  Farmer Marketplace
                </span>
                <h1 className="text-white text-3xl sm:text-4xl font-extrabold font-display mt-1 mb-2">
                  Buy, Sell & Connect
                </h1>
                <p className="text-white/55 text-sm max-w-md">
                  Direct farm-to-buyer marketplace. No middlemen. Better prices
                  for everyone.
                </p>
              </div>
              {user ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowSellModal(true)}
                >
                  <Plus size={16} /> List Your Product
                </Button>
              ) : (
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    <Plus size={16} /> Sign Up to Sell
                  </Button>
                </Link>
              )}
            </div>
            <div className="mt-8 relative max-w-2xl">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search seedlings, fertilizers, produce, location..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCategory(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  category === tab.key
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-green-500 hover:text-green-500"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
                    category === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.key === "all"
                    ? listings.length
                    : listings.filter((l) => l.category === tab.key).length}
                </span>
              </button>
            ))}
          </div>

          {/* States */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 size={32} className="text-green-500 animate-spin" />
              <p className="text-gray-400 text-sm">Loading listings...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-5 text-red-600 text-sm">
              <AlertCircle size={18} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-24">
              <Package size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="font-extrabold text-gray-900 font-display text-xl mb-2">
                {listings.length === 0 ? "No listings yet" : "No results found"}
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {listings.length === 0
                  ? "Be the first to list a product on the marketplace"
                  : "Try a different search term or category"}
              </p>
              {user && listings.length === 0 && (
                <Button
                  variant="primary"
                  onClick={() => setShowSellModal(true)}
                >
                  <Plus size={15} /> List First Product
                </Button>
              )}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedListing(listing)}
                >
                  <div className="h-44 bg-gray-50 flex items-center justify-center relative border-b border-gray-100 overflow-hidden">
                    {listing.image_url ? (
                      <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      categoryIcon(listing.category)
                    )}
                    <span
                      className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[listing.category]}`}
                    >
                      {listing.category.charAt(0).toUpperCase() +
                        listing.category.slice(1)}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                      {listing.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
                      {listing.description}
                    </p>
                    {listing.location && (
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                        <MapPin size={11} />
                        <span>{listing.location}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-extrabold text-green-600 text-base font-display">
                          ₦{listing.price.toLocaleString()}
                        </div>
                        <div className="text-gray-400 text-[10px]">
                          per {listing.unit}
                        </div>
                      </div>
                      <button className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
                        <ShoppingCart size={11} /> Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedListing && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setSelectedListing(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-48 bg-gray-50 flex items-center justify-center relative rounded-t-2xl border-b border-gray-100 overflow-hidden">
              {selectedListing.image_url ? (
                <img
                  src={selectedListing.image_url}
                  alt={selectedListing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="scale-150">
                  {categoryIcon(selectedListing.category)}
                </div>
              )}

              <button
                onClick={() => setSelectedListing(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[selectedListing.category]}`}
              >
                {selectedListing.category.charAt(0).toUpperCase() +
                  selectedListing.category.slice(1)}
              </span>
              <h2 className="font-extrabold text-gray-900 text-xl font-display mt-3 mb-2">
                {selectedListing.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                {selectedListing.description}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  {
                    label: "Price",
                    value: `₦${selectedListing.price.toLocaleString()} / ${selectedListing.unit}`,
                  },
                  {
                    label: "Available",
                    value: `${selectedListing.quantity} ${selectedListing.unit}`,
                  },
                  {
                    label: "Location",
                    value: selectedListing.location || "Nigeria",
                  },
                  {
                    label: "Seller",
                    value:
                      selectedListing.profiles?.full_name || "Verified Farmer",
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-400 font-medium">
                      {label}
                    </div>
                    <div className="font-semibold text-gray-800 text-sm mt-0.5">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="primary" fullWidth>
                  <ShoppingCart size={15} /> Contact Seller
                </Button>
                <Button variant="outline">Save</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSellModal && (
        <SellModal
          onClose={() => setShowSellModal(false)}
          onSuccess={() => {
            setShowSellModal(false);
            fetchListings();
          }}
        />
      )}

      <Footer />
    </div>
  );
}

function SellModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "seedling",
    price: "",
    quantity: "",
    unit: "trays",
    location: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleImage = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return null;
    const ext = imageFile.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from("marketplace-images")
      .upload(fileName, imageFile, { upsert: false });
    if (error) return null;
    const {
      data: { publicUrl },
    } = supabase.storage.from("marketplace-images").getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    const imageUrl = await uploadImage();

    const { error } = await supabase.from("marketplace_listings").insert({
      seller_id: user.id,
      title: form.title,
      description: form.description,
      category: form.category as "seedling" | "input" | "produce",
      price: Number(form.price),
      quantity: Number(form.quantity),
      unit: form.unit,
      location: form.location,
      currency: "NGN",
      is_active: true,
      image_url: imageUrl,
    });
    setLoading(false);
    if (error) setError(error.message);
    else onSuccess();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-extrabold text-gray-900 text-xl font-display">
            List a Product
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Product Photo
            </label>
            <div
              className="relative w-full h-44 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors cursor-pointer overflow-hidden group"
              onClick={() => fileRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-sm font-semibold flex items-center gap-2">
                      <Upload size={16} /> Change Photo
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
                  >
                    <X size={13} />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                    <ImageIcon
                      size={22}
                      className="text-green-500 group-hover:text-white transition-colors"
                    />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">
                    Click to upload product photo
                  </p>
                  <p className="text-gray-300 text-xs">JPG, PNG — max 5MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleImage(e.target.files[0])
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 bg-white"
            >
              <option value="seedling">Seedling</option>
              <option value="input">Farm Input</option>
              <option value="produce">Produce</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Product Title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Hybrid Tomato Seedlings (Roma F1)"
              className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description *
            </label>
            <textarea
              required
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Describe your product quality, variety, growing conditions..."
              className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 resize-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Price (₦) *
              </label>
              <input
                required
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="2500"
                className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Quantity *
              </label>
              <input
                required
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => set("quantity", e.target.value)}
                placeholder="100"
                className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Unit
              </label>
              <select
                value={form.unit}
                onChange={(e) => set("unit", e.target.value)}
                className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 bg-white"
              >
                {[
                  "trays",
                  "bags",
                  "kg",
                  "tonnes",
                  "packs",
                  "sets",
                  "bundles",
                  "crates",
                ].map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Location
              </label>
              <input
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Lagos, Nigeria"
                className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish Listing →"}
          </Button>
        </form>
      </div>
    </div>
  );
}
