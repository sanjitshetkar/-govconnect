import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  Trash2,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { DocumentItem } from '../types';

export type DocumentCardProps = {
  document: DocumentItem;
  onDelete?: (id: string) => void;
  onUpload?: (category: DocumentItem['category']) => void;
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDelete,
  onUpload,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = () => {
    switch (document.status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        );
      case 'needs_attention':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
            <AlertTriangle className="w-3 h-3 text-amber-600 animate-pulse" />
            Needs Attention
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
            <Clock className="w-3 h-3 text-indigo-600 animate-spin" />
            Reading...
          </span>
        );
      case 'not_uploaded':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Not Uploaded
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 hover:border-slate-300 transition-all shadow-xs">
      <div className="flex items-start justify-between gap-3">
        {/* Left: Icon + Title + Metadata */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
            <FileText className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="font-bold text-sm text-slate-900 truncate">
                {document.document_name}
              </h4>
              {getStatusBadge()}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
              {document.upload_date && <span>Uploaded {document.upload_date}</span>}
              {document.file_size && <span>• {document.file_size}</span>}
              {document.issuer && (
                <span className="text-slate-500 font-medium">• {document.issuer}</span>
              )}
            </div>

            {document.expiry_date && (
              <div className="mt-1.5 text-xs text-amber-700 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>{document.expiry_date}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {document.extracted_fields && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{isExpanded ? 'Hide Details' : 'View Data'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(document.document_id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable OCR Details Drawer */}
      {isExpanded && document.extracted_fields && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            AI Verified Extracted Data:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(document.extracted_fields).map(([key, val]) => (
              <div key={key} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block uppercase">
                  {key}
                </span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5 truncate">
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Verification Checks Checklist */}
          {document.verification_checks && document.verification_checks.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Integrity Checks:
              </span>
              <div className="space-y-1">
                {document.verification_checks.map((check, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-1.5 text-xs ${
                      check.passed ? 'text-slate-600' : 'text-amber-800 font-semibold'
                    }`}
                  >
                    {check.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <span>{check.check_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
