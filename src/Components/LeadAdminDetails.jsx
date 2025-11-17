import React, { useState, useEffect, useRef } from 'react';
import {
  FaUser, FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaStar, FaCalendarAlt, FaRegCalendarAlt, FaClock, FaCalendarPlus, FaStickyNote,
  FaQuoteLeft, FaTimes, FaUpload, FaPlay, FaPause
} from 'react-icons/fa';
import SelectSecondClosure from './SelectSecondClosure';
import CONFIG from '../Configuration';

function LeadAdminDetails({ selected, users, role, setShowFollowUp, showNotes, setShowNotes }) {
  const [showSecondFollowUp, setShowSecondFollowUp] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionType, setDecisionType] = useState('approve');
  const [qaRemarks, setQaRemarks] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showQARemarks, setShowQARemarks] = useState(false);

 
  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  // Jab bhi 'selected' lead badle, audio player ko reset karein
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
        audioRef.current.currentTime = 0;
    }
  }, [selected]);


  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating || 0);
    const half = rating && rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (rating && i < full) stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      else if (rating && i === full && half) stars.push(<FaStar key={i} className="text-yellow-400 opacity-50 text-sm" />);
      else stars.push(<FaStar key={i} className="text-gray-300 text-sm" />);
    }
    return (
      <div className="flex items-center gap-1 mt-1">
        {stars}
        {rating ? <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span> : null}
      </div>
    );
  };

  const formatDate = (date) => date || 'N/A';
  const formatTime = (time) => time || 'N/A';
  const formatDates = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    const day = d.getDate() + 1;
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to format time in MM:SS
  const formatAudioTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getUserNameByEmail = (email) => {
    if (!email || email === 'not specified') return 'Not Assigned';
    const user = users.find(u => u.email === email);
    return user ? `${user.firstName} ${user.lastName}` : email;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        alert('Sirf audio files upload kar sakte hain!');
        return;
      }
      setAudioFile(file);
    }
  };

  const handleUploadAudio = async (e) => {
    e.preventDefault();
    if (!audioFile) {
      alert('Pehle audio file select karein!');
      return;
    }

    const formData = new FormData();
    formData.append('lead_id', selected.lead_id);
    formData.append('file', audioFile);

    setUploading(true);
    try {
      const res = await fetch(`${CONFIG.API_URL}/records/createRecord`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        alert('Audio successfully upload ho gayi!');
        selected.file_path = data.data.file_path;
        selected.record_id = data.data.record_id;
        setShowUploadModal(false);
        setAudioFile(null);
      } else {
        alert('Audio upload mein error aaya!');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading audio.');
    } finally {
      setUploading(false);
    }
  };

  // Audio Player Functions
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const seekTime = e.target.value;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };


  const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start">
      <span className="mt-0.5 mr-3">{icon}</span>
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-700 break-words">{value || '-'}</p>
      </div>
    </div>
  );

  const ActionButton = ({ onClick, icon, label, className, disabled }) => (
    <button
      onClick={disabled ? null : onClick}
      disabled={disabled}
      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all text-sm font-medium shadow-sm
        ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {icon}
      {label}
    </button>
  );

  const handleDecision = async () => {
    try {
      const res = await fetch(`${CONFIG.API_URL}/leads/approve/${selected._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ QARemarks: qaRemarks, decision: decisionType }),
      });
      if (res.ok) {
        alert(`Lead ${decisionType === 'approve' ? 'Approved' : 'Disapproved'} Successfully!`);
        selected.status = decisionType === 'approve' ? 'in process' : 'rejected';
        setShowDecisionModal(false);
        setQaRemarks('');
      } else alert('Failed to update lead.');
    } catch (err) {
      console.error(err);
      alert('Error updating lead.');
    }
  };

  if (!selected)
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p>Select a lead to view details</p>
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-clr1 to-blue-500 flex items-center justify-center text-white">
              <FaUser className="text-lg" />
            </div>
            <div>
              <h2 className="flex flex-row gap-2 text-2xl font-bold text-gray-800">
                {selected.person_name}
                <button onClick={() => setShowNotes(true)} className="flex items-center gap-1 text-gray-400 hover:text-clr1">
                  <FaStickyNote className="text-[1vw]" />
                </button>
              </h2>
              <p className="text-gray-500 flex items-center gap-1 text-[0.8vw]">
                <FaBuilding className="text-sm" />
                <span>{selected.business_name}</span>
              </p>
            </div>
          </div>
          {renderStars(selected.rating)}

          <div className="flex items-center gap-2 text-xs mt-2 text-gray-500">
            <FaRegCalendarAlt className="text-gray-400" />
            <span>{formatDates(selected.followupDate)}</span>
          </div>
          {/* Audio Player Section - UPDATED */}
          <div className="flex items-center gap-3 mt-4">
            {selected.file_path ? (
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 w-full max-w-sm">
                <button
                  onClick={togglePlayPause}
                  className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-clr1 text-white hover:bg-clr2 transition"
                >
                  {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
                </button>
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xs text-gray-600 font-mono">{formatAudioTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-clr1"
                  />
                  <span className="text-xs text-gray-600 font-mono">{formatAudioTime(duration)}</span>
                </div>
                <audio
                  ref={audioRef}
                  src={`${selected.file_path}`}
                  onEnded={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  className="hidden"
                />
              </div>
            ) : (
              <span className="text-xs text-gray-400">No audio available</span>
            )}
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1 px-3 py-2 text-xs bg-white border border-clr1 text-clr1 rounded-lg hover:bg-clr1 hover:text-white transition"
            >
              <FaUpload size={12} />
              Upload
            </button>
          </div>
          {selected.status === 'pending' && (
            <div className="flex gap-2 mt-2 mb-4">
              <button
                onClick={() => {
                  setDecisionType('approve');
                  setShowDecisionModal(true);
                }}
                className="px-3 py-1 text-sm border border-blue-500 text-blue-500 bg-white hover:bg-blue-50 rounded-md transition-all shadow-sm"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  setDecisionType('disapprove');
                  setShowDecisionModal(true);
                }}
                className="px-3 py-1 text-sm border border-red-500 text-red-500 bg-white hover:bg-red-50 rounded-md transition-all shadow-sm"
              >
                Disapprove
              </button>
            </div>
          )}
        </div>
        <div className="text-right space-y-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              selected.status === 'won'
                ? 'bg-green-100 text-green-800'
                : selected.status === 'lost'
                ? 'bg-red-100 text-red-800'
                : selected.status === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {selected.status.toUpperCase()}
          </span>
          <p className="text-xs text-gray-500">
            Generated by:{' '}
            <span className="font-medium text-gray-700">{getUserNameByEmail(selected.email)}</span>
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500 justify-end">
            <FaCalendarAlt className="text-gray-400" />
            <span>{formatDate(selected.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 justify-end">
            <FaClock className="text-gray-400" />
            <span>{formatTime(selected.time)}</span>
          </div>
          <div className="flex flex-col text-xs text-gray-500 mt-1">
            <div className="flex items-center gap-2 justify-end">
              <span className="font-medium text-gray-500">Closure 1:</span>
              <span>{getUserNameByEmail(selected.closure1)}</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className="font-medium text-gray-500">Closure 2:</span>
              <span>{getUserNameByEmail(selected.closure2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end mt-2">
            <button
              onClick={() => setShowQARemarks(true)}
              className="px-3 py-1 text-xs border border-purple-500 text-purple-500 bg-white hover:bg-purple-50 rounded-md transition-all shadow-sm"
            >
              QA Remarks
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-5 mt-[-2vw]">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2 text-base border-b pb-2">
            <FaEnvelope className="text-clr1" />
            Contact Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailItem icon={<FaEnvelope className="text-gray-400" />} label="Email" value={selected.personal_email} />
            <DetailItem icon={<FaPhone className="text-gray-400" />} label="Phone" value={selected.contact} />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2 text-base border-b pb-2">
            <FaBuilding className="text-clr1" />
            Business Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailItem icon={<FaEnvelope className="text-gray-400" />} label="Business Email" value={selected.business_email} />
            <DetailItem icon={<FaPhone className="text-gray-400" />} label="Business Phone" value={selected.business_contact} />
            <DetailItem icon={<FaMapMarkerAlt className="text-gray-400" />} label="Address" value={selected.business_address} />
            <DetailItem icon={<FaCalendarAlt className="text-gray-400" />} label="Follow-up Date" value={selected.followupDate ? selected.followupDate.slice(0, 10) : '-'} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <ActionButton
          onClick={() => setShowFollowUp(true)}
          className="bg-white text-clr1 border border-clr1 hover:text-white hover:bg-clr1"
          icon={<FaCalendarPlus className="text-lg" />}
          label="Assign Closure 1"
          disabled={selected?.status === 'won' || selected?.status === 'lost'}
        />
        <ActionButton
          onClick={() => setShowSecondFollowUp(true)}
          className="bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"
          icon={<FaCalendarPlus className="text-lg" />}
          label="Assign Closure 2"
          disabled={selected?.status === 'won' || selected?.status === 'lost'}
        />
      </div>

      {/* Upload Audio Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-base font-semibold text-clr1">Upload Audio Recording</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-clr1 transition">
                <FaTimes size={16} />
              </button>
            </div>
           
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Audio File (MP3, WAV, M4A)
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-clr1"
              />
              {audioFile && (
                <p className="text-xs text-gray-500 mt-2">Selected: {audioFile.name}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-sm border rounded-md text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadAudio}
                disabled={uploading || !audioFile}
                className="px-4 py-2 text-sm text-white rounded-md bg-clr1 hover:bg-clr2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decision Modal */}
      {showDecisionModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-base font-semibold text-clr1">
                {decisionType === 'approve' ? 'Approve Lead' : 'Disapprove Lead'}
              </h3>
              <button onClick={() => setShowDecisionModal(false)} className="text-gray-400 hover:text-clr1 transition">
                <FaTimes size={16} />
              </button>
            </div>
            <textarea
              value={qaRemarks}
              onChange={(e) => setQaRemarks(e.target.value)}
              placeholder="Enter QA remarks..."
              className="w-full border border-gray-300 rounded-lg p-2 text-sm h-24 focus:outline-none focus:ring-1 focus:ring-clr1"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowDecisionModal(false)} className="px-4 py-1.5 text-sm border rounded-md text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDecision} className={`px-4 py-1.5 text-sm text-white rounded-md ${decisionType === 'approve' ? 'bg-clr1 hover:bg-clr2' : 'bg-red-500 hover:bg-red-600'}`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {showNotes && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-5">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <div className="flex items-center gap-2 text-clr1">
                <FaStickyNote className="text-lg" />
                <h3 className="text-base font-semibold text-gray-800">
                  {selected.lead_gen || 'LeadGen'}'s Notes on this Client
                </h3>
              </div>
              <button
                onClick={() => setShowNotes(false)}
                className="text-gray-400 hover:text-clr1 transition"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-lg border">
              {selected.notes ? (
                <>
                  <FaQuoteLeft className="text-gray-300 inline-block mr-2 mb-1" />
                  {selected.notes}
                </>
              ) : (
                <p className="italic text-gray-400">No notes available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showSecondFollowUp && (
        <SelectSecondClosure
          selected={selected}
          onClose={() => setShowSecondFollowUp(false)}
        />
      )}

      {showQARemarks && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h3 className="text-base font-semibold text-clr1">QA Remarks</h3>
            <button onClick={() => setShowQARemarks(false)} className="text-gray-400 hover:text-clr1 transition">
              <FaTimes size={16} />
            </button>
          </div>
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-lg border">
            {selected.QARemarks || selected.qaRemarks ? (
              <p>{selected.QARemarks || selected.qaRemarks}</p>
            ) : (
              <p className="italic text-gray-400">No QA remarks available</p>
            )}
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

export default LeadAdminDetails;