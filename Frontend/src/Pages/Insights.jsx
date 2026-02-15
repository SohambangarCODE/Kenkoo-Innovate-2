import React from 'react';

const Insights = () => {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 py-6 px-4 md:py-8 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Health Insights</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">AI-powered analysis of your health data.</p>
        </div>

        {/* Featured Insight */}
        <div className="bg-gradient-to-r from-[#1447E6] to-[#3C53E8] rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold mb-4 border border-white/10">
              <i className="ri-sparkling-fill text-yellow-300"></i> Daily Tip
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Hydration matters!</h2>
            <p className="text-blue-100 max-w-xl text-sm md:text-base leading-relaxed">
              Based on your recent activity, try to increase your water intake by 500ml today to maintain optimal energy levels and focus.
            </p>
          </div>
        </div>

        {/* Trend Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className="ri-run-line text-green-500"></i> Activity Trend
            </h3>
            <div className="h-40 flex items-end justify-between gap-2 px-2">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="w-full bg-green-50 rounded-t-lg relative group">
                  <div 
                    className="absolute bottom-0 w-full bg-green-500 rounded-t-lg transition-all duration-500 group-hover:opacity-90"
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-3 font-medium uppercase">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className="ri-moon-line text-purple-500"></i> Sleep Quality
            </h3>
             <div className="flex items-center justify-center h-48">
                <div className="w-32 h-32 rounded-full border-8 border-gray-100 border-t-purple-500 flex flex-col items-center justify-center">
                   <span className="text-2xl font-bold text-gray-800">7.5h</span>
                   <span className="text-xs text-gray-400 uppercase">Avg</span>
                </div>
             </div>
             <p className="text-center text-sm text-gray-500">You're sleeping better than 70% of users.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Insights