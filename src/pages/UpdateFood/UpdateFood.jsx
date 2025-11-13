import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthContext from "../../context/AuthContext";
import api from "../../services/api";
import Loading from "../../components/Loading/Loading";
import { toast } from "react-hot-toast";

export default function UpdateFood() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        async function loadFood() {
            try {
                const data = await api.getFoodById(id);
                if (!data) throw new Error("Food not found");

                reset({
                    name: data.name,
                    quantityText: data.quantityText,
                    pickupLocation: data.pickupLocation,
                    expireDate: data.expireDate ? data.expireDate.split("T")[0] : "",
                    notes: data.notes
                });

            } catch (err) {
                console.error(err);
                toast.error("Failed to load food");
            } finally {
                setLoading(false);
            }
        }
        loadFood();
    }, [id, reset]);

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                quantityNumber: parseInt(data.quantityText.match(/\d+/)?.[0] || "1", 10),
            };

            await api.updateFood(id, payload, user);

            toast.success("Food updated successfully");
            navigate("/my-foods");
        } catch (err) {
            console.error(err);
            toast.error("Update failed");
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="hero min-h-screen">
            <div className="max-w-md w-full bg-white p-8 shadow rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Update Food</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label>Food Name</label>
                        <input {...register("name")} className="input input-bordered w-full" />
                    </div>

                    <div>
                        <label>Food Quantity</label>
                        <input {...register("quantityText")} className="input input-bordered w-full" />
                    </div>

                    <div>
                        <label>Pickup Location</label>
                        <input {...register("pickupLocation")} className="input input-bordered w-full" />
                    </div>

                    <div>
                        <label>Expire Date</label>
                        <input type="date" {...register("expireDate")} className="input input-bordered w-full" />
                    </div>

                    <div>
                        <label>Notes</label>
                        <textarea {...register("notes")} className="textarea textarea-bordered w-full" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <button className="btn btn-primary w-full" type="submit">Update</button>
                        <button className="btn btn-outline w-full" type="button" onClick={() => navigate("/my-foods")}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
