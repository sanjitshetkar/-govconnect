import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Printer,
  ShieldCheck,
  Building2,
  Search,
  PlusCircle,
  ExternalLink,
  Info,
  Trash2,
} from 'lucide-react';
import {
  ApplicationRecord,
  UploadedDocument,
  AppTab,
  ApplicationStatus,
} from '../types';
import { GOVERNMENT_NOTICES } from '../mockData';
import { useLanguage } from '../LanguageContext';

interface DashboardProps {
  applications: ApplicationRecord[];
  documents: UploadedDocument[];
  activeApplication: ApplicationRecord | null;
  setActiveApplication: (app: ApplicationRecord) => void;
  setActiveTab: (tab: AppTab) => void;
  onOpenNewAppModal: () => void;
  onDeleteApplication: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  applications,
  documents,
  activeApplication,
  setActiveApplication,
  setActiveTab,
  onOpenNewAppModal,
  onDeleteApplication,
}) => {
  const { language, t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<'All' | ApplicationStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Statistics
  const totalCount = applications.length;
  const approvedCount = applications.filter((a) => a.status === 'Approved').length;
  const inReviewCount = applications.filter((a) => a.status === 'In Review').length;
  const draftingCount = applications.filter((a) => a.status === 'Drafting').length;

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = statusFilter === 'All' || app.status === statusFilter;
    const matchesSearch =
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.titleHindi && app.titleHindi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.ministryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.schemeCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {t.dashboard.statusApproved}
          </span>
        );
      case 'In Review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-sky-50 text-[#135ca2] border border-sky-300 px-2.5 py-0.5 rounded">
            <Clock className="w-3 h-3 text-[#135ca2]" />
            {t.dashboard.statusInReview}
          </span>
        );
      case 'Drafting':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-0.5 rounded">
            <FileText className="w-3 h-3 text-slate-500" />
            {t.dashboard.statusDrafting}
          </span>
        );
      case 'Action Needed':
      case 'Documents Required':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            {t.dashboard.statusActionNeeded}
          </span>
        );
      default:
        return null;
    }
  };

  const filterTabs = [
    { key: 'All', label: t.dashboard.filterAll },
    { key: 'In Review', label: t.dashboard.filterInReview },
    { key: 'Approved', label: t.dashboard.filterApproved },
    { key: 'Drafting', label: t.dashboard.filterDrafting },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 font-sans">
      
      {/* Official Government Notice Banner - Clean & Uncluttered */}
      <div className="bg-[#f0f7ff] border border-[#135ca2]/30 p-4 sm:p-5 rounded-xl mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-[#135ca2] shrink-0" />
          <div className="text-xs sm:text-sm text-slate-800">
            <span className="font-bold text-[#0c2340] mr-2">
              {language === 'HI' && GOVERNMENT_NOTICES[0]?.titleHindi
                ? GOVERNMENT_NOTICES[0]?.titleHindi
                : GOVERNMENT_NOTICES[0]?.title}:
            </span>
            <span className="text-slate-600 hidden md:inline">
              {GOVERNMENT_NOTICES[0]?.description}
            </span>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('autofill')}
          className="text-xs font-bold text-[#135ca2] hover:text-[#0b3c6d] underline shrink-0 cursor-pointer flex items-center gap-1"
        >
          <span>{language === 'HI' ? 'आवेदन करें' : 'Apply Now'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top Header & Fast Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0c2340] tracking-tight">
            {t.dashboard.title}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t.dashboard.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-dashboard-new-case"
            onClick={onOpenNewAppModal}
            className="px-5 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 border border-amber-400 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.dashboard.createNewScheme}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: OVERVIEW & KEY METRICS */}
      <section className="mb-10" id="section-portfolio-overview">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold text-[#135ca2] uppercase tracking-wider bg-[#f0f7ff] px-2.5 py-1 rounded border border-[#135ca2]/20">
            {language === 'HI' ? 'खंड 1: सांख्यिकी एवं अवलोकन' : 'Section 1: Portfolio Overview'}
          </span>
        </div>

        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {t.dashboard.statTotal}
            </span>
            <div className="text-3xl font-bold text-[#0c2340] mt-2 font-mono">
              {totalCount}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {t.dashboard.statInReview}
            </span>
            <div className="text-3xl font-bold text-[#135ca2] mt-2 font-mono">
              {inReviewCount}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {t.dashboard.statApproved}
            </span>
            <div className="text-3xl font-bold text-emerald-700 mt-2 font-mono">
              {approvedCount}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {t.dashboard.statDrafting}
            </span>
            <div className="text-3xl font-bold text-slate-700 mt-2 font-mono">
              {draftingCount}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: APPLICATION DOCKETS & RECORDS */}
      <section className="mb-10" id="section-applications-records">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#135ca2] uppercase tracking-wider bg-[#f0f7ff] px-2.5 py-1 rounded border border-[#135ca2]/20">
              {language === 'HI' ? 'खंड 2: योजना आवेदन एवं डॉकेट' : 'Section 2: Application Dockets'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({filteredApplications.length} {language === 'HI' ? 'आवेदन' : 'records'})
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-6 shadow-xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="search-applications-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.dashboard.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#135ca2] focus:ring-1 focus:ring-[#135ca2] transition-all"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
                {language === 'HI' ? 'फ़िल्टर:' : 'Filter:'}
              </span>
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === tab.key
                      ? 'bg-[#0c2340] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Applications Records List */}
        <div className="space-y-4">
        {filteredApplications.map((app) => {
          const isSelected = activeApplication?.id === app.id;
          const displayTitle = language === 'HI' && app.titleHindi ? app.titleHindi : app.title;

          return (
            <div
              key={app.id}
              className={`bg-white border-2 rounded-xl p-6 sm:p-8 transition-all shadow-xs ${
                isSelected
                  ? 'border-[#135ca2] ring-4 ring-[#135ca2]/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header Details */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
                
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap mb-2">
                    <span className="font-mono text-xs font-bold bg-[#f0f7ff] text-[#0c2340] px-2.5 py-1 rounded-md border border-slate-300">
                      {app.applicationNumber}
                    </span>
                    <span className="text-xs font-mono text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-bold">
                      {app.schemeCode}
                    </span>
                    {getStatusBadge(app.status)}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#0c2340] leading-snug">
                    {displayTitle}
                  </h3>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 mt-1.5 flex-wrap">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-800">{app.ministryName}</span>
                    <span>•</span>
                    <span className="text-slate-500">{app.departmentName}</span>
                  </div>
                </div>

                {/* Scrutiny Progress Gauge */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-2.5 justify-end">
                    <span className="text-xs text-slate-500 font-medium">{t.dashboard.progressLabel}</span>
                    <span className="font-mono font-bold text-sm text-[#135ca2]">
                      {app.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-40 h-2.5 bg-slate-100 rounded-full overflow-hidden mt-1.5 border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        app.progressPercentage === 100
                          ? 'bg-emerald-600'
                          : app.progressPercentage > 70
                          ? 'bg-[#135ca2]'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${app.progressPercentage}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Summary Details - Clean Single Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm py-3 px-4 bg-slate-50 rounded-lg border border-slate-200 mb-6">
                <div>
                  <span className="text-slate-500 text-xs mr-1.5">{language === 'HI' ? 'आवेदक:' : 'Applicant:'}</span>
                  <span className="font-semibold text-slate-900">{app.formData.applicantName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs mr-1.5">{language === 'HI' ? 'अनुदान / सब्सिडी:' : 'Grant / Subsidy:'}</span>
                  <span className="font-semibold text-emerald-800 font-mono">{app.formData.requestedGrantOrSubsidy || (language === 'HI' ? 'वैधानिक फाइलिंग' : 'Statutory Filing')}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs mr-1.5">{t.dashboard.evidenceAttached}:</span>
                  <span className="font-semibold text-[#135ca2]">{app.attachedDocIds.length} {language === 'HI' ? 'दस्तावेज़' : 'Documents'}</span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>
                    {language === 'HI' ? 'अंतिम अद्यतन:' : 'Updated:'}{' '}
                    <strong className="text-slate-700">{app.lastUpdated}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    {t.dashboard.statutoryDeadline}{' '}
                    <strong className="text-slate-700">{app.deadline}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 justify-end flex-wrap">
                  
                  {/* Auto-Fill & View Form */}
                  <button
                    onClick={() => {
                      setActiveApplication(app);
                      setActiveTab('autofill');
                    }}
                    className="px-4 py-2 bg-[#135ca2] hover:bg-[#0b3c6d] text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-sky-200" />
                    <span>{language === 'HI' ? 'ऑटो-फिल एवं समीक्षा' : 'Auto-Fill & Review'}</span>
                  </button>

                  {/* Print Statutory Form */}
                  <button
                    onClick={() => {
                      setActiveApplication(app);
                      setActiveTab('autofill');
                    }}
                    className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span>{t.dashboard.viewAndPrint}</span>
                  </button>

                  {/* Ask AI Sahayak */}
                  <button
                    onClick={() => {
                      setActiveApplication(app);
                      setActiveTab('chat');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{language === 'HI' ? 'सहायक' : 'AI Help'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Draft Option */}
                  {app.status === 'Drafting' && (
                    <button
                      onClick={() => {
                        if (confirm(language === 'HI' ? `क्या आप प्रारूप डॉकट ${app.applicationNumber} को हटाना चाहते हैं?` : `Are you sure you want to delete draft docket ${app.applicationNumber}?`)) {
                          onDeleteApplication(app.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 cursor-pointer"
                      title={t.dashboard.deleteDocket}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                </div>

              </div>

            </div>
          );
        })}

        {filteredApplications.length === 0 && (
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-16 text-center">
            <FileText className="w-14 h-14 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">{t.dashboard.noApplicationsFound}</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1.5 mb-6">
              {language === 'HI' ? 'आपके खोज मापदंड से मेल खाता कोई रिकॉर्ड उपलब्ध नहीं है।' : 'There are no scheme dockets matching your current search query or filter.'}
            </p>
            <button
              onClick={onOpenNewAppModal}
              className="px-5 py-2.5 bg-[#135ca2] text-white rounded-lg text-sm font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.dashboard.createNewScheme}</span>
            </button>
          </div>
        )}
        </div>
      </section>

      {/* SECTION 3: NATIONAL CITIZEN SCHEMES DIRECTORY */}
      <section id="section-national-schemes" className="pt-2">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#135ca2] uppercase tracking-wider bg-[#f0f7ff] px-2.5 py-1 rounded border border-[#135ca2]/20">
              {language === 'HI' ? 'खंड 3: प्रमुख राष्ट्रीय योजनाएं एवं त्वरित आवेदन' : 'Section 3: National Schemes & Quick Apply'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  MSME-PMEGP
                </span>
                <span className="text-xs text-slate-500">{language === 'HI' ? '35% तक सब्सिडी' : 'Up to 35% Subsidy'}</span>
              </div>
              <h4 className="font-bold text-sm text-[#0c2340]">
                {language === 'HI' ? 'प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)' : 'Prime Minister Employment Generation Programme'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'HI' ? 'सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय • विनिर्माण एवं सेवा इकाइयां' : 'Ministry of Micro, Small & Medium Enterprises • Credit-linked subsidy'}
              </p>
            </div>
            <button
              onClick={onOpenNewAppModal}
              className="mt-4 w-full py-2 bg-[#f0f7ff] hover:bg-[#135ca2] hover:text-white text-[#135ca2] rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{language === 'HI' ? 'नया आवेदन प्रारंभ करें' : 'Start Application'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  AGRI-PMKISAN
                </span>
                <span className="text-xs text-slate-500">{language === 'HI' ? '₹6,000 / वर्ष DBT' : '₹6,000 / yr DBT'}</span>
              </div>
              <h4 className="font-bold text-sm text-[#0c2340]">
                {language === 'HI' ? 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)' : 'Pradhan Mantri Kisan Samman Nidhi'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'HI' ? 'कृषि एवं किसान कल्याण मंत्रालय • भूमिधारक कृषक परिवार' : 'Ministry of Agriculture & Farmers Welfare • Direct Income Support'}
              </p>
            </div>
            <button
              onClick={onOpenNewAppModal}
              className="mt-4 w-full py-2 bg-[#f0f7ff] hover:bg-[#135ca2] hover:text-white text-[#135ca2] rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{language === 'HI' ? 'नया आवेदन प्रारंभ करें' : 'Start Application'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  EDU-NSP-POST
                </span>
                <span className="text-xs text-slate-500">{language === 'HI' ? 'वार्षिक छात्रवृत्ति' : 'Annual Scholarship'}</span>
              </div>
              <h4 className="font-bold text-sm text-[#0c2340]">
                {language === 'HI' ? 'राष्ट्रीय छात्रवृत्ति पोर्टल (पोस्ट-मैट्रिक योजना)' : 'National Scholarship Scheme (Post-Matric)'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'HI' ? 'सामाजिक न्याय एवं अधिकारिता मंत्रालय • उच्च शिक्षा सहायता' : 'Ministry of Social Justice & Empowerment • Higher Education Support'}
              </p>
            </div>
            <button
              onClick={onOpenNewAppModal}
              className="mt-4 w-full py-2 bg-[#f0f7ff] hover:bg-[#135ca2] hover:text-white text-[#135ca2] rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{language === 'HI' ? 'नया आवेदन प्रारंभ करें' : 'Start Application'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
