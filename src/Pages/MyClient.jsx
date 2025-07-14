import React, { useEffect, useState } from 'react';
import CONFIG from '../Configuration';
import { MyClientTable, MyClientDetails } from '../Components';

function MyClient() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const email = user.email;
  const role = user.role;

  useEffect(() => {
    const endpoint = [1, 4, 5].includes(role)
  ? `${CONFIG.API_URL}/leads/allClients`
  : `${CONFIG.API_URL}/leads/getMyClients/${email}`;

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const filtered = Array.isArray(data)
          ? data.filter(client => client.status === 'won')
          : [];
        setClients(filtered);
      })
      .catch(() => setClients([]));
  }, [role, email]);

  return (
    <div className="flex p-4 gap-4 z-20">
      <MyClientTable clients={clients} onSelect={setSelectedClient} />
      <MyClientDetails client={selectedClient} />
    </div>
  );
}

export default MyClient;