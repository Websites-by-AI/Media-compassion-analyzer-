import React from 'react';
import { useLanguage } from '../types';

const SampleReportsPage: React.FC = () => {
    const { t } = useLanguage();
    const headers: { [key: string]: string } = t('caseStudiesPage.table.header');
    const reports: { [key: string]: string }[] = t('caseStudiesPage.table.body');

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {t('caseStudiesPage.title')}
                </h1>
                <p className="mt-4 text-lg text-gray-300">{t('caseStudiesPage.subtitle')}</p>
            </div>

            <div className="mt-16 max-w-6xl mx-auto">
                <div className="overflow-x-auto bg-gray-800/50 border border-white/10 rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-800">
                            <tr>
                                {Object.values(headers).map((header, index) => (
                                    <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {reports.map((report, projIndex) => (
                                <tr key={projIndex} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-white">{report.name}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-300 max-w-md">{report.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.type.includes('Briefing') || report.type.includes('خلاصه') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {report.type}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-300">{report.topics}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SampleReportsPage;