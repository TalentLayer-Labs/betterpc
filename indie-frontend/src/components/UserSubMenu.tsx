import { Menu } from '@headlessui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDisconnect } from 'wagmi';

function UserSubMenu() {
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();

  return (
    <>
      <Menu.Item key='editProfile'>
        {({ active }) => (
          <NavLink
            to='/profile/edit'
            className={`block px-4 py-2 text-sm text-gray-700' ${active ? 'bg-gray-100' : ''}`}>
            Edit my profile
          </NavLink>
        )}
      </Menu.Item>

      <Menu.Item key='Log out'>
        {({ active }) => (
          <button
            onClick={event => {
              event.preventDefault();
              disconnect();
              navigate('/');
            }}
            className={`block px-4 py-2 text-sm text-left text-red-700 w-full ${
              active ? 'bg-gray-100' : ''
            }`}>
            Log out
          </button>
        )}
      </Menu.Item>
    </>
  );
}

export default UserSubMenu;
