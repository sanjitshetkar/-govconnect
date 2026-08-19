import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  ApplicationRecord,
  UserProfile,
  UploadedDocument,
} from '../types';
import { DEFAULT_APPLICATION_TEMPLATES } from '../mockData';
import { useLanguage } from '../LanguageContext';

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  documents: UploadedDocument[];
  onApplicationCreated: (newApp: ApplicationRecord) => void;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  documents,
  onApplicationCreated,
}) => {
  const { language, t } = useLanguage();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    DEFAULT_APPLICATION_TEMPLATES[0].id
  );

  if (!isOpen) return null;

  const selectedTemplate =
    DEFAULT_APPLICATION_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
    DEFAULT_APPLICATION_TEMPLATES[0];

  const handleCreate = () => {
    const randomCaseNum = Math.floor(100000 + Math.random() * 900000);
    const caseId = `app-in-${Date.now()}`;
    const applicationNumber = `GOI-2026-${selectedTemplate.category.substring(0, 3).toUpperCase()}-${randomCaseNum}`;

    const newRecord: ApplicationRecord = {
      id: caseId,
      applicationNumber,
      schemeCode: selectedTemplate.schemeCode,
      title: selectedTemplate.title,
      category: selectedTemplate.category,
      ministryName: selectedTemplate.ministryName,
      departmentName: selectedTemplate.departmentName,
      status: 'Drafting',
      progressPercentage: 85,
      submissionDate: null,
      lastUpdated: language === 'HI' ? 'अभी-अभी (प्रारूप से निर्मित)' : 'Just now (Created from Template)',
      deadline: selectedTemplate.statutoryDeadline || '30 Nov 2026',
      attachedDocIds: documents.map((d) => d.id),
      formTemplateId: selectedTemplate.id,
      formData: {
        applicantName: userProfile.name,
        dateOfBirth: '1995-11-20',
        gender: 'Male',
        aadhaarOrPan: `${userProfile.aadhaarMasked} / PAN: ${userProfile.panNumber}`,
        email: userProfile.email,
        phone: userProfile.phone,
        primaryAddress: 'Flat 402, Shiv Shristi Enclave, Baner Road',
        cityOrDistrict: 'Pune',
        stateOrUT: 'Maharashtra',
        pincode: '411045',
        citizenshipOrDomicile: 'Citizen of India (Maharashtra Domicile)',
        employerOrBusiness: 'Apex Cybernetics India Pvt. Ltd.',
        annualGrossIncome: '₹14,50,000',
        occupationOrDesignation: 'Founder & Principal Systems Architect',
        schemeOrCategory: selectedTemplate.category,
        requestedGrantOrSubsidy: selectedTemplate.defaultAmount || '₹25,00,000 INR',
        purposeStatement: `Official statutory application for ${selectedTemplate.title} under ${selectedTemplate.ministryName}.`,
        bankAccountNumber: '••••••••8492',
        ifscCode: 'HDFC0000180',
        bankName: 'HDFC Bank, Baner Branch, Pune',
        declarationAccepted: true,
        digitalSignature: `${userProfile.name} (Aadhaar e-Signed)`,
        dateSigned: new Date().toISOString().split('T')[0],
      },
      timeline: [
        {
          title: language === 'HI' ? 'मेरी पहचान द्वारा वैधानिक केस डॉकेट प्रारंभ' : 'Statutory Case Docket Initialized via MeriPehchaan',
          timestamp:
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
          description: language === 'HI' 
            ? `${selectedTemplate.schemeCode} दिशानिर्देशों के तहत डिजिलॉकर क्रेडेंशियल्स के साथ प्रारंभ।`
            : `Initialized under ${selectedTemplate.schemeCode} guidelines with verified DigiLocker credentials.`,
          status: 'completed',
        },
        {
          title: language === 'HI' ? 'डिजिलॉकर साक्ष्य वॉल्ट एसोसिएशन' : 'DigiLocker Evidentiary Vault Association',
          timestamp:
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
          description: language === 'HI'
            ? `${documents.length} सत्यापित धारा 65B प्रमाणपत्र केस से लिंक किए गए।`
            : `${documents.length} verified Section 65B certificates linked to case.`,
          status: 'completed',
        },
        {
          title: language === 'HI' ? 'मंत्रालय समिति जांच एवं विशेषज्ञ मूल्यांकन' : 'Ministry Committee Scrutiny & Expert Appraisal',
          timestamp: language === 'HI' ? 'अंतिम प्रस्तुति लंबित' : 'Pending Final Submission',
          description: language === 'HI' ? 'आवेदक इलेक्ट्रॉनिक प्रेषण की प्रतीक्षा में।' : 'Awaiting electronic applicant transmission.',
          status: 'upcoming',
        },
      ],
    };

    onApplicationCreated(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-lg border-2 border-slate-300 max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#0c2340] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#135ca2] flex items-center justify-center text-amber-400 font-bold border border-white/20">
              🏛️
            </div>
            <div>
              <h3 className="text-sm font-bold">{t.newApp.title}</h3>
              <p className="text-[11px] text-[#38bdf8]">
                {t.newApp.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs space-y-4 max-h-[80vh] overflow-y-auto">
          
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
            {t.newApp.selectTemplate}
          </span>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEFAULT_APPLICATION_TEMPLATES.map((tmpl) => {
              const isSelected = tmpl.id === selectedTemplateId;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#135ca2] bg-[#f0f7ff] ring-2 ring-[#135ca2]/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                      {tmpl.schemeCode}
                    </span>
                    <span className="text-[10px] font-bold text-[#135ca2]">
                      {tmpl.category}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#0c2340] leading-snug">
                    {tmpl.title}
                  </h4>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    {tmpl.ministryName}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected Template Details */}
          <div className="bg-[#f8fafc] border-2 border-slate-200 rounded-lg p-4 text-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-slate-500 font-bold block text-[10px] uppercase">
                  {t.newApp.adminAuthority}
                </span>
                <span className="font-bold text-[#0c2340] text-sm">
                  {selectedTemplate.ministryName} ({selectedTemplate.departmentName})
                </span>
              </div>
              <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                {selectedTemplate.defaultAmount || (language === 'HI' ? 'वैधानिक अनुदान' : 'Statutory Grant')}
              </span>
            </div>

            <p className="text-slate-700 leading-relaxed font-sans">
              {selectedTemplate.description}
            </p>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                {t.newApp.mandatoryEvidence}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedTemplate.requiredEvidenceList || selectedTemplate.requiredDocTypes).map(
                  (item, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-slate-300 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {t.newApp.cancel}
            </button>

            <button
              onClick={handleCreate}
              className="px-5 py-2 bg-[#135ca2] hover:bg-[#0b3c6d] text-white rounded text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-200" />
              <span>{t.newApp.initButton}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
