import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Paperclip,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FolderLock,
  FileCheck,
  ShieldCheck,
  Building2,
  Compass,
  Loader2,
  Zap,
} from 'lucide-react';
import {
  ChatMessage,
  UserProfile,
  DocumentItem,
  Application,
  GovernmentService,
  NavTab,
} from '../types';

export type AIAssistantViewProps = {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  userProfile: UserProfile;
  documents: DocumentItem[];
  applications: Application[];
  services: GovernmentService[];
  activeService: GovernmentService | null;
  setActiveService: (service: GovernmentService | null) => void;
  onNavigate: (tab: NavTab) => void;
  onStartAutoFill: (service: GovernmentService) => void;
  onOpenUploadModal: () => void;
  currentLanguage?: string;
};

// Component to render text with clean bullets and bold formatting without raw asterisks
const FormattedMessageText: React.FC<{ text: string; isUser?: boolean }> = ({ text, isUser }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} className="h-1" />;
        }
        let isBullet = false;
        let cleanText = trimmed;
        if (
          cleanText.startsWith('* ') ||
          cleanText.startsWith('- ') ||
          cleanText.startsWith('• ')
        ) {
          isBullet = true;
          cleanText = cleanText.substring(2).trim();
        }

        // Parse **bold** markers
        const parts = cleanText.split(/(\*\*.*?\*\*)/g);

        return (
          <div
            key={lIdx}
            className={isBullet ? 'flex items-start gap-2 pl-1 my-0.5' : 'my-0.5'}
          >
            {isBullet && (
              <span
                className={`font-bold shrink-0 select-none ${
                  isUser ? 'text-white' : 'text-indigo-600'
                }`}
              >
                •
              </span>
            )}
            <div className="flex-1">
              {parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong
                      key={pIdx}
                      className={`font-bold ${
                        isUser ? 'text-white font-extrabold' : 'text-slate-900'
                      }`}
                    >
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                const sanitized = part.replace(/\*/g, '');
                return <span key={pIdx}>{sanitized}</span>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  messages,
  setMessages,
  userProfile,
  documents,
  applications,
  services,
  activeService,
  setActiveService,
  onNavigate,
  onStartAutoFill,
  onOpenUploadModal,
  currentLanguage = 'en',
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const lastProcessedMsgIdRef = useRef<string | null>(null);
  const currentService = activeService || services[0] || null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang =
      currentLanguage === 'hi'
        ? 'hi-IN'
        : currentLanguage === 'mr'
        ? 'mr-IN'
        : currentLanguage === 'kok'
        ? 'kok-IN'
        : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSpeak = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`•]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.lang =
      currentLanguage === 'hi'
        ? 'hi-IN'
        : currentLanguage === 'mr'
        ? 'mr-IN'
        : currentLanguage === 'kok'
        ? 'kok-IN'
        : 'en-IN';
    utterance.onend = () => setSpeakingId(null);
    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const generateBotReply = async (promptToSend: string) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptToSend.trim(),
          language: currentLanguage || userProfile?.language_preference || 'en',
          history: messages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content || m.text || '',
          })),
          contextData: {
            userProfile,
            documents,
            applications,
            activeService: currentService,
          },
        }),
      });

      let replyContent = '';
      let suggestions: string[] = [];

      if (response.ok) {
        const data = await response.json();
        replyContent = data.text || '';
        suggestions = data.suggestions || [];
      } else {
        throw new Error('API offline');
      }

      const assistantMsg: ChatMessage = {
        message_id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        content:
          replyContent ||
          `I processed your request for "${promptToSend}". Let me know if you need help with any scheme!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_actions:
          suggestions.length > 0
            ? suggestions
            : ['Auto-fill scholarship application', 'What documents do I need?', 'Show all eligible schemes'],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      // Clean, simple local government advisor fallback
      const lower = promptToSend.toLowerCase();
      let replyContent = '';
      let suggestions = [
        'How do I get an income certificate?',
        'Auto-fill scholarship form',
        'Check my document readiness',
      ];

      if (
        lower.includes('scholarship') ||
        lower.includes('post-matric') ||
        lower.includes('education') ||
        lower.includes('छात्रवृत्ति') ||
        lower.includes('शिष्यवृत्ती')
      ) {
        replyContent = `Hello **${userProfile?.name || 'Citizen'}**! You are eligible for the **Post-Matric Scholarship**:\n\n• **Benefit**: 100% Tuition Fee + ₹12,000/year maintenance allowance\n• **Eligibility**: Income below ₹2.50L & enrolled in higher education\n• **Next Step**: Click below to auto-fill your application in 1 click.`;
        suggestions = ['Auto-fill scholarship application', 'What documents are required?', 'Show all schemes'];
        setActiveService(
          services.find((s) => s.service_id === 'srv-scholarship-postmatric') || currentService
        );
      } else if (
        lower.includes('income') ||
        lower.includes('certificate') ||
        lower.includes('आय') ||
        lower.includes('दाखला')
      ) {
        replyContent = `An **Income Certificate** is issued by the Taluka Mamlatdar / Revenue Office:\n\n• **Required Proofs**: Aadhaar Card, Address Proof, Salary Slip / Affidavit\n• **Turnaround Time**: Digitally issued in 3 to 5 days\n• **Validity**: 1 Financial Year.`;
        suggestions = ['Apply for scholarship', 'Check my documents', 'Show all schemes'];
      } else if (
        lower.includes('licence') ||
        lower.includes('driving') ||
        lower.includes('dl') ||
        lower.includes('लाइसेंस')
      ) {
        replyContent = `**Driving Licence Service**:\n\n• **Process**: Form 1 Self-Declaration & Biometric Verification\n• **Turnaround**: Smart Card delivered in 7 working days.`;
        suggestions = ['Check required documents', 'Track applications', 'Show all schemes'];
      } else if (
        lower.includes('pending') ||
        lower.includes('my status') ||
        lower.includes('what to do') ||
        lower.includes('my application') ||
        lower.includes('action')
      ) {
        if (applications.length > 0) {
          replyContent =
            `Here is your pending status for **${userProfile?.name || 'Citizen'}**:\n\n` +
            applications
              .map((a) => `• ⏳ **${a.service_name}**: ${a.current_step_name || 'Under Review'}`)
              .join('\n');
        } else {
          replyContent = `Hello **${userProfile?.name || 'Citizen'}**! You currently have 0 pending applications. You can explore and apply for government schemes below.`;
        }
        suggestions = ['Show my eligible schemes', 'Upload document to vault', 'Apply for scholarship'];
      } else {
        replyContent = `Hello **${userProfile?.name || 'Citizen'}**! I am **Gov AI**.\n\n• You qualify for **Post-Matric Scholarship** (100% Tuition covered)\n• You can upload and store certificates in your **Document Vault**\n• Tell me what service you would like to apply for!`;
        suggestions = ['Apply for Scholarship', 'Upload Document', 'Show All Schemes'];
      }

      const assistantMsg: ChatMessage = {
        message_id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_actions: suggestions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsTyping(false);
      isFetchingRef.current = false;
    }
  };

  // Handle queries passed from Dashboard or external components on initial view switch
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (
        lastMsg.sender === 'user' &&
        !isTyping &&
        !isFetchingRef.current &&
        lastProcessedMsgIdRef.current !== lastMsg.message_id
      ) {
        lastProcessedMsgIdRef.current = lastMsg.message_id;
        generateBotReply(lastMsg.content);
      }
    }
  }, [messages]);

  const handleSend = (customPrompt?: string) => {
    const promptToSend = customPrompt || inputText;
    if (!promptToSend.trim() || isFetchingRef.current) return;

    const newMsgId = `msg-user-${Date.now()}`;
    lastProcessedMsgIdRef.current = newMsgId;

    const userMsg: ChatMessage = {
      message_id: newMsgId,
      sender: 'user',
      content: promptToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setInputText('');
    setMessages((prev) => [...prev, userMsg]);
    generateBotReply(promptToSend.trim());
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px] font-sans">
      {/* LEFT / CENTER CHAT PANEL */}
      <div className="lg:col-span-8 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full">
        {/* Chat Stream Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">
                  Gov AI
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Online
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Personal Government Services Assistant
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('documents')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <FolderLock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Vault: {documents.length} Docs</span>
          </button>
        </div>

        {/* Conversation Stream Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.message_id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className="max-w-[85%] sm:max-w-[75%] space-y-2.5">
                  {/* Message Bubble */}
                  <div
                    className={`p-4 rounded-2xl shadow-xs ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-100/90 text-slate-900 rounded-tl-none border border-slate-200/70'
                    }`}
                  >
                    <FormattedMessageText text={msg.content} isUser={isUser} />

                    <div
                      className={`flex items-center justify-between mt-2 pt-1 border-t text-[10px] ${
                        isUser
                          ? 'border-indigo-500/50 text-indigo-200'
                          : 'border-slate-200 text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleSpeak(msg.content, msg.message_id)}
                          className="hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Read aloud"
                        >
                          {speakingId === msg.message_id ? (
                            <VolumeX className="w-3 h-3 text-indigo-600" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                          <span>{speakingId === msg.message_id ? 'Stop' : 'Listen'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Contextual Suggestions Pills */}
                  {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {msg.suggested_actions.map((act) => (
                        <button
                          key={act}
                          onClick={() => handleSend(act)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200/80 transition-colors cursor-pointer shadow-2xs"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 justify-start animate-in fade-in duration-150">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-1">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Gov AI is checking schemes &amp; database...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={onOpenUploadModal}
              className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Attach document from vault"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                isListening
                  ? 'bg-rose-50 text-rose-600 animate-pulse'
                  : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
              title={isListening ? 'Listening...' : 'Voice Input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Gov AI about scholarships, certificates, eligibility..."
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT CONTEXT PANEL */}
      <div className="hidden lg:flex lg:col-span-4 flex-col gap-4">
        {/* Active Citizen Profile Snippet */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Citizen Context
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active Sync
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Name:</span>
              <strong className="text-slate-800">{userProfile.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Aadhaar:</span>
              <span className="font-mono text-slate-700 font-bold">{userProfile.aadhaar_masked}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Annual Income:</span>
              <strong className="text-slate-800">{userProfile.annual_income}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">District:</span>
              <strong className="text-slate-800">{userProfile.district}, {userProfile.state}</strong>
            </div>
          </div>
        </div>

        {/* Quick Statutory Actions */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">Instant Statutory Actions</h4>
          </div>
          <p className="text-xs text-indigo-200">
            Gov AI can pre-fill your forms automatically using verified documents in your vault.
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => onStartAutoFill(currentService)}
              className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
            >
              <span>Auto-Fill {currentService?.category} Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('services')}
              className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer"
            >
              <span>Explore All 9 Schemes</span>
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantView;
