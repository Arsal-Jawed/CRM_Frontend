function MyClientTableRow({ client, index, onSelect, setSelectedClient, compact }) {
  const getBadge = (status) => {
    const map = {
      Approved: 'bg-green-100 text-green-700',
      Pending: 'bg-yellow-100 text-yellow-700',
      Underwriting: 'bg-yellow-100 text-yellow-700',
      Activated: 'bg-blue-100 text-blue-700',
      Declined: 'bg-red-100 text-red-700',
      Submitted: 'bg-indigo-100 text-indigo-700',
      BuyBack: 'bg-red-400 text-red-700'
    };
    return (
      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${map[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <tr
      key={client._id}
      className="hover:bg-gray-50 transition cursor-pointer"
      onClick={() => {
        setSelectedClient(client)
        onSelect(client)
      }}
    >
      <td className="px-2 py-2">{index + 1}</td>

      <td className="px-2 py-2">
        <div className="font-medium">{client.business_name}</div>
        <div className="text-[10px] text-gray-500">{client.person_name}</div>
      </td>

      {compact ? (
        <>
          <td className="px-2 py-2">
            <span className="text-clr2 font-medium">
              {client.saleCloseDateTime
                ? new Date(client.saleCloseDateTime).toLocaleDateString()
                : (client.date || '-')}
            </span>
          </td>
          <td className="px-2 py-2">
            {getBadge(client.sale?.approvalStatus || (client.status === 'lost' ? 'Lost' : 'Pending'))}
          </td>
        </>
      ) : (
        <>
          <td className="px-2 py-2">{client.personal_email}</td>
          <td className="px-2 py-2">{client.business_email || '-'}</td>
          <td className="px-2 py-2">
            <span className="text-clr2 font-medium">
              {client.saleCloseDateTime
                ? new Date(client.saleCloseDateTime).toLocaleDateString()
                : (client.date || '-')}
            </span>
          </td>
          <td className="px-2 py-2">
            {getBadge(client.sale?.approvalStatus || (client.status === 'lost' ? 'Lost' : 'Pending'))}
          </td>
        </>
      )}
    </tr>
  )
}

export default MyClientTableRow