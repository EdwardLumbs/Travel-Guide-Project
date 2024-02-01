import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';

export default function Blogs() {
  const {currentUser} = useSelector((state) => state.user);


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
        <Link to={currentUser ? '/blogs/create' : '/login'}>
          Post A Blog
        </Link>
      </div>
      <div>
        Display some blogs here
      </div>
    </div>
  )
}
