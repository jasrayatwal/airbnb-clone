import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
      <ul className = 'nav-elements'>
        <li>
          <NavLink to="/">
            <img src="/KitchenBnB.png" alt="KitchenBnB" className='logo'/>
          </NavLink>
        </li>
          {isLoaded && (
            <div className='profile-management'>
              {sessionUser && (
              <span className='new-spot'>
                <NavLink to='/spots/new' className='create-spot-link'>Create a New Spot</NavLink>
              </span>
              )}
              <li>
                  <ProfileButton user={sessionUser} />
              </li>
            </div>
          )}
      </ul>
    </nav>
  );
}

export default Navigation;
