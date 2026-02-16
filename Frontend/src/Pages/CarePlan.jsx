import React from 'react';

const CarePlan = () => {
  const planItems = [
    { time: "08:00 AM", title: "Morning Medication", desc: "Take 1 pill of Vitamin D with breakfast.", status: "completed" },
    { time: "10:30 AM", title: "Hydration Break", desc: "Drink 1 glass of water.", status: "completed" },
    { time: "01:00 PM", title: "Lunch with Protein", desc: "Ensure your meal contains at least 20g of protein.", status: "pending" },
    { time: "06:00 PM", title: "Evening Walk", desc: "30 minutes brisk walking.", status: "pending" },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 py-4 px-3 sm:py-6 sm:px-4 md:py-8 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-800">Daily Care Plan</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">Your personalized health tasks for today.</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#1447E6] font-bold text-base sm:text-lg">
            50%
          </div>
        </div>

        <div className="space-y-4">
          {planItems.map((item, index) => (
             <div key={index} className={`relative pl-8 md:pl-0 flex md:gap-6 group ${item.status === 'completed' ? 'opacity-60' : ''}`}>
               {/* Mobile Timeline Line */}
               <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200 md:hidden"></div>
               
               {/* Time (Hidden on small mobile, shown on md) */}
               <div className="hidden md:block w-24 text-right pt-6">
                 <span className="text-sm font-semibold text-gray-500">{item.time}</span>
               </div>

               {/* Card */}
               <div className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative">
                 {/* Mobile Time Badge */}
                 <div className="md:hidden absolute -left-10 top-6 w-5 h-5 rounded-full bg-white border-4 border-blue-500 z-10"></div>
                 <span className="md:hidden text-xs font-bold text-gray-400 mb-2 block">{item.time}</span>

                 <div className="flex items-start justify-between">
                   <div>
                     <h3 className={`font-bold text-lg ${item.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>{item.title}</h3>
                     <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                   </div>
                   <button className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                     item.status === 'completed' 
                       ? 'bg-green-500 border-green-500 text-white' 
                       : 'border-gray-300 text-gray-300 hover:border-[#1447E6] hover:text-[#1447E6]'
                   }`}>
                     <i className="ri-check-line font-bold"></i>
                   </button>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CarePlan