import React, { useState, useEffect } from 'react';
import {UserStats,EmployeeTable} from '../Components';
import CONFIG from '../Configuration';

function Accounts() {
  const [users, setUsers] = useState([]);
  const IP = CONFIG.API_URL;

  const fetchUsers = () => {
    fetch(`${IP}/users/all`)
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error(err));
  };

  useEffect(fetchUsers, []);

  return (
    <div className="p-2">
      <UserStats users={users} />
      <EmployeeTable users={users} reload={fetchUsers} />
    </div>
  );
}

export default Accounts;
