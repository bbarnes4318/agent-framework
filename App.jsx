import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  RotateCcw, 
  Shield, 
  Phone, 
  User, 
  Heart, 
  DollarSign, 
  Award,
  Menu,
  X,
  RefreshCw
} from 'lucide-react';

// --- DATA & CONTENT ---

const PHASES = [
  { id: 'setup', title: 'Setup', icon: Phone },
  { id: 'opening', title: 'Opening', icon: User },
  { id: 'discovery', title: 'Discovery', icon: AlertTriangle },
  { id: 'health', title: 'Health', icon: Heart },
  { id: 'mandate', title: 'Mandate', icon: DollarSign },
  { id: 'verdict', title: 'Verdict', icon: CheckCircle },
  { id: 'presentation', title: 'Presentation', icon: Award },
  { id: 'close', title: 'Close', icon: Shield },
];

const OBJECTIONS = [
  {
    label: "It's too expensive",
    content: "I totally understand. Most of our clients are on a fixed income, so we have to be careful. But let me ask you—is it that you can't afford the $XX right now, or is it that you're just not sure if it's worth that amount?"
  },
  {
    label: "I need to think about it",
    content: "That's fair. But let me ask—what specifically is it that you need to think over? Is it the monthly amount, or is it who you want to leave the money to? usually when folks tell me that, it's just the price."
  },
  {
    label: "I need to talk to my kids",
    content: "I get that. But let me ask—if you told them you were buying this to protect them from a $15,000 bill, would they tell you NOT to do it? This is for them, not you. You're the one protecting them."
  },
  {
    label: "Send me info by mail",
    content: "I wish I could, but these rates are state-regulated and change based on your exact age and health as of today. If I mail you something, it'll be wrong by the time you get it. My job is just to show you the accurate math right now. It takes 2 minutes."
  }
];

