import { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AuthContext from "../../context/AuthContext";
import { uploadToImgbb, createFood } from "../../services/api";

export default function AddFood() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit } = useForm();

  function parseQty(text) {
    if (!text) return 0;
    const m = text.match(/\d+/);
    return m ? Number(m[0]) : 0;
  }

  const onSubmit = async (data) => {
    if (loading || submitting) return;
    setSubmitting(true);

    try {
      const file = fileRef.current && fileRef.current.files && fileRef.current.files[0] ? fileRef.current.files[0] : null;
      console.log("selected file:", file);

      let imageUrl = null;
      if (file) {
        toast.loading("Uploading image...");
        imageUrl = await uploadToImgbb(file);
        toast.dismiss();
        console.log("imgbb returned:", imageUrl);
      } else {
        console.log("no image chosen");
      }

      const payload = {
        name: (data.foodName || "").trim(),
        image: imageUrl,
        quantityText: data.foodQuantity || "",
        quantityNumber: parseQty(data.foodQuantity || ""),
        pickupLocation: data.pickupLocation || "",
        expireDate: data.expireDate || null,
        notes: data.notes || "",
        donator: {
          name: user?.displayName || "",
          email: user?.email || "",
          photo: user?.photoURL || "",
          uid: user?.uid || null,
        },
        status: "Available",
        createdAt: new Date().toISOString(),
      };

      console.log("payload:", payload);

      await createFood(payload, user);
      toast.success("Food added successfully");
      navigate("/my-foods");
    } catch (err) {
      console.error("add food error:", err);
      toast.error(err?.message || "Error while adding food");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="hero min-h-screen">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white text-black shadow">
        <h1 className="text-2xl font-bold text-center">Add Food</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-busy={loading || submitting}>
          <div className="space-y-1 text-sm">
            <label htmlFor="foodName" className="block">Food Name</label>
            <input id="foodName" {...register("foodName", { required: true })} type="text" disabled={loading || submitting} placeholder="Your Food Name" className="input input-bordered w-full" />
          </div>

          <div className="space-y-1 text-sm">
            <label htmlFor="foodImage" className="block">Food Image (optional)</label>
            <input ref={fileRef} id="foodImage" name="foodImage" type="file" accept="image/*" disabled={loading || submitting} className="file-input file-input-bordered w-full" />
            <p className="text-xs text-gray-500 mt-1">Use small images while testing (&lt; 2MB recommended)</p>
          </div>

          <div className="space-y-1 text-sm">
            <label htmlFor="foodQuantity" className="block">Food Quantity</label>
            <input id="foodQuantity" {...register("foodQuantity")} type="text" placeholder='e.g., "Serves 2" or "4 pcs"' disabled={loading || submitting} className="input input-bordered w-full" />
          </div>

          <div className="space-y-1 text-sm">
            <label htmlFor="pickupLocation" className="block">Pickup Location</label>
            <input id="pickupLocation" {...register("pickupLocation")} type="text" disabled={loading || submitting} placeholder="Where to pickup" className="input input-bordered w-full" />
          </div>

          <div className="space-y-1 text-sm">
            <label htmlFor="expireDate" className="block">Expire Date</label>
            <input id="expireDate" {...register("expireDate")} type="date" disabled={loading || submitting} className="input input-bordered w-full" />
          </div>

          <div className="space-y-1 text-sm">
            <label htmlFor="notes" className="block">Additional Notes</label>
            <textarea id="notes" {...register("notes")} rows={3} disabled={loading || submitting} placeholder="Any extra info..." className="textarea textarea-bordered w-full" />
          </div>

          <div className="space-y-1 text-sm">
            <label className="block">Donator</label>
            <div className="flex items-center gap-3">
              {user?.photoURL ? <img src={user.photoURL} alt={user.displayName || "avatar"} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-gray-200" />}
              <div>
                <div className="text-sm font-medium">{user?.displayName || "Anonymous"}</div>
                <div className="text-xs text-gray-500">{user?.email || "No email"}</div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading || submitting} className="btn btn-primary w-full">{submitting ? "Submitting..." : "Submit"}</button>
        </form>
      </div>
    </div>
  );
}
