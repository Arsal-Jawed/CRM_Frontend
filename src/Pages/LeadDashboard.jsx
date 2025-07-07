import { LeadPerformance,Leads,RemarksContainer,LeadDetails} from "../Components";

function LeadDashboard() {
  return (
    <div className="flex flex-row justify-around p-6 gap-6 h-[87.2vh]">
      <div className="flex-1 flex flex-col gap-6">
        <LeadPerformance />
        <Leads />
      </div>
      <RemarksContainer />
    </div>
  );
}
export default LeadDashboard;