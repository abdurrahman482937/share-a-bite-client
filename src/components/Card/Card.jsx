import { Link } from "react-router-dom";

export default function Card({ food }) {
    console.log(food);
    
    if (!food) return null;

    return (
        <Link
            to={`/food/${food._id}`}
            onClick={() => scrollTo(0, 0)}
            className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg bg-white"
        >
            <img
                className="w-full h-48 object-cover"
                src={food.image}
                alt={food.name}
            />
            <div className="p-3 text-left">
                <h3 className="text-base font-semibold text-gray-900">{food.name}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                    <img
                        src={food.donator?.photo}
                        alt={food.donator?.name}
                        className="w-6 h-6 rounded-full object-cover"
                    />
                    {food.donator?.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                    {food.quantityText} • {food.pickupLocation}
                </p>
                <p className="text-sm font-medium text-gray-700 mt-1">
                    Expire: {new Date(food.expireDate).toLocaleDateString()}
                </p>
            </div>
        </Link>
    );
}
