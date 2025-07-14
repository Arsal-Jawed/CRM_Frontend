import React, { useState,useEffect } from 'react';
import CONFIG from '../Configuration';
import { FiUpload, FiCheck, FiArrowRight, FiUser, FiBriefcase, FiCreditCard, FiSettings, FiFileText, FiCalendar, FiDollarSign } from 'react-icons/fi';

const steps = [
  { title: 'Personal', icon: <FiUser className="text-xl" /> },
  { title: 'Business', icon: <FiBriefcase className="text-xl" /> },
  { title: 'Bank', icon: <FiCreditCard className="text-xl" /> },
  { title: 'Equipment', icon: <FiSettings className="text-xl" /> },
  { title: 'Sale', icon: <FiCalendar className="text-xl" /> },
  { title: 'Documents', icon: <FiFileText className="text-xl" /> },
  { title: 'Remarks', icon: <FiFileText className="text-xl" /> }
];

function ClientForm({ onComplete }) {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [remarks, setRemarks] = useState('');
  const email = JSON.parse(localStorage.getItem('user')).email;
  const [opsReps, setOpsReps] = useState([]);
  const IP = CONFIG.API_URL;
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    email,
    person_name: '',
    personal_email: '',
    contact: '',
    dob: '',
    ssn: '',
    driversLicenseNumber: '',
    address: '',
    business_name: '',
    business_email: '',
    businessRole: '',
    business_contact: '',
    ownershipPercentage: '',
    yearsInBusiness: '',
    locations: '',
    incorporateState: '',
    bankName: '',
    rtn: '',
    accountNumber: '',
    accountType: ''
  });

  const [equipmentData, setEquipmentData] = useState({
    brand: '',
    equipement: '',
    quantity: 1,
    leaseAmount: '',
    leaseTerm: '',
    Accessory: ''
  });

  const [saleData, setSaleData] = useState({
    submitDate: '',
    submitBy: '',
    approvalStatus: 'Pending',
    approveDate: '',
    approveBy: '',
    deliveredDate: '',
    deliveredBy: '',
    activationDate: '',
    activatedBy: '',
    leaseSubmitDate: '',
    leaseSubmitBy: '',
    leaseApprovalStatus: 'Pending',
    leaseApprovalDate: '',
    leaseApprovedBy: '',
    creditScore: 'C'
  });

  const requiredDocs = ['Driving License', 'Application Form', 'Void Check'];
  const [availableDocs, setAvailableDocs] = useState([...requiredDocs, 'Business License', 'Agreement Form']);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState('');
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };
  useEffect(() => {
  fetch(`${CONFIG.API_URL}/users/byRole/4`)
    .then(res => res.json())
    .then(setOpsReps)
    .catch(() => setOpsReps([]));
}, []);
  const validateFields = () => {
    const requiredFields = {
      0: ['person_name', 'personal_email', 'contact', 'dob', 'ssn', 'driversLicenseNumber', 'address'],
      1: ['business_name', 'business_email', 'businessRole', 'business_contact', 'ownershipPercentage', 'yearsInBusiness', 'locations', 'incorporateState'],
      2: ['bankName', 'rtn', 'accountNumber', 'accountType']
    };

    if (requiredFields[step]) {
      const empty = requiredFields[step].find(field => !formData[field]);
      if (empty) {
        setFormError(`Please fill all required fields.`);
        return false;
      }

      if (step === 0 && formData.dob) {
        const dob = new Date(formData.dob);
        const now = new Date();
        const age = now.getFullYear() - dob.getFullYear();
        if (age < 18 || (age === 18 && now < new Date(dob.setFullYear(dob.getFullYear() + 18)))) {
          setFormError('Client must be at least 18 years old');
          return false;
        }
      }
    }

    if (step === 5) {
      const missing = requiredDocs.filter(doc => !uploadedDocs.some(u => u?.docName === doc));
      if (missing.length > 0) {
        setUploadError(`Missing required documents: ${missing.join(', ')}`);
        return false;
      }
    }

    setFormError('');
    return true;
  };

  const handleNext = async () => {
    if (!validateFields()) return;

    try {
      setIsLoading(true);

      if (step === 2) {
        const res = await fetch(`${IP}/leads/createClient`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        setClientId(data.lead.lead_id);
      }

      if (step === 3) {
        const res = await fetch(`${IP}/equipments/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...equipmentData, clientId })
        });
        if (!res.ok) throw new Error('Failed to save equipment');
      }

      if (step === 4) {
        const res = await fetch(`${IP}/sales/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...saleData, clientId })
        });
        if (!res.ok) throw new Error('Failed to save sale data');
      }

      setStep(p => Math.min(p + 1, steps.length - 1));
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

 const handleUploadAndFinish = async () => {
  if (!validateFields()) return;
  
  try {
    setIsLoading(true);
    
    if (step >= 5) {
      if (uploadedDocs.some(doc => doc?.file && doc?.docName)) {
        const formData = new FormData();
        formData.append('clientId', clientId);
        formData.append('email', email);

        uploadedDocs.forEach(doc => {
          if (doc?.file && doc?.docName) {
            formData.append('files', doc.file);
            formData.append('docNames', doc.docName);
          }
        });

        const uploadRes = await fetch(`${IP}/docs/uploadMultiple`, {
          method: 'POST',
          body: formData
        });
        if (!uploadRes.ok) throw new Error('Document upload failed');
      }
    }

    // Then handle remarks if we're on step 6
    if (step === 6 && remarks) {
      const remarksRes = await fetch(`${IP}/leads/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, remarks })
      });
      if (!remarksRes.ok) throw new Error('Failed to save remarks');
    }

    onComplete();
  } catch (err) {
    setUploadError(err.message);
    alert(err.message);
  } finally {
    setIsLoading(false);
  }
};

  const field = (label, input, icon = null) => (
    <div className="flex flex-col text-sm gap-1">
      <label className="font-medium text-clr2 flex items-center gap-2">
        {icon}
        {label}
      </label>
      {input}
    </div>
  );

  const container = (children) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">{children}</div>
  );

  const renderFormFields = () => {
    if (step === 0) return container(
     <>
      {field('Full Name', <input name="person_name" placeholder="Enter client's full name" value={formData.person_name} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiUser />)}
      {field('Personal Email', <input type="email" name="personal_email" placeholder="Enter personal email" value={formData.personal_email} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiUser />)}
      {field('Contact', <input name="contact" placeholder="Enter contact number" value={formData.contact} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiUser />)}
      {field('Date of Birth', <input type="date" name="dob" placeholder="Select date of birth" value={formData.dob} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiCalendar />)}
      {field('SSN', <input name="ssn" placeholder="Enter social security number" value={formData.ssn} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiUser />)}
      {field("Driver's License No.", <input name="driversLicenseNumber" placeholder="Enter license number" value={formData.driversLicenseNumber} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiUser />)}
      {field("Address", <input name="address" placeholder="Enter residential address" value={formData.address} onChange={handleChange} className="border w-[31vw] px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiUser />)}
    </>
    );
    if (step === 1) return container(
      <>
        {field('Business Name', <input name="business_name" placeholder="Enter business name" value={formData.business_name} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiBriefcase />)}
        {field('Business Email', <input type="email" name="business_email" placeholder="Enter business email" value={formData.business_email} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiBriefcase />)}
        {field('Designation / Role', <input name="businessRole" placeholder="Enter designation or role" value={formData.businessRole} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiBriefcase />)}
        {field('Business Contact', <input name="business_contact" placeholder="Enter business contact number" value={formData.business_contact} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiBriefcase />)}
        {field('Ownership %', <input type="number" name="ownershipPercentage" placeholder="Ownership percentage" value={formData.ownershipPercentage} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiBriefcase />)}
        {field('Years in Business', <input type="number" name="yearsInBusiness" placeholder="Enter number of years" value={formData.yearsInBusiness} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiBriefcase />)}
        {field('Locations', <input type="number" name="locations" placeholder="Enter number of locations" value={formData.locations} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiBriefcase />)}
        {field('Incorporate State', <input name="incorporateState" placeholder="Enter state of incorporation" value={formData.incorporateState} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiBriefcase />)}
      </>

    );

    if (step === 2) return container(
      <>
        {field('Bank Name', <input name="bankName" placeholder="Enter bank name" value={formData.bankName} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiCreditCard />)}
        {field('Routing Number', <input name="rtn" placeholder="Enter routing number" value={formData.rtn} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiCreditCard />)}
        {field('Account Number', <input name="accountNumber" placeholder="Enter account number" value={formData.accountNumber} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiCreditCard />)}
        {field('Account Type', (
          <select name="accountType" value={formData.accountType} onChange={handleChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300">
            <option value="">Select Account Type</option>
            <option>Checking</option>
            <option>Savings</option>
            <option>Money Market</option>
            <option>Business Checking</option>
          </select>
        ), <FiCreditCard />)}
      </>
    );

    if (step === 3) return container(
      <>
        {field('Brand', (
          <select value={equipmentData.brand} onChange={e => setEquipmentData(p => ({ ...p, brand: e.target.value, equipement: '' }))} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300">
            <option value="">Select Brand</option>
            <option>Clover</option><option>NRS</option><option>Elavon</option>
          </select>
        ), <FiSettings />)}
        {field('Equipment', (
          <select value={equipmentData.equipement} onChange={e => setEquipmentData(p => ({ ...p, equipement: e.target.value }))} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" disabled={!equipmentData.brand}>
            <option value="">Select Equipment</option>
            {({
              Clover: ['CLOVER FLEX', 'CLOVER MINI', 'CLOVER STATION SOLO', 'CLOVER STATION DUO', 'CLOVER KIOSK', 'CLOVER COMPACT', 'CLOVER GO', 'CLOVER POCKET'],
              NRS: ['NRS POS', 'NRS Pay Tablet', 'NRS Register'],
              Elavon: ['Elavon Smart Terminal', 'Elavon Converge']
            })[equipmentData.brand]?.map(eq => <option key={eq} value={eq}>{eq}</option>)}
          </select>
        ), <FiSettings />)}
        {field('Quantity', <input type="number" min="1" value={equipmentData.quantity} onChange={e => setEquipmentData(p => ({ ...p, quantity: Number(e.target.value) }))} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiSettings />)}
        {field('Lease Term', (
          <select value={equipmentData.leaseTerm} onChange={e => setEquipmentData(p => ({ ...p, leaseTerm: e.target.value }))} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300">
            <option value="">Select Lease Term</option>
            <option>24</option><option>36</option><option>48</option>
          </select>
        ), <FiCalendar />)}
        {field('Lease Amount', <input type="number" step="0.01" placeholder="Enter lease amount" value={equipmentData.leaseAmount} onChange={e => setEquipmentData(p => ({ ...p, leaseAmount: e.target.value }))} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiDollarSign />)}
        {field('Accessory', <input type="text" placeholder="Enter accessory (optional)" value={equipmentData.Accessory} onChange={e => setEquipmentData(p => ({ ...p, Accessory: e.target.value }))} className="border px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiSettings />)}
      </>
    );

    if (step === 4) return (
  <div className="max-h-[38vh] overflow-y-auto pr-2">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
      {field('Submit Date', <input type="date" max={today} value={saleData.submitDate} onChange={e => setSaleData(p => ({ ...p, submitDate: e.target.value }))} className="border px-3 py-2 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiCalendar />)}
      {field('Submit By', (
        <select value={saleData.submitBy} onChange={e => setSaleData(p => ({ ...p, submitBy: e.target.value }))} className="border px-3 py-2 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300">
          <option value="" disabled>Select submitter</option>
          {opsReps.map(rep => <option key={rep.id} value={rep.name}>{rep.name}</option>)}
        </select>
      ), <FiUser />)}
      {field('Credit Score', (
        <select value={saleData.creditScore} onChange={e => setSaleData(p => ({ ...p, creditScore: e.target.value }))} className="border px-3 py-2 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300">
          <option value="" disabled>Select credit score</option>
          {['A', 'B', 'C', 'D', 'E', 'F'].map(opt => <option key={opt}>{opt}</option>)}
        </select>
      ), <FiCheck />)}
      {field('Approval Status', (
        <select value={saleData.approvalStatus} onChange={e => setSaleData(p => ({ ...p, approvalStatus: e.target.value }))} className="border px-3 py-2 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300">
          <option value="" disabled>Select approval status</option>
          {['Pending', 'Approved', 'Rejected'].map(opt => <option key={opt}>{opt}</option>)}
        </select>
      ), <FiCheck />)}
      {field('Approve Date', <input type="date" max={today} value={saleData.approveDate} onChange={e => setSaleData(p => ({ ...p, approveDate: e.target.value }))} className="border px-3 py-2 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiCalendar />)}
      {field('Approve By', (
        <select value={saleData.approveBy} onChange={e => setSaleData(p => ({ ...p, approveBy: e.target.value }))} className="border px-3 py-2 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300">
          <option value="" disabled>Select approver</option>
          {opsReps.map(rep => <option key={rep.id} value={rep.name}>{rep.name}</option>)}
        </select>
      ), <FiUser />)}
      {field('Delivered Date', <input type="date" max={today} value={saleData.deliveredDate} onChange={e => setSaleData(p => ({ ...p, deliveredDate: e.target.value }))} className="border px-3 py-2 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiCalendar />)}
      {field('Delivered By', (
        <select value={saleData.deliveredBy} onChange={e => setSaleData(p => ({ ...p, deliveredBy: e.target.value }))} className="border px-3 py-2 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300">
          <option value="" disabled>Select deliverer</option>
          {opsReps.map(rep => <option key={rep.id} value={rep.name}>{rep.name}</option>)}
        </select>
      ), <FiUser />)}
      {field('Activation Date', <input type="date" max={today} value={saleData.activationDate} onChange={e => setSaleData(p => ({ ...p, activationDate: e.target.value }))} className="border px-3 py-2 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiCalendar />)}
      {field('Activated By', (
        <select value={saleData.activatedBy} onChange={e => setSaleData(p => ({ ...p, activatedBy: e.target.value }))} className="border px-3 py-2 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300">
          <option value="" disabled>Select activator</option>
          {opsReps.map(rep => <option key={rep.id} value={rep.name}>{rep.name}</option>)}
        </select>
      ), <FiUser />)}
      {field('Lease Submit Date', <input type="date" max={today} value={saleData.leaseSubmitDate} onChange={e => setSaleData(p => ({ ...p, leaseSubmitDate: e.target.value }))} className="border px-3 py-2 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiCalendar />)}
      {field('Lease Submit By', (
        <select value={saleData.leaseSubmitBy} onChange={e => setSaleData(p => ({ ...p, leaseSubmitBy: e.target.value }))} className="border px-3 py-2 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300">
          <option value="" disabled>Select lease submitter</option>
          {opsReps.map(rep => <option key={rep.id} value={rep.name}>{rep.name}</option>)}
        </select>
      ), <FiUser />)}
      {field('Lease Approval Status', (
        <select value={saleData.leaseApprovalStatus} onChange={e => setSaleData(p => ({ ...p, leaseApprovalStatus: e.target.value }))} className="border px-3 py-2 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300">
          <option value="" disabled>Select lease approval</option>
          {['Pending', 'Approved', 'Rejected'].map(opt => <option key={opt}>{opt}</option>)}
        </select>
      ), <FiCheck />)}
      {field('Lease Approval Date', <input type="date" max={today} value={saleData.leaseApprovalDate} onChange={e => setSaleData(p => ({ ...p, leaseApprovalDate: e.target.value }))} className="border px-3 py-2 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300" />, <FiCalendar />)}
      {field('Lease Approved By', (
        <select value={saleData.leaseApprovedBy} onChange={e => setSaleData(p => ({ ...p, leaseApprovedBy: e.target.value }))} className="border px-3 py-2 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300">
          <option value="" disabled>Select lease approver</option>
          {opsReps.map(rep => <option key={rep.id} value={rep.name}>{rep.name}</option>)}
        </select>
      ), <FiUser />)}
    </div>
  </div>
);
   if (step === 5) return container(
  <div className="max-h-[45vh] overflow-y-auto space-y-3 pr-2 w-[33vw]">
    {[0, 1, 2, 3, 4].map(i => (
      <div key={i} className="flex gap-3 items-center">
        <select
          value={uploadedDocs[i]?.docName || ''}
          onChange={e => {
            const updated = [...uploadedDocs];
            if (!updated[i]) updated[i] = {};
            updated[i].docName = e.target.value;
            setUploadedDocs(updated);
          }}
          className="flex-1 border px-3 py-1 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300"
        >
          <option value="">Select Document</option>
          {availableDocs.map(doc => (
            <option key={doc} value={doc}>{doc}</option>
          ))}
        </select>
        <input
          type="file"
          onChange={e => {
            const updated = [...uploadedDocs];
            if (!updated[i]) updated[i] = {};
            updated[i].file = e.target.files[0];
            setUploadedDocs(updated);
          }}
          className="flex-1 border px-1 py-1 text-sm rounded-lg file:mr-2 file:px-2 file:py-2 file:rounded-md file:border-0 file:bg-blue-100 hover:file:bg-blue-300 file:text-blue-800"
        />
      </div>
    ))}
    {uploadError && <div className="text-red-600 text-sm">{uploadError}</div>}
  </div>
);
if (step === 6) return (
  <div className="w-full max-w-3xl">
    <label className="text-sm font-medium text-clr2 mb-2 flex items-center gap-2">
      <FiFileText /> Enter Remarks
    </label>
    <textarea
      value={remarks}
      onChange={e => setRemarks(e.target.value)}
      rows={6}
      placeholder="Enter any client-specific remarks or internal notes here..."
      className="w-full border px-4 py-3 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300 resize-none"
    />
  </div>
);


  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl">
      {/* Stepper */}
      <div className="flex justify-between items-center p-4 bg-white text-clr1">
        {steps.map((stepItem, index) => (
          <div key={index} className="flex flex-col items-center relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 
                  ${step >= index 
                    ? 'bg-clr2 text-white shadow-md' 
                    : 'bg-white text-clr1 border border-gray-300 shadow-sm'}`}
              >
                {stepItem.icon}
              </div>

            <span className={`text-xs mt-1 ${step >= index ? 'font-bold' : ''}`}>{stepItem.title}</span>
            {index < steps.length - 1 && (
              <div className={`absolute h-1 w-16 top-5 ${step > index ? 'bg-clr2' : 'bg-gray-300'} -right-8`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="p-6 bg-transparent">
        <h2 className="text-2xl font-bold text-clr1 mb-4 flex items-center gap-2">
          {steps[step].icon}
          {steps[step].title}
        </h2>
        
        {renderFormFields()}
        
        {formError && <div className="text-red-600 text-sm mt-2">{formError}</div>}

        <div className="flex justify-between mt-6">
          {step > 0 && (
            <button 
              onClick={() => setStep(p => Math.max(p - 1, 0))} 
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              Back
            </button>
          )}
          
          {step < steps.length - 1 ? (
            <button 
              onClick={handleNext} 
              disabled={isLoading}
              className="px-6 py-2 rounded-lg bg-clr1 text-white hover:bg-clr2 transition-colors ml-auto flex items-center gap-2 disabled:opacity-60"
            >
              Next <FiArrowRight />
            </button>
          ) : (
            <button 
              onClick={handleUploadAndFinish}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors ml-auto flex items-center gap-2 disabled:opacity-60"
            >
              {isLoading ? 'Processing...' : (
                <>
                  <FiUpload /> Upload and Finish
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientForm;