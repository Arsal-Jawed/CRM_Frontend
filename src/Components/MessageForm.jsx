import { useEffect, useState } from 'react';
import { FaTimes, FaPaperclip, FaPaperPlane, FaUser, FaTag, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import CONFIG from '../Configuration';

function MessageForm({ onClose }) {
  const [receiver, setReceiver] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [users, setUsers] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const IP = CONFIG.API_URL;

   const inappropriateWords = ['fuck', 'fucked', 'racist', 'fucker', 'ass', 'exploit', 'porn', 'explicit', 'vulgar', 'naked', 
    'kill', 'murder', 'terrorist', 'rape', 'pussy', 'vagina', 'harass', 'slur', 'dick', 'abuser', 'bully', 
    'molest', 'drugs', 'cock', 'asshole', 'gay', 'transgender', 'sexy', 'suicide', 'kafir', 
    'misogyny', 'sexism', 'xenophobia', 'homophobia', 'transphobia', 'abduction', 'exploitation', 'trafficking', 
    'profanity', 'kaafir', 'degrading', 'humiliate', 'exploitative', 'sadist', 'cum', 'malicious', 'extremism', 
    'missionary', 'doggy', 'doggystyle', 'whore', 'boobs', 'boob', 'breast', 'hip', 'hips', 'nipple', 'orgasm', 
    'masturbate', 'masturbation', 'ejaculation', 'anal', 'squirting', 'squirt','blowjob', 'handjob', 'threesome', 
    'foursome', 'incest', 'penetration', 'creampie', 'gangbang', 'hentai', 'xhamster', 'fetish', 'dominatrix', 
    'submissive', 'sadomasochism', 'erotic', 'bondage', 'nude', 'strip', 'striptease', 'pornhub', 'xvideos', 
    'redtube', 'onlyfans', 'camgirl', 'camsite', 'amateur', 'adult', 'swinger', 'foreplay', 'hookup', 'sexcam',
    'brazzers', 'bangbros', 'naughtyamerica', 'teamSkeet', 'metart', 'joymii', 'realitykings', 'evilangel', 
    'digitalplayground', 'kink', 'vrporn', 'javhub', 'pornhd', 'desipapa', 'tamilsex', 'bhabhixxx', 'hindisex', 
    'bhabhiporn', 'desisexvideos', 'bangla', 'punesex', 'keralaporn', 'sikhporn', 'indiansex', 'malluporn', 
    'indianbhabhi', 'hotindian', 'indianfuck', 'indianporn', 'indiananal', 'indianhentai',
    'chutiya', 'gandu', 'bhenchod', 'madarchod', 'lund', 'chut', 'behenchod', 'bhosdike', 'gaand', 'chod', 
    'randi', 'saala', 'saali', 'chutmarani', 'bhen', 'ma', 'haraami', 'harami', 'paagal', 'bakchod', 
    'chodu', 'rakhail', 'chutiyapa', 'chutkula', 'ghus', 'bhadwa', 'bhadwe', 'lauda', 'laude', 'gaandfat', 
    'peshab', 'thook', 'chachundar', 'saand', 'gobar', 'kutta', 'kaminey', 'kaminay', 'hijra', 'gand', 'bsdk',
    'rapist', 'peeping', 'voyeur', 'scat', 'vomit', 'bestiality', 'pedophile', 'molester', 'maniac', 
    'pervert', 'necrophilia', 'zoophilia', 'gore', 'degradation', 'incel', 'simp', 'slut', 'hoe', 
    'hooker', 'bimbo', 'goldigger', 'smut', 'obscene', 'perversion', 'smutty', 'taboo', 'seduction', 
    'lewd', 'lustful', 'adultwork','infidelity','pornstar','bbc','blacked','blackedraw','bbw','spank','brazzer'];

  const hasInappropriateContent = (text) => {
  const words = text.toLowerCase().split(/\W+/);
  return words.some(word => inappropriateWords.includes(word));
};


  const getRoleLabel = (role) => {
    if (role === 1) return 'Sales Head';
    if (role === 2) return 'Sales Closure';
    if (role === 3) return 'Lead Gen';
    if (role === 4) return 'Operation Agent'
    return 'Unknown';
  };

  const handleSend = async () => {
    if (!receiver || !subject || !body) return;

    if (hasInappropriateContent(subject) || hasInappropriateContent(body)) {
      setShowWarning(true);
      return;
    }

    setIsSending(true);
    try {
      await fetch(`${IP}/messages/addMsg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: user.email,
          reciever: receiver,
          subject,
          message: body
        })
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${IP}/users/getAllUsers`);
        const data = await res.json();

        const filtered = data.filter(u => {
          if (u.email === user.email) return false;
          if (user.role === 1 || user.role === 2) return true;
          if (user.role === 3) return u.role === 1 || u.role === 2;
          if (user.role === 4) return u.role === 1 || u.role === 2 || u.role === 4;
          return false;
        });

        const sorted = filtered.sort((a, b) => {
          if (a.role !== b.role) return a.role - b.role;
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });

        setUsers(sorted);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };

    fetchUsers();
  }, [IP, user]);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-clr1 to-clr1/90 p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <FaPaperPlane className="mr-2" />
              New Message
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <FaTimes />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaUser />
              </div>
              <select
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 outline-none rounded-lg focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
              >
                <option value="">Select Recipient</option>
                {users.map(u => (
                  <option key={u.email} value={u.email}>
                    {u.firstName} {u.lastName} ({getRoleLabel(u.role)})
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaTag />
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <textarea
                rows={6}
                placeholder="Write your message..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-3 focus:outline-none resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={isSending || !receiver || !subject || !body}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-clr1 hover:bg-clr1/90 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? 'Sending...' : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-red-500 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Inappropriate Content Detected</h3>
            <p className="text-gray-600 mb-5">Please review your message and remove any offensive language before sending.</p>
            <button
              onClick={() => setShowWarning(false)}
              className="w-full px-4 py-2.5 rounded-lg text-white bg-clr1 hover:bg-clr1/90 transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white shadow-2xl p-6 rounded-xl text-center border border-green-300">
            <div className="flex flex-col items-center">
              <FaCheckCircle className="text-green-500 text-4xl mb-2" />
              <p className="text-green-600 font-semibold">Message Sent Successfully!</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MessageForm;