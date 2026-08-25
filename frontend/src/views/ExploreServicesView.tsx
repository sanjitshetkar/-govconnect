import React, { useState } from 'react';
import { Search, Compass, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { GovernmentService, LanguageCode } from '../types';
import { useTranslation } from '../translations';
import ServiceCard from '../components/ServiceCard';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';

export type ExploreServicesViewProps = {
  services: GovernmentService[];
  currentLanguage?: LanguageCode;
  onSelectService: (service: GovernmentService) => void;
};

const CATEGORIES = [
  'All',
  'Identity & Cards',
  'Loans',
  'Education',
  'Certificates',
  'Transport',
  'Housing',
];

export const ExploreServicesView: React.FC<ExploreServicesViewProps> = ({
  services,
  currentLanguage = 'en',
  onSelectService,
}) => {
  const { t } = useTranslation(currentLanguage);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORY_MAP: Record<string, string> = {
    All: t.services.allCategories,
    'Identity & Cards':
      currentLanguage === 'hi'
        ? 'पहचान व कार्ड (PAN/Voter)'
        : currentLanguage === 'mr'
        ? 'ओळख व कार्ड (PAN/Voter)'
        : currentLanguage === 'kok'
        ? 'ओळख व कार्ड (PAN/Voter)'
        : 'Identity & Cards',
    Loans:
      currentLanguage === 'hi'
        ? 'सरकारी लोन व ऋण'
        : currentLanguage === 'mr'
        ? 'शासकीय कर्ज योजना'
        : currentLanguage === 'kok'
        ? 'कर्ज येवजण्यो'
        : 'Government Loans',
    Education: t.services.education,
    Certificates:
      currentLanguage === 'hi'
        ? 'प्रमाणपत्र'
        : currentLanguage === 'mr'
        ? 'प्रमाणपत्रे'
        : currentLanguage === 'kok'
        ? 'दाखले'
        : 'Certificates',
    Transport: t.services.transport,
    Housing: t.services.housing,
  };

  const filteredServices = services.filter((s) => {
    const matchesCat =
      selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <PageHeader
        badge={currentLanguage === 'hi' ? 'राष्ट्रीय योजना निर्देशिका' : currentLanguage === 'mr' ? 'राष्ट्रीय योजना निर्देशिका' : currentLanguage === 'kok' ? 'राष्ट्रीय येवजण्यो म्हायती' : 'Unified National Directory'}
        title={t.services.title}
        subtitle={t.services.subtitle}
      />

      {/* Search Bar & Category Filter Chips */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.services.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl text-sm transition-all shadow-xs"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/90'
              }`}
            >
              {CATEGORY_MAP[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.service_id}
              service={service}
              currentLanguage={currentLanguage}
              onSelect={onSelectService}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title={t.services.noServicesFound}
          description="Try searching with different keywords like 'Student', 'Income', 'Subsidy', or reset the category filter."
          action={{
            label: t.services.allCategories,
            onClick: () => {
              setSelectedCategory('All');
              setSearchQuery('');
            },
          }}
        />
      )}
    </div>
  );
};

export default ExploreServicesView;
