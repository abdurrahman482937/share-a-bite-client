import { Link } from "react-router-dom";

export default function SearchBar() {
  return (
    <>
      <Link to={"available-foods"} type='submit' className='bg-green-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1'>View More</Link>
    </>
  )
}
