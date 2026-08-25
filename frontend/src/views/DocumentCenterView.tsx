import React, { useState } from 'react';
import {
  FolderLock,
  UploadCloud,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { DocumentItem, DocumentCategory, LanguageCode } from '../types';
import { useTranslation } from '../translations';
import DocumentCard from '../components/DocumentCard';
import PageHeader from '../components/PageHeader';

export type DocumentCenterViewProps = {
  documents: DocumentItem[];
  currentLanguage?: LanguageCode;
  onOpenUploadModal: (category?: DocumentCategory) => void;
  onDeleteDocument: (id: string) => void;
};

export const DocumentCenterView: React.FC<DocumentCenterViewProps> = ({
  documents,
  currentLanguage = 'en',
  onOpenUploadModal,
  onDeleteDocument,
}) => {
  const { t } = useTranslation(currentLanguage);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | DocumentCategory>('all');

  const categories: { key: 'all' | DocumentCategory; label: string }[] = [
    { key: 'all', label: t.documents.allTab },
    { key: 'identity', label: t.documents.identityTab },
    { key: 'education', label: t.documents.educationTab },
    { key: 'income', label: t.documents.incomeTab },
    { key: 'address', label: t.documents.addressTab },
  ];

  const filteredDocs = documents.filter((d) => {
    const matchesCategory =
      activeFilter === 'all' || d.category === activeFilter;
    const matchesSearch =
      d.document_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.issuer && d.issuer.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const verifiedCount = documents.filter((d) => d.status === 'verified').length;

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Page Header */}
      <PageHeader
        badge={currentLanguage === 'hi' ? 'एन्क्रिप्टेड नागरिक वॉल्ट' : currentLanguage === 'mr' ? 'एन्क्रिप्टेड नागरिक वॉल्ट' : currentLanguage === 'kok' ? 'सुरक्षित दस्तऐवज वॉल्ट' : 'Encrypted Citizen Vault'}
        title={t.documents.title}
        subtitle={t.documents.subtitle}
        action={
          <button
            onClick={() => onOpenUploadModal()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.documents.uploadBtn}</span>
          </button>
        }
      />

      {/* Trust & Vault Stats Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              DigiLocker &amp; Cryptographic Storage Active
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {verifiedCount} of {documents.length} records verified with zero tampering risk.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 font-bold">
            AES-256-GCM
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified documents by name or issuer..."
            className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl text-sm transition-all shadow-xs"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveFilter(c.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === c.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/90'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Document Sections */}
      <div className="space-y-4">
        {filteredDocs.map((doc) => (
          <DocumentCard
            key={doc.document_id}
            document={doc}
            onDelete={onDeleteDocument}
          />
        ))}

        {filteredDocs.length === 0 && (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
            <FolderLock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800">
              No documents found in this category
            </h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Upload a document scan or connect your DigiLocker to auto-verify.
            </p>
            <button
              onClick={() => onOpenUploadModal()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentCenterView;
