import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Lock,
  Search,
  ExternalLink,
  RefreshCw,
  Hash,
  Building,
} from 'lucide-react';
import { UploadedDocument, UserProfile, AppTab } from '../types';
import { processDocumentOcr } from '../services/api';
import { ENCRYPTION_STANDARD_LABEL } from '../mockData';
import { useLanguage } from '../LanguageContext';

interface DocumentVaultProps {
  documents: UploadedDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<UploadedDocument[]>>;
  userProfile: UserProfile;
  setActiveTab: (tab: AppTab) => void;
  onOpenOAuthModal: () => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({
  documents,
  setDocuments,
  userProfile,
  setActiveTab,
  onOpenOAuthModal,
}) => {
  const { language, t } = useLanguage();
  const [selectedDoc, setSelectedDoc] = useState<UploadedDocument | null>(
    documents[0] || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncingDigiLocker, setIsSyncingDigiLocker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newDocs: UploadedDocument[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const ocrResult = await processDocumentOcr(file);

        const newDoc: UploadedDocument = {
          id: `doc-in-${Date.now()}-${i}`,
          name: file.name,
          originalName: file.name,
          fileType: file.type || 'application/pdf',
          size: file.size,
          uploadDate:
            new Date().toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }) +
            ', ' +
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
            ' IST',
          isEncrypted: true,
          encryptionAlgorithm: 'AES-256-GCM',
          sha256Hash: ocrResult.sha256Hash,
          docType: ocrResult.docType,
          confidenceScore: ocrResult.confidenceScore,
          verificationStatus: 'verified',
          summary: ocrResult.summary,
          extractedFields: ocrResult.extractedFields,
          digiLockerIssuer: 'Government of India e-Filing Repository',
          itActSection65BVerified: true,
          securityVerification: ocrResult.securityVerification,
        };

        newDocs.push(newDoc);
      } catch (err) {
        console.error('File upload error:', err);
      }
    }

    setDocuments((prev) => [...newDocs, ...prev]);
    if (newDocs.length > 0) {
      setSelectedDoc(newDocs[0]);
    }
    setIsUploading(false);
  };

  const handleSyncDigiLocker = async () => {
    setIsSyncingDigiLocker(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSyncingDigiLocker(false);
  };

  const handleDeleteDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      confirm(
        language === 'HI'
          ? 'क्या आप इस सत्यापित दस्तावेज रिकॉर्ड को हटाना चाहते हैं?'
          : 'Are you sure you want to remove this verified document record from your case repository?'
      )
    ) {
      const updated = documents.filter((d) => d.id !== id);
      setDocuments(updated);
      if (selectedDoc?.id === id) {
        setSelectedDoc(updated[0] || null);
      }
    }
  };

  const filteredDocs = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.docType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.digiLockerIssuer &&
        d.digiLockerIssuer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 font-sans">
      
      {/* Top Header & DigiLocker Gateway Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 mb-8 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#135ca2]">
            {language === 'HI' ? 'डिजिटल इंडिया डिजिटल लॉकर रिपॉजिटरी' : 'Digital India Evidentiary Vault • डिजीलॉकर रिपॉजिटरी'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0c2340] tracking-tight mt-1">
            {t.vault.title}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t.vault.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* DigiLocker Sync Button */}
          <button
            id="btn-vault-sync-digilocker"
            onClick={handleSyncDigiLocker}
            disabled={isSyncingDigiLocker}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 border border-emerald-600 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingDigiLocker ? 'animate-spin' : ''}`} />
            <span>{isSyncingDigiLocker ? (language === 'HI' ? 'सिंक हो रहा है...' : 'Syncing...') : t.vault.syncDigiLocker}</span>
          </button>

          {/* Upload New Document Button */}
          <button
            id="btn-vault-upload-trigger"
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 bg-[#135ca2] hover:bg-[#0b3c6d] text-white rounded-lg text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 border border-[#0c2340] cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t.vault.uploadNew}</span>
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e.target.files)}
        multiple
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Upload Dropzone & Document List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#135ca2] uppercase tracking-wider bg-[#f0f7ff] px-2.5 py-1 rounded border border-[#135ca2]/20">
              {language === 'HI' ? 'खंड 1: दस्तावेज़ रिपॉजिटरी एवं अपलोड' : 'Section 1: Document Intake & Records'}
            </span>
          </div>
          
          {/* Drag & Drop Area */}
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFileUpload(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 sm:p-7 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-[#135ca2] bg-[#f0f7ff]'
                : 'border-slate-300 hover:border-slate-400 bg-[#f8fafc]'
            }`}
          >
            <UploadCloud className="w-8 h-8 text-[#135ca2] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">
              {t.vault.dragDropText}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {t.vault.supportedFormats}
            </p>
          </div>

          {/* Search Documents */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.vault.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#135ca2] focus:ring-2 focus:ring-[#135ca2]/20"
            />
          </div>

          {/* Documents List */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-[#f8fafc] border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.vault.verifiedRecords} ({filteredDocs.length})
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {filteredDocs.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;

                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-3.5 sm:p-4 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#f0f7ff] border-l-3 border-[#135ca2]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-lg bg-[#135ca2]/10 text-[#135ca2] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <h5 className="text-xs sm:text-sm font-semibold text-[#0c2340] truncate leading-tight">
                          {doc.name}
                        </h5>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {doc.docType}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => handleDeleteDoc(doc.id, e)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors rounded-md hover:bg-rose-50 cursor-pointer"
                        title={t.vault.deleteDoc}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredDocs.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs sm:text-sm">
                  {t.vault.noDocsFound}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Deep Certificate Inspector & OCR Fields */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#135ca2] uppercase tracking-wider bg-[#f0f7ff] px-2.5 py-1 rounded border border-[#135ca2]/20">
              {language === 'HI' ? 'खंड 2: क्रेडेंशियल निरीक्षण एवं धारा 65B सत्यापन' : 'Section 2: Credential Verification & Audit'}
            </span>
          </div>

          {selectedDoc ? (
            <div className="bg-white border-2 border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-5 border-b border-slate-200 gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      {t.vault.digiLockerAuthenticated}
                    </span>
                    <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-bold">
                      {t.vault.confidenceScore}: {selectedDoc.confidenceScore}%
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0c2340]">
                    {selectedDoc.docType}
                  </h3>
                  <span className="text-xs sm:text-sm text-slate-500 font-mono block mt-1">
                    {language === 'HI' ? 'मूल फ़ाइल:' : 'Original File:'} {selectedDoc.name}
                  </span>
                </div>

                <button
                  onClick={() => setActiveTab('autofill')}
                  className="px-4 py-2.5 bg-[#135ca2] hover:bg-[#0b3c6d] text-white rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0 w-fit"
                >
                  <span>{t.vault.autoFillActiveForm}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Summary of Verification */}
              <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-5 text-sm space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  {t.vault.summaryHeading}
                </span>
                <p className="text-slate-800 leading-relaxed font-sans font-medium">
                  {selectedDoc.summary}
                </p>
                {selectedDoc.digiLockerIssuer && (
                  <div className="pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-[#135ca2] font-semibold">
                    <Building className="w-4 h-4" />
                    <span>{t.vault.statutoryAuthority}: {selectedDoc.digiLockerIssuer}</span>
                  </div>
                )}
              </div>

              {/* OCR Extracted Data Matrix */}
              <div>
                <span className="text-xs font-bold text-[#0c2340] uppercase tracking-wider block mb-3">
                  {t.vault.extractedFieldsTitle}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  
                  {selectedDoc.extractedFields.fullName && (
                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
                      <span className="text-slate-500 font-medium block text-xs">
                        {t.vault.fullNameRecord}
                      </span>
                      <strong className="text-slate-900 font-bold block mt-1 text-sm sm:text-base">
                        {selectedDoc.extractedFields.fullName}
                      </strong>
                    </div>
                  )}

                  {selectedDoc.extractedFields.idNumber && (
                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
                      <span className="text-slate-500 font-medium block text-xs">
                        {t.vault.idNumberRecord}
                      </span>
                      <strong className="text-[#135ca2] font-mono font-bold block mt-1 text-sm sm:text-base">
                        {selectedDoc.extractedFields.idNumber}
                      </strong>
                    </div>
                  )}

                  {selectedDoc.extractedFields.dob && (
                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
                      <span className="text-slate-500 font-medium block text-xs">
                        {t.vault.dobRecord}
                      </span>
                      <strong className="text-slate-900 block mt-1 text-sm sm:text-base">
                        {selectedDoc.extractedFields.dob}
                      </strong>
                    </div>
                  )}

                  {selectedDoc.extractedFields.incomeAmount && (
                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
                      <span className="text-slate-500 font-medium block text-xs">
                        {t.vault.incomeRecord}
                      </span>
                      <strong className="text-emerald-800 font-mono font-bold block mt-1 text-sm sm:text-base">
                        {selectedDoc.extractedFields.incomeAmount}
                      </strong>
                    </div>
                  )}

                  {selectedDoc.extractedFields.address && (
                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs sm:col-span-2">
                      <span className="text-slate-500 font-medium block text-xs">
                        {t.vault.addressRecord}
                      </span>
                      <strong className="text-slate-900 block mt-1 text-sm">
                        {selectedDoc.extractedFields.address}
                      </strong>
                    </div>
                  )}

                  {selectedDoc.extractedFields.employerOrBusiness && (
                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs sm:col-span-2">
                      <span className="text-slate-500 font-medium block text-xs">
                        {t.vault.enterpriseRecord}
                      </span>
                      <strong className="text-slate-900 block mt-1 text-sm">
                        {selectedDoc.extractedFields.employerOrBusiness}
                      </strong>
                    </div>
                  )}

                </div>
              </div>

              {/* Cryptographic SHA-256 Hash Seal */}
              <div className="p-5 bg-[#f8fafc] border border-slate-200 rounded-xl space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <Hash className="w-4 h-4 text-[#135ca2]" />
                    <span>{t.vault.shaSealTitle}</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300">
                    {language === 'HI' ? 'छेड़छाड़ रहित' : 'Untampered'}
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-300 break-all select-all leading-relaxed">
                  {selectedDoc.sha256Hash}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedDoc.securityVerification?.notes || t.vault.itActNote}
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-16 text-center text-slate-500">
              <FileText className="w-14 h-14 text-slate-300 mx-auto mb-4" />
              <h4 className="text-base font-bold text-slate-700">{t.vault.selectCertificate}</h4>
              <p className="text-sm text-slate-500 mt-1.5">
                {language === 'HI' ? 'बाईं सूची से एक दस्तावेज़ चुनें या नया प्रमाणपत्र अपलोड करें।' : 'Choose a document from the left list or upload a new government certificate.'}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
