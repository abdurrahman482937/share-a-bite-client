import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import Loading from "../../components/Loading/Loading";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../../services/api";

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [processing, setProcessing] = useState(false);
  const modalRef = useRef(null);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: { location: "", reason: "", contact: "" },
  });

  
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const f = await api.getFoodById(id);
        if (!mounted) return;
        setFood(f);
        setMainImage(f?.image || null);

        
        if (user && f?.donator?.email && user.email === f.donator.email) {
          try {
            const reqs = await api.getFoodRequests(id, user);
            if (!mounted) return;
            setRequests(Array.isArray(reqs) ? reqs : []);
          } catch (err) {
            console.warn("Failed to load requests:", err);
            setRequests([]);
          }
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error("Failed to load food:", err);
        setFood(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id, user]);

  if (loading || authLoading) return <Loading />;

  if (!food) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Food not found</h2>
          <p className="mt-3 text-gray-500">This item might have been removed.</p>
          <button onClick={() => navigate("/")} className="mt-6 btn btn-outline">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && user.email === food.donator?.email;

  
  const submitRequest = async (data) => {
    if (!user) {
      navigate("/login", { state: { from: `/food/${id}` } });
      return;
    }

    setProcessing(true);
    try {
      const payload = {
        location: data.location,
        reason: data.reason,
        contact: data.contact,
      };

      const res = await api.submitRequest(food._id, payload, user);
      
      const added = res?.request || res;
      setRequests((p) => [added, ...p]);
      reset();
      setShowRequestForm(false);
      
      if (modalRef.current && typeof modalRef.current.close === "function") {
        try { modalRef.current.close(); } catch (e) {
          console.log(e);
        }
      } else {
        const dialog = document.getElementById("my_modal_5");
        if (dialog?.close) dialog.close();
      }
      toast.success("Request submitted — waiting for owner response");
    } catch (err) {
      console.error(err);
      const msg = err?.message || "Failed to submit request";
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  
  const changeRequestStatus = async (reqId, newStatus) => {
    if (!isOwner) {
      toast.error("Not allowed");
      return;
    }
    try {
      await api.updateRequestStatus(reqId, newStatus, user);
      setRequests((prev) => prev.map((r) => (r._id === reqId ? { ...r, status: newStatus } : r)));
      if (newStatus === "accepted") {
        setFood((f) => ({ ...f, status: "Donated" }));
        toast.success("Request accepted — food marked as donated");
      } else if (newStatus === "rejected") {
        toast("Request rejected");
      }
    } catch (err) {
      console.error("Failed to update request status:", err);
      toast.error(err?.message || "Operation failed");
    }
  };

  const galleryImages = [food.image, ...(food.extraImages || [])].filter(Boolean);

  return (
    <div className="relative max-w-6xl mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-72 md:h-96 bg-gray-100 flex items-center justify-center">
              {mainImage ? (
                <img src={mainImage} alt={food.name} className="object-cover w-full h-full" />
              ) : (
                <div className="text-gray-400">No image</div>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-3 p-3 overflow-x-auto bg-gray-50">
                {galleryImages.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMainImage(src)}
                    className="flex-none rounded-md overflow-hidden border hover:scale-105 transform transition"
                    aria-label={`view image ${idx + 1}`}
                  >
                    <img src={src} alt={`${food.name} ${idx + 1}`} className="w-28 h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="p-6">
              <h1 className="text-2xl font-semibold text-gray-900">{food.name}</h1>

              <div className="mt-3 text-sm text-gray-600 grid grid-cols-2 gap-2 md:grid-cols-4">
                <div>
                  <div className="text-xs text-gray-500">Donator</div>
                  <div className="font-medium">{food.donator?.name || "Anonymous"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Quantity</div>
                  <div className="font-medium">{food.quantityText || (food.quantityNumber ? `${food.quantityNumber}` : "1")}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Pickup</div>
                  <div className="font-medium">{food.pickupLocation || "Not specified"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Expire</div>
                  <div className="font-medium">{food.expireDate ? new Date(food.expireDate).toLocaleString() : "No date"}</div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-medium">About this food</h2>
                <p className="mt-2 text-gray-700">{food.notes || "No extra notes."}</p>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (!user) {
                      navigate("/login", { state: { from: `/food/${id}` } });
                      return;
                    }
                    setShowRequestForm(true);
                    
                    const dialog = modalRef.current || document.getElementById("my_modal_5");
                    if (dialog && typeof dialog.showModal === "function") {
                      try {
                        dialog.showModal();
                      } catch (e) {
                        console.log(e);
                      }
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  disabled={food.status && food.status.toLowerCase() !== "available"}
                >
                  Request This Food
                </button>

                {isOwner && (
                  <button
                    className="btn btn-outline"
                    onClick={async () => {
                      
                      try {
                        await api.updateFood(food._id, { status: "Donated" }, user);
                        setFood((f) => ({ ...f, status: "Donated" }));
                        toast.success("Food marked as donated");
                      } catch (err) {
                        console.error(err);
                        toast.error("Failed to mark donated");
                      }
                    }}
                  >
                    Mark Donated
                  </button>
                )}

                <div className="ml-auto text-sm text-gray-500">
                  Status: <span className="font-medium text-gray-700">{food.status || "Available"}</span>
                </div>
              </div>
            </div>
          </div>

          <dialog id="my_modal_5" ref={modalRef} className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              {showRequestForm && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium">Request Form</h3>
                  <form onSubmit={handleSubmit(submitRequest)} className="mt-4 space-y-4">
                    <div>
                      <label className="text-sm">Pickup Location</label>
                      <input
                        {...register("location", { required: "Add pickup location" })}
                        className="input input-bordered w-full"
                        placeholder="Where will you pick up?"
                      />
                      {formState.errors.location && (
                        <p className="text-xs text-red-500 mt-1">{formState.errors.location.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm">Why need food</label>
                      <textarea
                        {...register("reason", { required: "Write a short reason" })}
                        className="textarea textarea-bordered w-full"
                        rows={3}
                        placeholder="Shortly explain why you need this food"
                      />
                      {formState.errors.reason && (
                        <p className="text-xs text-red-500 mt-1">{formState.errors.reason.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm">Contact No.</label>
                      <input
                        {...register("contact", { required: "Provide contact number" })}
                        className="input input-bordered w-full"
                        placeholder="Phone or WhatsApp"
                      />
                      {formState.errors.contact && (
                        <p className="text-xs text-red-500 mt-1">{formState.errors.contact.message}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={processing}
                        onClick={() => { }}
                      >
                        {processing ? "Sending..." : "Submit Request"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => {
                          setShowRequestForm(false);
                          reset();
                          const dialog = modalRef.current || document.getElementById("my_modal_5");
                          if (dialog && typeof dialog.close === "function") {
                            try { dialog.close(); } catch (e) {
                              console.log(e)
                            }
                          }
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </dialog>

          {isOwner && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium">Requests for this food</h3>
              {requests.length === 0 ? (
                <p className="mt-3 text-gray-500">No requests yet.</p>
              ) : (
                <div className="mt-3 overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Requester</th>
                        <th>Contact</th>
                        <th>Location</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r) => (
                        <tr key={r._id}>
                          <td className="flex items-center gap-2">
                            <img
                              src={r.requester.photoURL || "/avatar-placeholder.png"}
                              alt={r.requester.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium">{r.requester.name}</div>
                              <div className="text-xs text-gray-500">{r.requester.email}</div>
                            </div>
                          </td>
                          <td>{r.contact}</td>
                          <td>{r.location}</td>
                          <td className="max-w-xs truncate">{r.reason}</td>
                          <td>
                            <span
                              className={`text-xs px-2 py-1 rounded ${r.status === "pending" ? "bg-yellow-100" : r.status === "accepted" ? "bg-green-100" : "bg-red-100"}`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="flex gap-2">
                            {r.status === "pending" ? (
                              <>
                                <button className="btn btn-sm btn-success" onClick={() => changeRequestStatus(r._id, "accepted")}>
                                  Accept
                                </button>
                                <button className="btn btn-sm btn-error" onClick={() => changeRequestStatus(r._id, "rejected")}>
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className="text-sm text-gray-500">No action</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="bg-white rounded-lg shadow p-6 h-min">
          <div>
            <h4 className="text-lg font-semibold">Donator</h4>
            <div className="flex items-center gap-3 mt-3">
              <img
                src={food.donator?.photo}
                alt={food.donator?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-medium">{food.donator?.name}</div>
                <div className="text-xs text-gray-500">{food.donator?.email}</div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold">Pickup Info</h4>
              <p className="mt-2 text-gray-600">{food.pickupLocation}</p>
              <p className="mt-2 text-gray-600">
                <span className="font-medium">Expire: </span>
                {food.expireDate ? new Date(food.expireDate).toLocaleString() : "No date"}
              </p>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold">Status</h4>
              <p className="mt-2">{food.status}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}