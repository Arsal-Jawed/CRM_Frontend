import React, { useState } from 'react';
import { FaStickyNote, FaTimes } from 'react-icons/fa';
import CONFIG from '../Configuration';

function RemarksForm({ clientId, onClose, onUpdated, leadGen }) {
  const [remark, setRemarks] = useState('');
  const [showWarning, setShowWarning] = useState(false);

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

  const containsBadWords = (text) => {
    const lower = text.toLowerCase();
    return inappropriateWords.some((word) => lower.includes(word));
  };

  const handleSave = async () => {
    if (!remark) return;

    if (containsBadWords(remark)) {
      setShowWarning(true);
      return;
    }

    try {
      await fetch(`${IP}/remarks/addRemark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remark,
          closure: user.email,
          leadGen
        })
      });
      onUpdated?.();
      onClose();
    } catch (err) {
      console.error('Remarks update failed', err);
    }
  };

  return (
    <div className={`fixed inset-0 ${showWarning ? 'bg-red-200/60' : 'bg-black/30'} flex items-center justify-center z-50`}>
      <div className="bg-white rounded-lg p-6 w-[300px] space-y-4 shadow-xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
          <FaTimes />
        </button>
        <h2 className="text-lg font-semibold text-gray-700 text-center flex items-center gap-2 justify-center">
          <FaStickyNote /> Add Remarks
        </h2>

        <textarea
          rows={4}
          value={remark}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-clr1"
          placeholder="Write remarks here..."
        />

        <div className="pt-3 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleSave} className="px-3 py-1 bg-clr1 text-white text-sm rounded hover:opacity-90">
            Save
          </button>
        </div>
      </div>

      {showWarning && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="bg-white border border-red-500 shadow-xl p-6 rounded-lg text-center">
            <p className="text-red-600 text-sm font-medium mb-4">
              Inappropriate language detected!
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="px-4 py-2 bg-black text-red-500 rounded hover:opacity-80"
            >
              I am Sorry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RemarksForm;