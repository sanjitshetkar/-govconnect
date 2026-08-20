import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  FolderLock,
  Loader2,
  ShieldCheck,
  Building2,
  HelpCircle,
  FileCheck2,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  ChatMessage,
  UserProfile,
  UploadedDocument,
  ApplicationRecord,
  AppTab,
} from '../types';
import { sendChatMessage } from '../services/api';
import { useLanguage } from '../LanguageContext';

interface ChatWindowProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  userProfile: UserProfile;
  documents: UploadedDocument[];
  applications: ApplicationRecord[];
  activeApplication: ApplicationRecord | null;
  setActiveApplication: (app: ApplicationRecord) => void;
  setActiveTab: (tab: AppTab) => void;
  onOpenNewAppModal: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  setMessages,
  userProfile,
  documents,
  applications,
  activeApplication,
  setActiveApplication,
  setActiveTab,
  onOpenNewAppModal,
}) => {
  const { language, t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Web Speech API initialization (supporting en-IN and hi-IN)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'HI' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert(
        language === 'HI'
          ? 'इस ब्राउज़र में वाक् पहचान (Speech Recognition) समर्थित नहीं है। कृपया लिखकर प्रश्न पूछें।'
          : 'Speech recognition is not supported in this browser. Please type your message.'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'HI' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Microphone error:', err);
      }
    }
  };

  const speakResponse = (text: string, messageId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'HI' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessageId = `msg-${Date.now()}`;
    const timestamp =
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';

    const newCitizenMessage: ChatMessage = {
      id: userMessageId,
      sender: 'citizen',
      role: 'user',
      text: textToSend.trim(),
      timestamp,
    };

    setMessages((prev) => [...prev, newCitizenMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        textToSend,
        messages,
        userProfile,
        documents,
        applications,
        activeApplication,
        language
      );

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai_sahayak',
        role: 'assistant',
        text: response.text,
        timestamp:
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
        suggestions: response.suggestedActions,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (ttsEnabled) {
        speakResponse(assistantMessage.text, assistantMessage.id);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai_sahayak',
        role: 'assistant',
        text:
          language === 'HI'
            ? 'सर्वर से संपर्क करने में त्रुटि हुई। कृपया पुनः प्रयास करें।'
            : 'Error connecting to the scheme advisory service. Please retry.',
        timestamp,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const statutorySuggestions =
    language === 'HI'
      ? [
          'स्टार्टअप इंडिया सीड फंड (SISFS) हेतु पात्रता जांचें',
          'मेरे डिजिलॉकर से आवेदन फॉर्म ऑटो-फिल करें',
          'PMEGP 35% ग्रामीण सब्सिडी योजना का विवरण दें',
          'डीएसटी इंस्पायर (INSPIRE) फैलोशिप में कौन से दस्तावेज चाहिए?',
        ]
      : [
          'Am I eligible for Startup India Seed Fund (SISFS)?',
          'Auto-fill my active scheme application from DigiLocker',
          'How do I claim 35% subsidy under PMEGP Scheme?',
          'What documents are needed for DST INSPIRE Fellowship?',
        ];

  const handleActionClick = (actionText: string) => {
    if (actionText.toLowerCase().includes('auto-fill') || actionText.includes('ऑटो-फिल')) {
      setActiveTab('autofill');
    } else if (
      actionText.toLowerCase().includes('upload') ||
      actionText.toLowerCase().includes('vault') ||
      actionText.includes('वॉल्ट') ||
      actionText.includes('अपलोड')
    ) {
      setActiveTab('vault');
    } else if (
      actionText.toLowerCase().includes('new') ||
      actionText.toLowerCase().includes('apply') ||
      actionText.includes('आवेदन')
    ) {
      onOpenNewAppModal();
    } else {
      handleSend(actionText);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Main Chat Interface */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#135ca2] uppercase tracking-wider bg-[#f0f7ff] px-2.5 py-1 rounded border border-[#135ca2]/20">
              {language === 'HI' ? 'खंड 1: जनसेवा एआई सहायक एवं परामर्श' : 'Section 1: AI Scheme Consultation'}
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-[740px]">
          
          {/* Header Bar */}
          <div className="bg-[#0c2340] text-white p-4 sm:p-5 border-b border-[#135ca2] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#135ca2] flex items-center justify-center text-amber-400 font-bold border border-white/20">
                <span className="text-xl">🏛️</span>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white">
                  {t.chat.headerTitle}
                </h3>
                <p className="text-xs text-slate-300">
                  {t.chat.headerSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  ttsEnabled
                    ? 'bg-[#135ca2] text-amber-300'
                    : 'text-slate-400 hover:text-white hover:bg-[#1e3a5f]'
                }`}
                title={ttsEnabled ? 'Voice assistance on' : 'Voice muted'}
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 bg-[#f8fafc]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isUser
                        ? 'bg-[#0c2340] text-white'
                        : 'bg-[#135ca2] text-amber-300'
                    }`}
                  >
                    {isUser ? (language === 'HI' ? 'आप' : 'You') : '🇮🇳'}
                  </div>

                  {/* Message Container */}
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-xl p-4 sm:p-5 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#0c2340] text-white shadow-xs'
                        : 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">{msg.text}</div>

                    {/* Action Prompts */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                        {msg.suggestions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleActionClick(action)}
                            className="px-3 py-1.5 bg-[#f0f7ff] hover:bg-[#135ca2] hover:text-white border border-[#135ca2]/30 text-[#135ca2] rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{action}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Timestamp & Controls */}
                    <div
                      className={`flex items-center justify-between text-xs mt-2.5 pt-2 border-t ${
                        isUser ? 'text-slate-300 border-slate-700/50' : 'text-slate-400 border-slate-100'
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <button
                          onClick={() => speakResponse(msg.text, msg.id)}
                          className="hover:text-[#135ca2] p-1 cursor-pointer rounded hover:bg-slate-100 transition-colors"
                          title={language === 'HI' ? 'ऑडियो सुनें' : 'Speak response'}
                        >
                          <Volume2
                            className={`w-3.5 h-3.5 ${
                              speakingMessageId === msg.id ? 'text-[#135ca2] animate-pulse' : ''
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#135ca2] text-white flex items-center justify-center text-xs">
                  🏛️
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center gap-2.5 text-xs sm:text-sm text-slate-600">
                  <Loader2 className="w-4 h-4 animate-spin text-[#135ca2]" />
                  <span>
                    {language === 'HI'
                      ? 'भारत सरकार के दिशा-निर्देशों के आधार पर उत्तर तैयार हो रहा है...'
                      : 'Consulting official guidelines and preparing advice...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Bar */}
          <div className="px-5 py-2.5 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
            {statutorySuggestions.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-3 py-1.5 bg-slate-100 hover:bg-[#135ca2] hover:text-white text-slate-700 rounded-md text-xs font-medium transition-colors shrink-0 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Composer */}
          <div className="p-4 sm:p-5 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2.5"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  id="chat-user-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isListening
                      ? language === 'HI'
                        ? 'आपकी आवाज सुनी जा रही है...'
                        : 'Listening to your voice...'
                      : t.chat.inputPlaceholder
                  }
                  className={`w-full border rounded-lg pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                    isListening
                      ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/30'
                      : 'border-slate-300 focus:border-[#135ca2] focus:ring-1 focus:ring-[#135ca2]'
                  }`}
                />

                <button
                  type="button"
                  id="btn-toggle-voice-input"
                  onClick={toggleVoiceInput}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'text-slate-500 hover:text-[#135ca2] hover:bg-slate-100'
                  }`}
                  title={isListening ? 'Stop listening' : 'Voice search (Hindi/English)'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                id="btn-send-chat"
                disabled={!inputText.trim() || isLoading}
                className="px-4 py-2.5 bg-[#135ca2] hover:bg-[#0b3c6d] disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{t.chat.send}</span>
              </button>
            </form>
          </div>

          </div>
        </div>

        {/* Right Side: Active Scheme Docket & DigiLocker Summary */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#135ca2] uppercase tracking-wider bg-[#f0f7ff] px-2.5 py-1 rounded border border-[#135ca2]/20">
              {language === 'HI' ? 'खंड 2: डॉकेट एवं क्रेडेंशियल्स' : 'Section 2: Active Docket & Records'}
            </span>
          </div>
          
          {/* Active Application Docket */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-[#135ca2] uppercase tracking-wider">
                {language === 'HI' ? 'सक्रिय योजना डॉकेट' : 'Active Scheme Docket'}
              </span>
              <button
                onClick={() => setActiveTab('autofill')}
                className="text-xs font-bold text-[#135ca2] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'HI' ? 'फॉर्म देखें' : 'View Form'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeApplication ? (
              <div className="space-y-4">
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 block w-fit">
                  {activeApplication.applicationNumber}
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#0c2340] leading-snug">
                    {language === 'HI' && activeApplication.titleHindi
                      ? activeApplication.titleHindi
                      : activeApplication.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">{activeApplication.ministryName}</p>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm pt-2">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">{language === 'HI' ? 'स्थिति:' : 'Status:'}</span>
                    <span className="font-bold text-[#135ca2]">{activeApplication.status}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">{language === 'HI' ? 'पूर्णता:' : 'Completeness:'}</span>
                    <span className="font-mono font-bold">{activeApplication.progressPercentage}%</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">{language === 'HI' ? 'अंतिम तिथि:' : 'Closing Date:'}</span>
                    <span className="font-bold text-slate-700">{activeApplication.deadline}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('autofill')}
                  className="w-full mt-2 py-2.5 bg-[#135ca2] hover:bg-[#0b3c6d] text-white rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <span>{language === 'HI' ? 'डिजिलॉकर द्वारा ऑटो-फिल करें' : 'Auto-Fill & Print Dossier'}</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm">{language === 'HI' ? 'कोई सक्रिय योजना डॉकेट चयनित नहीं है।' : 'No scheme docket selected.'}</p>
                <button
                  onClick={onOpenNewAppModal}
                  className="mt-4 px-4 py-2 bg-[#135ca2] text-white rounded-lg text-xs font-bold"
                >
                  {t.nav.applyScheme}
                </button>
              </div>
            )}
          </div>

          {/* DigiLocker Evidentiary Vault Summary */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {language === 'HI' ? 'डिजिलॉकर रिपॉजिटरी' : 'DigiLocker Records'}
              </span>
              <button
                onClick={() => setActiveTab('vault')}
                className="text-xs font-bold text-[#135ca2] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'HI' ? 'वॉल्ट खोलें' : 'Open Vault'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 mb-4">
              {documents.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 bg-[#f8fafc] rounded-lg border border-slate-200 text-xs sm:text-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileCheck2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold text-slate-900 truncate">{doc.name}</span>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    {t.nav.sec65b}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-[#f0f7ff] p-4 rounded-xl border border-[#135ca2]/30 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[#135ca2] font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'HI' ? 'डिजिटल व्यक्तिगत डेटा संरक्षण' : 'DPDP Act 2023 Compliant'}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'HI'
                  ? 'सभी प्रमाणपत्र सूचना प्रौद्योगिकी अधिनियम 2000 की धारा 65B के तहत डिजिटल रूप से हस्ताक्षरित हैं।'
                  : 'All credentials are cryptographically stamped under Section 65B of IT Act, 2000.'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
