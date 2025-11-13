import { useEffect, useState } from "react";
import Card from "../Card/Card.jsx";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loading from "../Loading/Loading";

export default function FeaturedFoods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.listFoods({ status: "Available" });
        if (!mounted) return;
        const arr = Array.isArray(data) ? data : [];
        arr.sort((a, b) => (b.quantityNumber || 0) - (a.quantityNumber || 0));
        setFoods(arr.slice(0, 6));
      } catch (err) {
        console.error("Failed to load featured foods:", err);
        setError(err?.message || "Failed to load featured foods");
        setFoods([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="pt-20"><Loading /></div>;

  return (
    <div className="pt-20 2xl:px-10 px-2 text-center">
      <h2 className="text-3xl font-medium text-gray-800">Featured Foods</h2>
      <p className="text-sm md:text-base text-gray-500 mt-3 max-w-2xl mx-auto">Food items shared by our community. Highest quantity shown first.</p>

      {error && (
        <div className="mt-6 text-red-500">
          <p>{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 px-4 md:px-0 my-10 md:my-16 gap-4">
        {foods.length === 0 ? (
          <p className="col-span-full text-gray-500">No featured foods found.</p>
        ) : (
          foods.map((food) => <Card key={food._id} food={food} />)
        )}
      </div>

      <Link to="/available-foods" onClick={() => window.scrollTo(0, 0)} className="text-gray-500 border border-gray-500/30 px-10 py-3 rounded">
        Show all foods
      </Link>
    </div>
  );
}
