import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  // console.log("🚀 ~ Navigation ~ sessionUser:", sessionUser)

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {sessionUser && (
        <li>
          <NavLink className="create-new-spot-nav" to='/spots/new'>
            Create a New Spot
          </NavLink>
        </li>
      )}
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
