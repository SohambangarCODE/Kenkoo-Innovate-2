import React from 'react';

const Records = () => {
  const records = [
    { title: "Blood Test Results", date: "Feb 10, 2026", type: "Lab Report", icon: "ri-file-list-3-line" },
    { title: "Annual Physical", date: "Jan 15, 2026", type: "Checkup", icon: "ri-stethoscope-line" },
    { title: "Vaccination Record", date: "Dec 05, 2025", type: "Immunization", icon: "ri-syringe-line" },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 py-4 px-3 sm:py-6 sm:px-4 md:py-8 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-800">Health Records</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Access and manage your medical history.</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {records.map((record, index) => (
            <div key={index} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1447E6] flex items-center justify-center text-xl">
                  <i className={record.icon}></i>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{record.type}</span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">{record.title}</h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <i className="ri-calendar-line"></i> {record.date}
              </p>
              <button className="mt-4 w-full py-2.5 sm:py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                View Details
              </button>
            </div>
          ))}
          
          {/* Upload New Record Card */}
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:bg-blue-50/50 hover:border-blue-200 transition-colors cursor-pointer group h-full min-h-[160px] sm:min-h-[180px]">
            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-[#1447E6] group-hover:border-blue-200 mb-3 transition-colors">
              <i className="ri-add-line text-2xl"></i>
            </div>
            <h3 className="font-semibold text-gray-700 group-hover:text-[#1447E6]">Upload Record</h3>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, or PNG</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Records