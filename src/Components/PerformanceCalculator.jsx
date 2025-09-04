// This is a utility component that contains the performance calculation logic
// It's extracted from the main Performance component to make it more modular

export const calculatePerformance = (user, leads, sales, equipment, docs) => {
  const joiningDate = new Date(user.joining_date);
  const today = new Date();
  const diffDays = Math.max(1, Math.floor((today - joiningDate) / (1000 * 60 * 60 * 24)));
  const diffMonths = diffDays / 30;

  if (user.role === 3) {
    // Lead Gen Performance Calculation
    const userLeads = leads.filter(l => l.email === user.email);
    const total = userLeads.length;
    const won = userLeads.filter(l => l.status === 'won').length;
    const lost = userLeads.filter(l => l.status === 'loss').length;
    const ratings = userLeads.map(l => l.rating || 1);
    const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 1;

    const winScore = total ? (won / total) * 4 : 0;
    const ratingScore = (avgRating / 5) * 2;
    const totalLeadsScore = Math.min(total * 0.07, 3);
    const leadEfficiencyScore = Math.min((total / diffDays) * 0.15, 1);
    const lossPenalty = total ? (lost / total) * 1 : 0;

    const index = Math.min(
      (winScore + ratingScore + totalLeadsScore + leadEfficiencyScore - lossPenalty) * 2,
      10
    ).toFixed(2);

    return {
      name: `${user.firstName} ${user.lastName}`,
      role: 'LeadGen',
      total,
      won,
      lost,
      inProcess: userLeads.filter(l => l.status === 'in process').length,
      index,
      avgRating,
      joinDate: joiningDate.toLocaleDateString(),
      winScore: winScore.toFixed(2),
      ratingScore: ratingScore.toFixed(2),
      leadEfficiencyScore: leadEfficiencyScore.toFixed(2),
      lossPenalty: lossPenalty.toFixed(2)
    };
  } else {
    // Sales Closure Performance Calculation
    const userLeads = leads.filter(lead => 
      lead.closure1 === user.email || lead.closure2 === user.email
    );

    const userSales = sales.filter(sale => 
      userLeads.some(lead => lead._id.toString() === sale.clientId || lead.lead_id.toString() === sale.clientId)
    );

    const userEquipment = equipment.filter(eq => 
      userLeads.some(lead => lead.lead_id === eq.clientId)
    );

    const userDocs = docs.filter(doc => 
      userLeads.some(lead => lead._id.toString() === doc.clientId || lead.lead_id.toString() === doc.clientId)
    );

    const totalLeads = userLeads.length;
    const wonLeads = userLeads.filter(lead => lead.status === 'won').length;
    const lostLeads = userLeads.filter(lead => ['rejected', 'loss'].includes(lead.status)).length;
    const approvedSales = userSales.filter(sale => sale.approvalStatus === 'Approved');
    const rejectedSales = userSales.filter(sale => sale.approvalStatus === 'Rejected');
    const buybackCases = userSales.filter(sale => sale.approvalStatus === 'Buyback');
    
    const initialLeaseAmount = userEquipment.reduce((sum, eq) => {
      const leaseAmount = eq.leaseAmount?.$numberDecimal || eq.leaseAmount || 0;
      return sum + parseFloat(leaseAmount);
    }, 0);

    let totalDeductions = 0;

    // Updated rejection deduction calculation
    const rejectedDeductions = rejectedSales.reduce((sum, sale) => {
      const connectedLeads = userLeads.filter(lead => 
        lead._id.toString() === sale.clientId || 
        lead.lead_id.toString() === sale.clientId
      );
      
      const saleEquipment = connectedLeads.flatMap(lead => 
        userEquipment.filter(eq => eq.clientId === lead.lead_id)
      );
      
      return sum + saleEquipment.reduce((equipSum, equip) => {
        const amount = equip.leaseAmount?.$numberDecimal || equip.leaseAmount || 0;
        return equipSum + parseFloat(amount);
      }, 0);
    }, 0);

    // Updated buyback deduction calculation
    const buybackDeductions = buybackCases.reduce((sum, sale) => {
      const connectedLeads = userLeads.filter(lead => 
        lead._id.toString() === sale.clientId || 
        lead.lead_id.toString() === sale.clientId
      );
      
      const saleEquipment = connectedLeads.flatMap(lead => 
        userEquipment.filter(eq => eq.clientId === lead.lead_id)
      );
      
      return sum + saleEquipment.reduce((equipSum, equip) => {
        const amount = equip.leaseAmount?.$numberDecimal || equip.leaseAmount || 0;
        return equipSum + (parseFloat(amount) * 1.5);
      }, 0);
    }, 0);

    totalDeductions = rejectedDeductions + buybackDeductions;
    const adjustedLeaseAmount = Math.max(0, initialLeaseAmount - totalDeductions);

    const LOSS_PENALTY_FACTOR = 0.5;
    const REJECTION_PENALTY_FACTOR = 0.3;
    const BUYBACK_PENALTY_FACTOR = 1;

    const winScore = Math.min(wonLeads * 4, 40);
    const approvedSalesScore = Math.min(approvedSales.length * 2, 20);
    const leaseAmountScore = adjustedLeaseAmount / 1000;
    const equipmentScore = userEquipment.length * 0.5;
    const docsScore = userDocs.length * 0.2;

    const lossPenalty = lostLeads * LOSS_PENALTY_FACTOR;
    const rejectionPenalty = rejectedSales.length * REJECTION_PENALTY_FACTOR;
    const buybackPenalty = buybackCases.length * BUYBACK_PENALTY_FACTOR;

    const totalScore = Math.min(
      winScore +
      approvedSalesScore +
      leaseAmountScore +
      equipmentScore +
      docsScore -
      lossPenalty -
      rejectionPenalty -
      buybackPenalty,
      100
    );

    const index = (totalScore / 10).toFixed(2);

    return {
      name: `${user.firstName} ${user.lastName}`,
      role: 'Sales Closure',
      totalLeads,
      wonLeads,
      lostLeads,
      approvedSales: approvedSales.length,
      rejectedSales: rejectedSales.length,
      buybackCases: buybackCases.length,
      totalEquipments: userEquipment.length,
      totalLeaseAmount: adjustedLeaseAmount,
      initialLeaseAmount, // For reference
      rejectedDeductions, // For reference
      buybackDeductions, // For reference
      totalDocuments: userDocs.length,
      joinDate: joiningDate.toLocaleDateString(),
      index,
      performanceDetails: {
        winScore: winScore.toFixed(2),
        approvedSalesScore: approvedSalesScore.toFixed(2),
        leaseAmountScore: leaseAmountScore.toFixed(2),
        equipmentScore: equipmentScore.toFixed(2),
        docsScore: docsScore.toFixed(2),
        lossPenalty: lossPenalty.toFixed(2),
        rejectionPenalty: rejectionPenalty.toFixed(2),
        buybackPenalty: buybackPenalty.toFixed(2)
      }
    };
  }
};