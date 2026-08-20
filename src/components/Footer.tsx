import React from 'react';
import {
  ShieldCheck,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { NATIONAL_PORTAL_HELPLINE } from '../mockData';
import { useLanguage } from '../LanguageContext';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-[#061528] text-slate-300 border-t-2 border-[#135ca2] text-xs font-sans no-print mt-auto">
      
      {/* Top Footer Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: State Emblem & Portal Details */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#135ca2] flex flex-col items-center justify-center text-amber-400 font-bold border border-white/20">
                <span className="text-lg">🏛️</span>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#f59e0b] uppercase block">
                  {t.footer.emblemText}
                </span>
                <span className="font-bold text-white text-sm">JanSeva.gov.in</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.footer.portalDesc}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.footer.complianceBadge}</span>
            </div>
          </div>

          {/* Col 2: Key Central Portals */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
              {t.footer.centralPortalsTitle}
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a
                  href="https://india.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 hover:underline"
                >
                  <span>{language === 'HI' ? 'भारत का राष्ट्रीय पोर्टल (india.gov.in)' : 'National Portal of India (india.gov.in)'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.digilocker.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 hover:underline"
                >
                  <span>{language === 'HI' ? 'डिजिलॉकर राष्ट्रीय क्लाउड' : 'DigiLocker National Cloud'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://uidai.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 hover:underline"
                >
                  <span>{language === 'HI' ? 'UIDAI आधार ई-केवाईसी पोर्टल' : 'UIDAI Aadhaar e-KYC Portal'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.startupindia.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 hover:underline"
                >
                  <span>{language === 'HI' ? 'स्टार्टअप इंडिया हब (DPIIT)' : 'Startup India Hub (DPIIT)'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://udyamregistration.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 hover:underline"
                >
                  <span>{language === 'HI' ? 'एमएसएमई उद्यम पंजीकरण पोर्टल' : 'MSME Udyam Portal'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory Acts & Public Policies */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
              {t.footer.actsPoliciesTitle}
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <span className="text-slate-300 font-medium">
                  {language === 'HI' ? 'सूचना प्रौद्योगिकी अधिनियम, 2000 (धारा 65B)' : 'Information Technology Act, 2000 (Section 65B)'}
                </span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">
                  {language === 'HI' ? 'आईटी नियम 2016 का नियम 9A (डिजिलॉकर विधिक समकक्षता)' : 'Rule 9A of IT Rules 2016 (DigiLocker Legal Equivalence)'}
                </span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">
                  {language === 'HI' ? 'सूचना का अधिकार (RTI) अधिनियम, 2005' : 'Right to Information (RTI) Act, 2005'}
                </span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">
                  {language === 'HI' ? 'डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम, 2023' : 'Digital Personal Data Protection (DPDP) Act, 2023'}
                </span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">
                  {language === 'HI' ? 'भारतीय शपथ अधिनियम, 1969 इलेक्ट्रॉनिक घोषणाएं' : 'Indian Oaths Act, 1969 Electronic Declarations'}
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: National Helpdesk & Helplines */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
              {t.footer.helpdeskTitle}
            </h4>
            <div className="p-3 bg-[#0c2340] border border-[#1e3a5f] rounded space-y-2">
              <div className="flex items-center gap-2 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span className="font-mono font-bold text-slate-200">
                  {NATIONAL_PORTAL_HELPLINE}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span className="font-mono text-slate-300">
                  support.janseva@gov.in
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block pt-1 border-t border-[#1e3a5f]">
                {t.footer.helpdeskDesc}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright & NIC Attribution */}
      <div className="bg-[#030b14] border-t border-[#1e3a5f] py-4 text-center text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {t.footer.nicCredit}
          </span>
          <span className="font-mono text-[10px] text-slate-500">
            {t.footer.lastReviewed}
          </span>
        </div>
      </div>

    </footer>
  );
};
