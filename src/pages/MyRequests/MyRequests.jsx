import { Link, useNavigate } from "react-router-dom";
import { Space, Table, Tag, Image, Spin } from "antd";
import { useEffect, useState, useContext, useMemo } from "react";
import AuthContext from "../../context/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function MyRequests() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        if (!user) {
          setRequests([]);
          setLoading(false);
          return;
        }
        const data = await api.getMyRequests(user);
        if (cancelled) return;
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error(err?.message || "Failed to load your requests");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user]);

  const columns = useMemo(() => [
    {
      title: "SL No",
      key: "index",
      width: 70,
      render: (_, __, idx) => idx + 1,
    },
    {
      title: "Food",
      dataIndex: "foodId",
      key: "food",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Image
            src={record.food?.image || record.foodImage || ""}
            alt={record.food?.name || "food"}
            width={80}
            height={60}
            style={{ objectFit: "cover", borderRadius: 6 }}
            preview={false}
          />
          <div className="text-left">
            <div className="font-medium">{record.food?.name || record.foodName || "Untitled Food"}</div>
            <div className="text-xs text-gray-500">{record.food?.pickupLocation || record.location || ""}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Owner",
      dataIndex: "food",
      key: "owner",
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.food?.donator?.name || record.food?.donator?.email || "Owner"}</div>
          <div className="text-xs text-gray-500">{record.food?.donator?.email || ""}</div>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      render: (text) => text || "-",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (text) => text || "-",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (text) => <div className="max-w-sm truncate">{text || "-"}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "pending" ? "gold" : status === "accepted" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Requested At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (ts) => (ts ? new Date(ts).toLocaleString() : "-"),
    },
    {
      title: "Action",
      key: "action",
      width: 160,
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/food/${record.foodId}`} className="cursor-pointer">
            <Tag style={{ color: "#6236ff" }}>View Food</Tag>
          </Link>
          <button
            onClick={() => navigate(`/food/${record.foodId}`)}
            className="cursor-pointer"
            style={{ background: "transparent", border: "none", padding: 0 }}
          >
            <Tag style={{ color: "#0b875b" }}>Go</Tag>
          </button>
        </Space>
      ),
    },
  ], [navigate]);

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
        <h1 className="text-3xl font-bold">My Requests: <span className="text-indigo-600">{requests.length}</span></h1>
        <button className="btn btn-primary" onClick={() => navigate("/available-foods")}>Browse Foods</button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600">You have not requested any food yet.</p>
          <div className="mt-4">
            <button onClick={() => navigate("/available-foods")} className="btn btn-outline">Find Foods</button>
          </div>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={requests.map((r) => {
            return {
              ...r,
              key: r._id,
            };
          })}
          pagination={false}
          className="shadow-sm font-semibold"
          rowKey="_id"
        />
      )}
    </div>
  );
}
