// // src/pages/user/RepairStatus.js
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaTools, FaPlus } from 'react-icons/fa';

// export default function RepairStatus() {
//   const [repairs, setRepairs] = useState([]);
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem('user'));

//   useEffect(() => {
//     if (!user) return;

//     const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];
//     const userRepairs = allRepairs.filter((r) => r.user === user.email);
//     setRepairs(userRepairs);
//   }, [user]);

//   const getProgress = (status) => {
//     switch (status) {
//       case 'pending': return 33;
//       case 'processing': return 66;
//       case 'completed': return 100;
//       default: return 0;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-500';
//       case 'processing': return 'bg-blue-500';
//       case 'completed': return 'bg-green-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case 'pending': return 'Pending Assignment';
//       case 'processing': return 'In Progress';
//       case 'completed': return 'Completed';
//       default: return 'Status Unknown';
//     }
//   };

//   const handleCancelRepair = (id) => {
//     const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];
//     const updated = allRepairs.filter(r => r.id !== id);
//     localStorage.setItem('repairs', JSON.stringify(updated));
//     setRepairs(repairs.filter(r => r.id !== id));
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1e2f] via-[#2e2e4f] to-black text-white px-4">
//         <p className="text-center text-lg text-red-300">🔐 Please log in to view your repairs.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold flex items-center gap-3">
//           <FaTools className="text-blue-400" />
//           My Repair Requests
//         </h1>
//         <button
//           onClick={() => navigate('/user/new-repair')}
//           className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center gap-2 text-sm"
//         >
//           <FaPlus />
//           New Request
//         </button>
//       </div>
      
//       {repairs.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-10">
//           <div className="bg-gray-700/50 p-8 rounded-full mb-6">
//             <FaTools className="text-4xl text-gray-400" />
//           </div>
//           <h3 className="text-xl font-bold mb-3">No Repair Requests</h3>
//           <p className="text-gray-400 mb-6 max-w-md text-center">
//             You haven't submitted any repair requests yet. Start by creating a new request.
//           </p>
//           <button
//             onClick={() => navigate('/user/new-repair')}
//             className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium hover:from-blue-500 hover:to-cyan-500"
//           >
//             Create New Repair Request
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {repairs.map((r) => (
//             <div
//               key={r.id}
//               className="bg-gray-700/30 rounded-xl p-5 border border-gray-600 hover:border-blue-500 transition-colors"
//             >
//               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
//                 <div className="flex-1">
//                   <div className="flex justify-between items-start mb-2">
//                     <h3 className="text-lg font-semibold">{r.device}</h3>
//                     <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(r.status)}`}>
//                       {getStatusText(r.status)}
//                     </span>
//                   </div>
                  
//                   <p className="text-gray-300 mb-4">{r.issue}</p>
                  
//                   <div className="flex flex-wrap gap-4 text-sm">
//                     <div>
//                       <p className="text-gray-400">Technician</p>
//                       <p className={r.assignedTo ? 'text-green-400' : 'text-yellow-400'}>
//                         {r.assignedTo || 'Not assigned'}
//                       </p>
//                     </div>
                    
//                     <div>
//                       <p className="text-gray-400">Submitted</p>
//                       <p>{new Date(r.createdAt).toLocaleDateString()}</p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="w-full sm:w-48">
//                   <div className="flex justify-between text-xs text-gray-400 mb-1">
//                     <span>Pending</span>
//                     <span>Processing</span>
//                     <span>Completed</span>
//                   </div>
//                   <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
//                     <div
//                       className={`h-full transition-all duration-500 rounded-full ${getStatusColor(r.status)}`}
//                       style={{ width: `${getProgress(r.status)}%` }}
//                     />
//                   </div>
//                   <div className="flex justify-between mt-4">
//                     <button
//                       onClick={() => handleCancelRepair(r.id)}
//                       className="text-xs px-3 py-1 bg-red-600/30 hover:bg-red-600/40 rounded-lg"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }