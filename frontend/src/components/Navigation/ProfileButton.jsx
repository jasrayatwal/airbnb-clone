import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineMenu } from "react-icons/ai";
import { NavLink } from 'react-router-dom';
//import { useNavigate}  from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  //const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout())
    .then(() => {
      closeMenu();
      //navigate('/');
    })

  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div>
      <button className='user-menu' onClick={toggleMenu}>
        <div className='profile-button-content'>
          <AiOutlineMenu className='menu-outline'/>
          <FaUserCircle className='user-icon'/>
        </div>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            {/*<li>{user.username}</li>*/}
            <div className='hello-elements'>
              <li>Hello, {user.firstName} {user.lastName}</li>
              <li>{user.email}</li>
            </div>
            <div className='line'>-----------------------------</div>
              <NavLink className='manage-spots'>Manage Kitchens</NavLink>
            <div className='line'>-----------------------------</div>
            <li>
              <button className='logout-button' onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <div className='log-in-out'>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
