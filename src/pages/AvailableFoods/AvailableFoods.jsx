import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card/Card.jsx'
import api from '../../services/api'
import Loading from '../../components/Loading/Loading'

export default function AvailableFoods() {
  const navigate = useNavigate()
  const { input } = useParams()

  const [foods, setFoods] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function loadFoods() {
      setLoading(true)
      setError(null)
      try {
        const data = await api.listFoods({ status: 'Available' })
        if (cancelled) return
        setFoods(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setError(err?.message || 'Failed to load foods')
        setFoods([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadFoods()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!input || !input.trim()) {
      setFiltered(foods)
      return
    }
    const q = input.toLowerCase()
    setFiltered(
      foods.filter((f) => {
        if (!f) return false
        const name = (f.name || '').toLowerCase()
        const donator = (f.donator?.name || '').toLowerCase()
        const location = (f.pickupLocation || '').toLowerCase()
        return name.includes(q) || donator.includes(q) || location.includes(q)
      })
    )
  }, [foods, input])

  if (loading) return <Loading />

  return (
    <div className="relative md:px-10 px-8 pt-20 text-left">
      <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800">Available Foods</h1>
          <p className="text-gray-500">
            <span className="text-green-600 cursor-pointer" onClick={() => navigate('/')}>
              Home
            </span>{' '}
            / <span>Available Foods</span>
          </p>
        </div>

      </div>

      {input && (
        <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600">
          <p>{input}</p>
          <button onClick={() => navigate('/available-foods')} className="ml-2 text-gray-600 bg-gray-100 px-2 rounded">
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 my-16 gap-6 px-2 md:p-0">
        {error ? (
          <div className="col-span-full text-center text-red-500">
            <p>{error}</p>
            <div className="mt-4">
              <button
                className="btn btn-outline"
                onClick={async () => {
                  setLoading(true)
                  setError(null)
                  try {
                    const data = await api.listFoods({ status: 'Available' })
                    setFoods(Array.isArray(data) ? data : [])
                  } catch (err) {
                    setError(err?.message || 'Failed to load foods')
                  } finally {
                    setLoading(false)
                  }
                }}
              >
                Retry
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No foods found.</p>
        ) : (
          filtered.map((food) => <Card key={food._id} food={food} />)
        )}
      </div>
    </div>
  )
}
