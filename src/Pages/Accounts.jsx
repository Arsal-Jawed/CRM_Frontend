import React, { useState, useEffect } from 'react'
import { UserStats, EmployeeTable } from '../Components'
import RolePieChart from '../Components/RolePieChart'
import FiredUsers from '../Components/FiredUsers'
import CONFIG from '../Configuration'

function Accounts() {
  const [users, setUsers] = useState([])
  const IP = CONFIG.API_URL

  const fetchUsers = () => {
    fetch(`${IP}/users/all`)
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error(err))
  }

  useEffect(fetchUsers, [])

  return (
    <div className="flex flex-row gap-4 p-2">
      <div className="flex flex-col w-[65%] gap-4">
        <UserStats users={users} />
        <EmployeeTable users={users} reload={fetchUsers} />
      </div>

      <div className="flex flex-col w-[35%] gap-4">
        <RolePieChart users={users} />
        <FiredUsers users={users} />
      </div>
    </div>
  )
}

export default Accounts;