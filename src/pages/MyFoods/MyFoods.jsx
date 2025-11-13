import { Link, useNavigate } from "react-router-dom";
import { Space, Table, Tag, Image, Spin } from "antd";
import { useEffect, useState, useContext, useMemo } from "react";
import AuthContext from "../../context/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function MyFoods() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        if (!user) {
          setFoods([]);
          setLoading(false);
          return;
        }
        const data = await api.getMyFoods(user);
        if (cancelled) return;
        setFoods(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error(err?.message || "Failed to load your foods");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This food will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.deleteFood(id, user);
      setFoods((p) => p.filter((f) => f._id !== id));
      toast.success("Deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const handleMarkDonated = async (id) => {
    if (!confirm("Mark this food as donated?")) return;
    setProcessingId(id);
    try {
      const res = await api.updateFood(id, { status: "Donated" }, user);
      setFoods((p) => p.map((f) => (f._id === id ? res.food || { ...f, status: "Donated" } : f)));
      toast.success("Marked as donated");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Operation failed");
    } finally {
      setProcessingId(null);
    }
  };

  const columns = useMemo(() => [
    {
      title: "SL No",
      dataIndex: "key",
      key: "key",
      width: 80,
      render: (_, __, idx) => idx + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (src) => (
        <Image
          src={src || ""}
          alt="food"
          width={80}
          height={60}
          style={{ objectFit: "cover", borderRadius: 6 }}
          preview={false}
        />
      ),
    },
    {
      title: "Food Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <div className="font-medium">{text || "Untitled"}</div>,
    },
    {
      title: "Quantity",
      dataIndex: "quantityText",
      key: "quantity",
      render: (_, record) => record.quantityText || (record.quantityNumber ? `${record.quantityNumber} pcs` : "1"),
    },
    {
      title: "Pickup",
      dataIndex: "pickupLocation",
      key: "pickupLocation",
      render: (text) => text || "Not specified",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Available" ? "green" : status === "Donated" ? "volcano" : "default"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 240,
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/update-food/${record._id}`} className="cursor-pointer">
            <Tag style={{ color: "#6236ff" }}>Edit</Tag>
          </Link>

          <button
            onClick={() => handleDelete(record._id)}
            className="cursor-pointer"
            disabled={processingId === record._id}
            style={{ background: "transparent", border: "none", padding: 0 }}
          >
            <Tag style={{ color: "red" }}>{processingId === record._id ? "Deleting..." : "Delete"}</Tag>
          </button>

          <button
            onClick={() => handleMarkDonated(record._id)}
            disabled={processingId === record._id || record.status === "Donated"}
            style={{ background: "transparent", border: "none", padding: 0 }}
          >
            <Tag style={{ color: "green" }}>{processingId === record._id ? "Processing..." : record.status === "Donated" ? "Donated" : "Mark Donated"}</Tag>
          </button>
        </Space>
      ),
    },
  ], [processingId, handleDelete, handleMarkDonated]);

  if (authLoading || loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="px-2 lg:px-20 py-6 lg:py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Foods: <span className="text-indigo-600">{foods.length}</span></h1>
        <button className="btn btn-primary" onClick={() => navigate("/add-food")}>Add Food</button>
      </div>

      {foods.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600">You have not added any food yet.</p>
          <div className="mt-4">
            <button onClick={() => navigate("/add-food")} className="btn btn-outline">Add your first food</button>
          </div>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={foods.map((f) => ({ ...f, key: f._id }))}
          pagination={false}
          className="shadow-sm font-semibold"
          rowKey="_id"
        />
      )}
    </div>
  );
}
