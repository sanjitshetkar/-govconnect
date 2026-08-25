import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { DocumentItem } from '../types';
import { uploadAndVerifyDocument, simulateDemoUpload } from '../services/mockApi';
import Modal from './Modal';

export type FileUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (doc: DocumentItem) => void;
  defaultCategory?: DocumentItem['category'];
};

type UploadStage = 'idle' | 'reading' | 'detected' | 'verified' | 'failed';

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentAdded,
  defaultCategory = 'identity',
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<DocumentItem['category']>(defaultCategory);
  const [stage, setStage] = useState<UploadStage>('idle');
  const [dragActive, setDragActive] = useState(false);
  const [processedDoc, setProcessedDoc] = useState<DocumentItem | null>(null);
  const [failureReason, setFailureReason] = useState<string>('');
  const [isWarning, setIsWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStage('idle');
    setProcessedDoc(null);
    setDragActive(false);
    setFailureReason('');
    setIsWarning(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Called for real file uploads (drag & drop or file picker)
  const processRealFile = async (file: File) => {
    setStage('reading');
    try {
      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const result = await uploadAndVerifyDocument(file, base64Data, selectedCategory);

      if ((result as any).verificationStatus === 'failed') {
        setFailureReason((result as any).failureReason || 'Could not verify this document.');
        setStage('failed');
        return;
      }

      setIsWarning((result as any).verificationStatus === 'warning');
      setProcessedDoc(result);
      setStage('detected');
      setTimeout(() => setStage('verified'), 1200);
    } catch (err: any) {
      console.error(err);
      setFailureReason('A network error occurred. Please check your connection and try again.');
      setStage('failed');
    }
  };

  // Called for demo sample file buttons (no real file bytes available)
  const processDemoFile = async (fileName: string, cat: DocumentItem['category']) => {
    setSelectedCategory(cat);
    setStage('reading');
    try {
      const doc = await simulateDemoUpload(fileName, cat);
      setIsWarning(false);
      setProcessedDoc(doc);
      setStage('detected');
      setTimeout(() => setStage('verified'), 1200);
    } catch (err) {
      console.error(err);
      setStage('idle');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processRealFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processRealFile(e.dataTransfer.files[0]);
    }
  };

  const handleFinish = () => {
    if (processedDoc) {
      onDocumentAdded(processedDoc);
    }
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload & Verify Document"
      subtitle="Upload once to your encrypted vault and reuse across all government schemes"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Category Picker Tabs */}
        {stage === 'idle' && (
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Document Category:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'identity', label: 'Identity (Aadhaar/PAN)' },
                { key: 'education', label: 'Education (Marksheets)' },
                { key: 'income', label: 'Income Certificate' },
                { key: 'address', label: 'Address / Domicile' },
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setSelectedCategory(c.key as any)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                    selectedCategory === c.key
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
        />

        {/* STAGE 1: IDLE - DROPZONE & PICKER */}
        {stage === 'idle' && (
          <div className="space-y-4">
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
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-indigo-600 bg-indigo-50/60 ring-4 ring-indigo-500/10'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-white'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Drag &amp; drop your file here, or{' '}
                <span className="text-indigo-600 underline">browse</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1.5">
                Supports PDF, PNG, JPG (DigiLocker, e-District scans up to 15MB)
              </p>

              <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted on client-side with 256-bit AES</span>
              </div>
            </div>

            {/* Quick Demo Upload Triggers */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Or choose sample file for instant demo:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { name: 'Aadhaar_Card_Sanjit.pdf', cat: 'identity' as DocumentItem['category'] },
                  { name: 'Income_Certificate_Mamlatdar.pdf', cat: 'income' as DocumentItem['category'] },
                  { name: 'Degree_Enrollment_Transcript.pdf', cat: 'education' as DocumentItem['category'] },
                  { name: 'Goa_Domicile_15Y.pdf', cat: 'address' as DocumentItem['category'] },
                ].map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => processDemoFile(sample.name, sample.cat)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: READING / OCR SIMULATION */}
        {stage === 'reading' && (
          <div className="py-12 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-indigo-600" />
              </div>
              <Loader2 className="w-20 h-20 text-indigo-600 animate-spin absolute -top-2 -left-2" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Reading &amp; Authenticating Document...
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Extracting demographic fields, verifying QR cryptography, and matching against your citizen profile.
              </p>
            </div>
          </div>
        )}

        {/* STAGE 3 & 4: DETECTED & VERIFIED */}
        {/* STAGE: FAILED */}
        {stage === 'failed' && (
          <div className="py-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 rounded-2xl bg-red-50 border border-red-200 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <XCircle className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-red-700 tracking-wider block">
                  Verification Failed
                </span>
                <h4 className="text-base font-bold text-red-950 mt-0.5">
                  Document Could Not Be Verified
                </h4>
                <p className="text-xs text-red-600 mt-2 max-w-sm">
                  {failureReason || 'This image does not appear to be a valid government document. Please upload a clear scan of your Aadhaar, PAN, Income Certificate, or other official ID.'}
                </p>
              </div>
            </div>
            <div className="pt-1 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetState}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-indigo-600/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again with a Different File</span>
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3 & 4: DETECTED & VERIFIED */}
        {(stage === 'detected' || stage === 'verified') && processedDoc && (
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Result */}
            <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 ${
              isWarning
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-emerald-50 border border-emerald-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs ${
                  isWarning ? 'bg-amber-500' : 'bg-emerald-600'
                }`}>
                  {isWarning ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${
                    isWarning ? 'text-amber-800' : 'text-emerald-800'
                  }`}>
                    {isWarning ? 'Low Confidence — Review Required' : 'Document Detected'}
                  </span>
                  <h4 className={`text-base font-bold ${
                    isWarning ? 'text-amber-950' : 'text-emerald-950'
                  }`}>
                    {processedDoc.document_name}
                  </h4>
                </div>
              </div>
              <span className={`text-xs font-bold bg-white px-2.5 py-1 rounded-lg border ${
                isWarning
                  ? 'text-amber-800 border-amber-200'
                  : 'text-emerald-800 border-emerald-200'
              }`}>
                {stage === 'verified'
                  ? isWarning ? '⚠ Low Confidence' : '✓ 100% Verified'
                  : 'Verifying...'}
              </span>
            </div>

            {/* Extracted Fields Table */}
            {processedDoc.extracted_fields && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Extracted Citizen Information:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(processedDoc.extracted_fields).map(([k, v]) => (
                    <div
                      key={k}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        {k}
                      </span>
                      <strong className="text-xs font-bold text-slate-800 block mt-0.5">
                        {v}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Checklist */}
            {processedDoc.verification_checks && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Automated Integrity Verification:
                </span>
                {processedDoc.verification_checks.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs text-slate-700 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{c.check_name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={resetState}
                className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Upload Another
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Save to Vault &amp; Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FileUploadModal;
