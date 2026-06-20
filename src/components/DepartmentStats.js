import React, { useState } from 'react';
import { UserCircle, ArrowLeft } from 'lucide-react';

const DepartmentStats = ({ plant, department, goBack }) => {
  const [selectedOperator, setSelectedOperator] = useState(null);

  const userStats = [
    { 
      id: 1, operator: 'Rahul Sharma', filled: 45, approved: 40, pending: 5, head: 'Amit (Head)',
      reportsList: [
        { id: 'R-101', name: 'Daily 5S Check Sheet', date: '20-Jun-2026', status: 'Approved' },
        { id: 'R-102', name: 'Machine Breakdown Summary', date: '20-Jun-2026', status: 'Pending' },
        { id: 'R-103', name: 'Poka-Yoke Report', date: '19-Jun-2026', status: 'Approved' },
        { id: 'R-104', name: 'Safety Audit', date: '18-Jun-2026', status: 'Approved' }
      ]
    },
    { 
      id: 2, operator: 'Vikash Patel', filled: 32, approved: 30, pending: 2, head: 'Amit (Head)',
      reportsList: [
        { id: 'R-105', name: 'Daily 5S Check Sheet', date: '20-Jun-2026', status: 'Approved' },
        { id: 'R-106', name: 'Quality Inspection', date: '19-Jun-2026', status: 'Approved' }
      ]
    },
    { 
      id: 3, operator: 'Suresh Kumar', filled: 50, approved: 25, pending: 25, head: 'Amit (Head)',
      reportsList: [
        { id: 'R-107', name: 'Machine Breakdown Summary', date: '20-Jun-2026', status: 'Pending' },
        { id: 'R-108', name: 'Poka-Yoke Report', date: '20-Jun-2026', status: 'Pending' },
        { id: 'R-109', name: 'Daily 5S Check Sheet', date: '19-Jun-2026', status: 'Approved' }
      ]
    }
  ];

  // ==========================
  // VIEW: Detailed Report Table
  // ==========================
  if (selectedOperator) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Strictly Top-Left Header */}
        <div className="w-full p-6 md:p-8 flex items-center gap-3 text-emerald-700">
          <ArrowLeft className="w-6 h-6 cursor-pointer hover:text-emerald-500 transition-colors" onClick={() => setSelectedOperator(null)} />
          <h2 className="text-2xl font-bold">{plant} / {department} / Reports</h2>
        </div>

        <div className="w-full max-w-[1000px] mx-auto px-6 pb-20">
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-wrap justify-between items-center mb-8 shadow-sm">
            <div className="flex items-center gap-4">
              <UserCircle className="w-16 h-16 text-indigo-500 bg-indigo-50 rounded-full" />
              <div>
                <h3 className="font-bold text-2xl text-gray-900">{selectedOperator.operator}</h3>
                <p className="text-sm text-gray-500 mt-1">Approved By: {selectedOperator.head}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8 text-center px-4 mt-4 md:mt-0">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total</p>
                <p className="font-bold text-2xl text-blue-600">{selectedOperator.filled}</p>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Approved</p>
                <p className="font-bold text-2xl text-green-600">{selectedOperator.approved}</p>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Pending</p>
                <p className="font-bold text-2xl text-orange-500">{selectedOperator.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-sm uppercase tracking-wider text-gray-500">
                  <th className="p-5 font-bold">Report ID</th>
                  <th className="p-5 font-bold">Report Name</th>
                  <th className="p-5 font-bold">Date Filled</th>
                  <th className="p-5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedOperator.reportsList.map((report, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 text-sm text-gray-500 font-medium">{report.id}</td>
                    <td className="p-5 text-sm font-bold text-gray-800">{report.name}</td>
                    <td className="p-5 text-sm text-gray-500">{report.date}</td>
                    <td className="p-5 text-sm">
                      {report.status === 'Approved' ? (
                        <span className="text-green-600 font-bold">✔ Approved</span>
                      ) : (
                        <span className="text-orange-500 font-bold">⏳ Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ==========================
  // VIEW: Operator Cards
  // ==========================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Strictly Top-Left Header */}
      <div className="w-full p-6 md:p-8 flex items-center gap-3 text-emerald-700">
        <ArrowLeft className="w-6 h-6 cursor-pointer hover:text-emerald-500 transition-colors" onClick={goBack} />
        <h2 className="text-2xl font-bold">{plant} / {department} / Analytics</h2>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 pb-24">
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-[1400px]">
          {userStats.map((stat) => (
            <div 
              key={stat.id} 
              onClick={() => setSelectedOperator(stat)}
              className="bg-white p-8 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all w-full md:w-[400px]"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-indigo-50 text-indigo-500">
                <UserCircle className="w-10 h-10" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-6">{stat.operator}</h3>
              
              <div className="w-full border border-gray-200 rounded-lg flex mb-4 py-3">
                <div className="flex-1 flex flex-col border-r border-gray-200">
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total</span>
                  <span className="text-lg font-bold text-blue-600">{stat.filled}</span>
                </div>
                <div className="flex-1 flex flex-col border-r border-gray-200">
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Approved</span>
                  <span className="text-lg font-bold text-green-500">{stat.approved}</span>
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Pending</span>
                  <span className="text-lg font-bold text-orange-500">{stat.pending}</span>
                </div>
              </div>
              
              <div className="w-full border border-gray-200 text-gray-500 text-sm py-3 px-4 rounded-lg font-medium">
                Approved By: {stat.head}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentStats;