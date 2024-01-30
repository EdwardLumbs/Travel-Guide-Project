import { Link } from 'react-router-dom'

export default function Blogs() {
  return (
    <div>
      <div>
        <form action="">
          <select name="" id="">
            <option value="">Put countries</option>
          </select>
        </form>
      </div>
      <div>
        <Link to={'/blogs/create'}>
          Post A Blog
        </Link>
      </div>
      <div>
        Display some blogs here
      </div>
    </div>
  )
}