const ScriptCard = ({ children, title, type = 'standard' }) => {
  const [copied, setCopied] = useState(false);
  const textRef = useRef(null);

  const handleCopy = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(textRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'warning': return 'border-l-4 border-amber-500 bg-amber-50';
      case 'success': return 'border-l-4 border-emerald-500 bg-emerald-50';
      case 'critical': return 'border-l-4 border-red-600 bg-red-50';
      default: return 'border border-slate-200 bg-white shadow-sm';
    }
  };

  return (
    <div className={`rounded-lg p-3 mb-2 relative transition-all duration-200 ${getTypeStyles()}`}>
      <div className="flex justify-between items-center mb-1">
        {title && (
          <h3 className={`text-[10px] font-bold uppercase tracking-wider ${
            type === 'warning' ? 'text-amber-700' : 
            type === 'critical' ? 'text-red-700' : 
            'text-slate-500'
          }`}>
            {title}
          </h3>
        )}
        <button 
          onClick={handleCopy}
          className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-slate-100"
          title="Copy script"
        >
          {copied ? <span className="text-[10px] font-bold text-emerald-600">Copied!</span> : <Copy size={12} />}
        </button>
      </div>
      <div ref={textRef} className="text-base leading-snug text-slate-800 font-medium">
        {children}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function AgentScriptTool() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [transferType, setTransferType] = useState(null); // 'blind' | 'warm'
  const [healthStatus, setHealthStatus] = useState(null); // 'healthy' | 'unhealthy'
  const [checklist, setChecklist] = useState({
    meds: false,
    cancer: false,
    hospital: false,
    oxygen: false,
    tobacco: false
  });
  const [showObjections, setShowObjections] = useState(false);

  // Computed state for the wizard flow
  const screens = [
    { id: 'setup', phase: 0 },
    { id: 'intro', phase: 1 },
    { id: 'motivation', phase: 2 },
    { id: 'debt_reality', phase: 2 },
    { id: 'health_questions', phase: 3 },
    { id: 'value_stack', phase: 3 },
    { id: 'budget_anchor', phase: 4 },
    { id: 'verdict_select', phase: 5 },
    { id: 'verdict_reveal', phase: 5 },
    { id: 'goldilocks', phase: 6 },
    { id: 'close', phase: 6 },
    { id: 'pivot', phase: 7 },
  ];

  const currentScreen = screens[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < screens.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    if (currentStepIndex === screens.length - 1 || confirm("Are you sure you want to reset the call?")) {
      setCurrentStepIndex(0);
      setTransferType(null);
      setHealthStatus(null);
      setChecklist({
        meds: false, cancer: false, hospital: false, oxygen: false, tobacco: false
      });
    }
  };

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checklist).every(Boolean);

  // --- RENDER CONTENT BASED ON SCREEN ---

  const renderScreenContent = () => {
    switch (currentScreen.id) {
      case 'setup':
        return (
          <div className="flex flex-col h-full justify-center items-center space-y-4 animate-in fade-in zoom-in duration-300">
            <h1 className="text-2xl font-bold text-slate-800">Select Transfer Type</h1>
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              <button 
                onClick={() => { setTransferType('blind'); handleNext(); }}
                className="group relative flex flex-col items-center justify-center p-6 bg-white border-2 border-slate-200 hover:border-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Blind Transfer</h3>
                <p className="text-slate-500 text-center mt-1 text-xs">Fronter drops off immediately.</p>
              </button>

              <button 
                onClick={() => { setTransferType('warm'); handleNext(); }}
                className="group relative flex flex-col items-center justify-center p-6 bg-white border-2 border-slate-200 hover:border-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <User size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Warm Transfer</h3>
                <p className="text-slate-500 text-center mt-1 text-xs">Fronter introduces you.</p>
              </button>
            </div>
            
            <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg max-w-lg w-full">
              <div className="flex items-center gap-2 text-red-800 font-bold uppercase text-[10px] mb-1">
                <AlertTriangle size={12} /> Forbidden Phrases
              </div>
              <p className="text-red-900 font-medium text-sm">NEVER say "How are you?" or "How may I help you?"</p>
            </div>
          </div>
        );

      case 'intro':
        return (
          <div className="max-w-3xl mx-auto space-y-3 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-1">The Opening</h2>
            {transferType === 'blind' ? (
              <ScriptCard title="Scenario A: Blind Transfer" type="standard">
                <p className="mb-2 text-slate-400 text-xs italic">(Fronter connects call...)</p>
                <p className="mb-2">"Hi, this is <strong>[Your Name]</strong>. Whom do I have the pleasure of speaking with?"</p>
                <p className="mb-2 text-slate-400 text-xs italic">[WAIT FOR NAME. Do not ask to spell it.]</p>
                <p className="mb-2">"Pleasure to meet you, [Name]. I appreciate you holding. The previous agent just transferred you to me because I’m the local licensed specialist for <strong>[State]</strong>. They mentioned you’re <strong>[Age]</strong> and living in <strong>[City]</strong>, right?"</p>
                <p className="mb-2">"Okay, great. Now [Name], I know you didn't wake up this morning expecting to hear from me—we called you. But since I have you on the line, my job is pretty simple — I'll ask you a few quick questions, show you exactly what you qualify for, and then you decide if it makes sense. <strong>Fair enough?</strong>"</p>
              </ScriptCard>
            ) : (
              <ScriptCard title="Scenario B: Warm Transfer" type="standard">
                <p className="mb-2 text-slate-400 text-xs italic">(To Fronter):</p>
                <p className="mb-2">"Thanks [Fronter Name], I see the file here. I'll take it from here."</p>
                <p className="mb-2 text-slate-400 text-xs italic">(To Prospect):</p>
                <p className="mb-2">"Hi [Prospect Name], this is <strong>[Your Name]</strong>, the licensed specialist for <strong>[State]</strong>. I appreciate your patience while they got us connected. [Fronter Name] got me up to speed—they mentioned you're <strong>[Age]</strong> and looking to make sure the family isn't stuck with a bill, is that right?"</p>
                <p className="mb-2">"Perfect. Like I said, I'm the specialist for the area. My job is simple—I'll ask a few quick questions to see if you qualify for the state-regulated benefits. If you do, I'll show you the numbers. If not, I'll tell you that too. <strong>Fair enough?</strong>"</p>
              </ScriptCard>
            )}
          </div>
        );

      case 'motivation':
        return (
          <div className="max-w-3xl mx-auto space-y-3 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-1">The Motivation Check</h2>
            <ScriptCard title="Dig Deep" type="standard">
              <p className="mb-2">"Great. So [Name], when you were speaking with the other agent, you mentioned you wanted to make sure your family isn't stuck dealing with any final expenses when that time comes. <strong>Is that still the main thing on your mind, or is there something else driving this for you?</strong>"</p>
              <p className="mb-2 text-slate-400 text-xs italic">(Listen to response)</p>
              <p className="mb-2">"I appreciate you sharing that. You know, a lot of the folks I talk to—they're not worried about themselves. They've lived their life. What keeps them up at night is the thought of their kids or grandkids having to scramble to come up with $10,000 or $15,000 just to lay them to rest properly. <strong>Does that resonate with you at all?</strong>"</p>
            </ScriptCard>
          </div>
        );

      case 'debt_reality':
        return (
          <div className="max-w-3xl mx-auto space-y-3 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-1">The Reality of Debt</h2>
            <ScriptCard title="Identify the Beneficiary" type="standard">
              <p className="mb-2">"Perfect. So, If you didn't wake up tomorrow morning... who is the one person that would have to pick up the phone and handle everything?"</p>
              <p className="mb-2 text-slate-400 text-xs italic">(Wait for name, e.g., 'Sarah')</p>
              <p className="mb-2">"Sarah. Okay. Now, [Name], most people don't realize that funeral homes are businesses. They generally require the full $10,000 to $15,000 upfront before they will even open the doors."</p>
            </ScriptCard>
            
            <ScriptCard title="The Pain Question" type="critical">
              <p className="mb-2"><strong>"Knowing Sarah's financial situation... is she in a position to write a check that big on a Tuesday morning?"</strong></p>
              <p className="mb-2 text-slate-400 text-xs italic">(Wait for 'No')</p>
              <p className="mb-2">"Ok. Sarah would have to come up with that money somehow. How would that affect her? Would she have to borrow it? Go into debt?"</p>
            </ScriptCard>

            <ScriptCard title="The Bridge" type="success">
              <p className="mb-2">"That’s exactly why we're talking. We want to make sure Sarah gets a check, not a bill. My goal is to set this up so she never has to worry about the money. <strong>Does that sound like what you want to accomplish?</strong>"</p>
            </ScriptCard>
          </div>
        );

      case 'health_questions':
        return (
          <div className="max-w-3xl mx-auto space-y-3 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-1">Health Discovery</h2>
            <ScriptCard>
              <p className="mb-2">"Alright, so here's what I want to do. I'm going to ask you a few quick health questions—nothing invasive—just so I can match you with the right program and make sure you're not overpaying. Sound good?"</p>
            </ScriptCard>

            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-2">
              <h3 className="text-xs font-bold uppercase text-slate-500 mb-1">You must ask these questions:</h3>
              
              <label className={`flex items-start gap-3 p-2 rounded cursor-pointer transition-colors ${checklist.meds ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 hover:bg-slate-100'}`}>
                <input type="checkbox" checked={checklist.meds} onChange={() => toggleCheck('meds')} className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                <span className="text-slate-800 text-sm font-medium leading-snug">"Are you currently taking any medications for your heart—like blood thinners, or anything for cholesterol or blood pressure?"</span>
              </label>

              <label className={`flex items-start gap-3 p-2 rounded cursor-pointer transition-colors ${checklist.cancer ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 hover:bg-slate-100'}`}>
                <input type="checkbox" checked={checklist.cancer} onChange={() => toggleCheck('cancer')} className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                <span className="text-slate-800 text-sm font-medium leading-snug">"Any history of cancer, stroke, or diabetes?"</span>
              </label>

              <label className={`flex items-start gap-3 p-2 rounded cursor-pointer transition-colors ${checklist.hospital ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 hover:bg-slate-100'}`}>
                <input type="checkbox" checked={checklist.hospital} onChange={() => toggleCheck('hospital')} className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                <span className="text-slate-800 text-sm font-medium leading-snug">"Have you been hospitalized for anything in the last two years?"</span>
              </label>

              <label className={`flex items-start gap-3 p-2 rounded cursor-pointer transition-colors ${checklist.oxygen ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 hover:bg-slate-100'}`}>
                <input type="checkbox" checked={checklist.oxygen} onChange={() => toggleCheck('oxygen')} className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                <span className="text-slate-800 text-sm font-medium leading-snug">"Do you use any oxygen equipment or have any issues with your lungs?"</span>
              </label>

              <label className={`flex items-start gap-3 p-2 rounded cursor-pointer transition-colors ${checklist.tobacco ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 hover:bg-slate-100'}`}>
                <input type="checkbox" checked={checklist.tobacco} onChange={() => toggleCheck('tobacco')} className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                <span className="text-slate-800 text-sm font-medium leading-snug">"Do you smoke or use tobacco?"</span>
              </label>
            </div>
          </div>
        );

      case 'value_stack':
        return (
          <div className="max-w-3xl mx-auto space-y-3 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-1">The Value Stack</h2>
            <ScriptCard title="The Good News" type="success">
              <p className="mb-2">"Good news, [Name]—based on what you've told me, you qualify for our <strong>[Plan Tier]</strong> program. Let me tell you exactly what that means for you."</p>
            </ScriptCard>

            <ScriptCard title="3 Key Benefits" type="standard">
              <p className="mb-2">"So here's what you're looking at. This is a whole life insurance policy—not term, whole life. That means a few important things:"</p>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li><strong>First, your rate is locked in.</strong> The price I give you today will never go up. Even if your health changes.</li>
                <li><strong>Second, the benefit is guaranteed.</strong> There's no fine print. When that time comes, Sarah receives the full amount, tax-free, usually within 24 to 48 hours.</li>
                <li><strong>Third, this is 'Day One' coverage.</strong> That means the full benefit is available immediately. No waiting period.</li>
              </ul>
            </ScriptCard>
          </div>
        );

      case 'budget_anchor':
        return (
          <div className="max-w-3xl mx-auto space-y-3 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-1">The Mandate</h2>
            <ScriptCard type="standard">
              <p className="mb-2">"Okay. Based on what you've told me, I'm going to run a comparison across the top state-approved carriers. I'm filtering strictly for the 'Rate Lock' programs."</p>
              <p className="mb-2">"Most folks on a fixed income tell me they want to keep this between $50 and $80 a month."</p>
            </ScriptCard>

            <ScriptCard title="The Takeaway (Crucial)" type="warning">
              <p className="mb-2 text-lg"><strong>"If I find the right plan but it comes back at $150 a month, are you going to kick me off the phone?"</strong></p>
              <p className="mb-1 text-slate-400 text-xs italic">(Wait for laugh/agreement)</p>
              <p>"I figured. Let me pull the numbers now. Hold on."</p>
            </ScriptCard>

            <div className="bg-slate-900 text-slate-200 p-2 rounded-lg flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-slate-500 border-t-white"></div>
              <span className="text-xs font-mono uppercase tracking-widest">Silence for 10-15 seconds (Actually quote)</span>
            </div>
          </div>
        );

      case 'verdict_select':
        return (
          <div className="flex flex-col h-full justify-center items-center space-y-4 animate-in fade-in zoom-in duration-300">
            <h1 className="text-2xl font-bold text-slate-800">The Verdict</h1>
            <p className="text-slate-600 max-w-md text-center text-sm">You have analyzed the carriers. Based on their health, which path do we take?</p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              <button 
                onClick={() => { setHealthStatus('healthy'); handleNext(); }}
                className="group relative flex flex-col items-center justify-center p-6 bg-white border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <Heart size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Client is Healthy</h3>
                <p className="text-slate-500 text-center mt-1 text-xs">They qualify for Preferred rates. Pivot to "Reward".</p>
              </button>

              <button 
                onClick={() => { setHealthStatus('unhealthy'); handleNext(); }}
                className="group relative flex flex-col items-center justify-center p-6 bg-white border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                  <Shield size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Health Issues</h3>
                <p className="text-slate-500 text-center mt-1 text-xs">They have conditions (Diabetes, BP, etc). Pivot to "Leniency".</p>
              </button>
            </div>
          </div>
        );

      case 'verdict_reveal':
        return (
          <div className="max-w-3xl mx-auto space-y-3 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-1">Expert Selection</h2>
            <ScriptCard title="The Choice" type="standard">
              <p className="mb-2">"Okay, I’ve got the comparison results. I’m looking at the top three carriers available in [State]."</p>
              <p className="mb-2 font-bold text-slate-800">"Looking at the hard numbers... [Carrier Name] is the clear winner for your situation."</p>
            </ScriptCard>

            {healthStatus === 'healthy' ? (
              <ScriptCard title="Healthy Pivot: 'The Reward'" type="success">
                <p className="mb-2">"The reason I picked them is simple: <strong>Because you are in such good health for your age, they are rewarding you with their 'Preferred Standard Rate.'</strong>"</p>
                <p>"Most carriers would try to charge you the normal price, but these guys are giving you the discount because you take care of yourself."</p>
              </ScriptCard>
            ) : (
              <ScriptCard title="Issue Pivot: 'The Leniency'" type="warning">
                <p className="mb-2">"The reason I picked them is simple: <strong>They are the most lenient carrier regarding [Insert Condition].</strong>"</p>
                <p>"Most companies would force you into a waiting period for that, but these guys are accepting you for the Immediate Payout from Day 1."</p>
              </ScriptCard>
            )}

            <ScriptCard>
              <p className="mb-2 font-bold text-base">"So if God forbid something happens next week, Sarah gets the full check tax-free. That’s the most important part, right?"</p>
            </ScriptCard>
          </div>
        );

      case 'goldilocks':
        return (
          <div className="max-w-3xl mx-auto space-y-3 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-1">Goldilocks Presentation</h2>
            <ScriptCard title="Choice Architecture" type="standard">
              <p className="mb-2">"So, I’ve got three ways we can set this up for Sarah. You tell me which one feels right."</p>
              
              <div className="my-2 pl-4 border-l-2 border-slate-200 space-y-2">
                <div>
                  <div className="font-bold text-slate-700 text-sm">OPTION 1: Full Legacy</div>
                  <p className="text-slate-600">"This creates a <strong>$15,000</strong> safety net. It pays for the funeral, the stone, and leaves Sarah about $5,000 extra. That one is <strong>$XX</strong> a month."</p>
                </div>
                <div>
                  <div className="font-bold text-blue-700 text-sm">OPTION 2: Debt-Free (Recommended)</div>
                  <p className="text-slate-600">"This gives her <strong>$10,000</strong>. It covers the funeral completely so she doesn't pay a dime out of pocket. That one is <strong>$XX</strong> a month."</p>
                </div>
                <div>
                  <div className="font-bold text-slate-500 text-sm">OPTION 3: Starter</div>
                  <p className="text-slate-600">"It’s <strong>$7,000</strong>. It covers the cremation and the basics, but there won't be much left over. That is <strong>$XX</strong> a month."</p>
                </div>
              </div>
            </ScriptCard>
          </div>
        );

      case 'close':
        return (
          <div className="max-w-3xl mx-auto space-y-3 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-1">The Trade-Off Close</h2>
            
            <ScriptCard title="The Question" type="standard">
              <p className="mb-2 text-slate-400 text-xs italic">(Lower voice, casual tone)</p>
              <p className="mb-2 text-xl font-bold">"Looking at those three... do you want to leave her the extra cushion with the $15,000, or does the $10,000 feel like a better fit for the budget right now?"</p>
            </ScriptCard>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-amber-900 text-xs">
              <strong>Psychology:</strong> Notice we didn't ask "Do you want to buy it?". We asked "Which one protects her best?". This assumes the sale.
            </div>
          </div>
        );

      case 'pivot':
        return (
          <div className="max-w-3xl mx-auto space-y-3 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-1">The Checkbook Pivot</h2>
            
            <ScriptCard title="Transition" type="standard">
              <p className="mb-2 text-slate-400 text-xs italic">(Client picks $10,000)</p>
              <p className="mb-2">"Good choice. That’s exactly the one I would have recommended. It gets the job done without breaking the bank."</p>
              <p className="mb-2">"Now, we need to make sure this money goes to Sarah and nobody else. I need to ask you the formal health questions for the recording to get you approved."</p>
            </ScriptCard>

            <ScriptCard title="The Banking Details" type="critical">
              <p className="mb-2">"Perfect. You passed with flying colors. Now, the last thing is setting up the start date. Most folks like the premiums to come out on the 1st or the 3rd to match their Social Security. Which day is better for you?"</p>
              <p className="mb-2 text-slate-400 text-xs italic">(Client picks 3rd)</p>
              <p className="mb-2">"Okay, the 3rd it is. And do you bank with a big bank like Chase or Wells Fargo, or a local credit union?"</p>
              <p className="mb-2 text-slate-400 text-xs italic">(Client responds)</p>
              <p className="mb-2 font-bold text-lg">"Okay, perfect. Grab your checkbook really quick—I need to get the 9-digit routing number off the bottom so the insurance company knows exactly which bank to verify. I'll hold on while you grab it."</p>
            </ScriptCard>

            <div className="flex justify-center pt-4">
              <div className="text-center text-emerald-600 font-bold">
                 🎉 SCRIPT COMPLETE
              </div>
            </div>
          </div>
        );

      default:
        return <div>Unknown Step</div>;
    }
  };

  // --- LAYOUT ---

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-56 bg-white border-r border-slate-200 flex flex-col shadow-lg z-10 flex-shrink-0">
        <div className="h-12 flex items-center px-4 border-b border-slate-100 bg-slate-900 text-white flex-shrink-0">
          <Shield className="w-4 h-4 mr-2 text-blue-400" />
          <span className="font-bold tracking-tight text-sm">AmerBen LIVE</span>
        </div>

        {/* Progress */}
        <div className="flex-1 overflow-y-auto py-3 px-2 custom-scrollbar">
          <div className="mb-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Call Progress</h4>
            <div className="space-y-0.5">
              {PHASES.map((phase, idx) => (
                <div 
                  key={phase.id}
                  className={`flex items-center px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    currentScreen.phase === idx 
                      ? 'bg-blue-50 text-blue-700' 
                      : currentScreen.phase > idx 
                        ? 'text-emerald-600' 
                        : 'text-slate-400'
                  }`}
                >
                  {currentScreen.phase > idx ? (
                    <CheckCircle size={12} className="mr-2" />
                  ) : (
                    <phase.icon size={12} className={`mr-2 ${currentScreen.phase === idx ? 'text-blue-500' : 'text-slate-300'}`} />
                  )}
                  {phase.title}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Objections Trigger */}
          <div className="mt-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Quick Handles</h4>
            <div className="space-y-1.5">
              {OBJECTIONS.map((obj, i) => (
                <button
                  key={i}
                  onClick={() => setShowObjections(obj)}
                  className="w-full text-left px-2 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-600 transition-colors"
                >
                  {obj.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-2 border-t border-slate-100 bg-slate-50 flex-shrink-0">
           <button onClick={handleReset} className="flex items-center justify-center w-full py-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
            <RotateCcw size={12} className="mr-1.5" /> Reset Call
           </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Header Bar */}
        <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0">
          <h2 className="text-base font-bold text-slate-800">
            {PHASES[currentScreen.phase]?.title || 'Loading...'}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-2">
              Step {currentStepIndex + 1} of {screens.length}
            </span>
            <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${((currentStepIndex + 1) / screens.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area - Hides scrollbar but allows scrolling */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 relative scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
           <div className="max-w-4xl mx-auto flex flex-col pt-2 pb-4">
            {renderScreenContent()}
           </div>
        </div>

        {/* Bottom Controls */}
        <div className="h-14 bg-white border-t border-slate-200 flex items-center justify-between px-4 flex-shrink-0 z-20">
          <button 
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className={`flex items-center px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
              currentStepIndex === 0 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft size={16} className="mr-1" /> Back
          </button>

          {currentStepIndex === screens.length - 1 ? (
             <button 
             onClick={handleReset}
             className="flex items-center px-4 py-1.5 rounded-lg font-bold text-xs text-white shadow-lg bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1"
           >
             Finish & Start New Call <RefreshCw size={16} className="ml-2" />
           </button>
          ) : (
            <button 
              onClick={handleNext}
              disabled={currentScreen.id === 'health_questions' && !allChecked}
              className={`flex items-center px-4 py-1.5 rounded-lg font-bold text-xs text-white shadow-lg transition-all transform hover:-translate-y-1 ${
                currentScreen.id === 'health_questions' && !allChecked
                  ? 'bg-slate-400 cursor-not-allowed shadow-none hover:transform-none'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30'
              }`}
            >
              {currentScreen.id === 'health_questions' && !allChecked ? 'Complete Checklist' : 'Next Step'} <ChevronRight size={16} className="ml-1" />
            </button>
          )}
        </div>

        {/* Objection Overlay */}
        {showObjections && (
          <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-slate-200 z-50 p-4 animate-in slide-in-from-right duration-200 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-slate-800">Objection Handler</h3>
              <button onClick={() => setShowObjections(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg mb-3">
              <div className="text-[10px] font-bold text-amber-700 uppercase mb-1">They said:</div>
              <div className="text-sm font-bold text-slate-800 mb-1">"{showObjections.label}"</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg text-slate-100 shadow-inner flex-1 overflow-y-auto">
              <div className="flex justify-between mb-2">
                 <div className="text-[10px] font-bold text-blue-400 uppercase">You Say:</div>
                 <Copy size={12} className="text-slate-500 cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText(showObjections.content)}/>
              </div>
              <p className="text-sm leading-relaxed">{showObjections.content}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}