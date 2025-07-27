// // src/pages/user/NewRepairRequest.js
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaTools, FaBell } from 'react-icons/fa';

// export default function NewRepairRequest() {
//   const [device, setDevice] = useState('');
//   const [issue, setIssue] = useState('');
//   const [existingRequest, setExistingRequest] = useState(null);
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem('user'));

//   useEffect(() => {
//     if (!user) return;
    
//     const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];
//     const userPending = allRepairs.find(
//       (r) => r.user === user.email && r.status === 'pending'
//     );
//     if (userPending) setExistingRequest(userPending);
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

//   const handleSubmitRepair = (e) => {
//     e.preventDefault();

//     if (!user) return;

//     const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];
//     const allUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

//     const technicians = allUsers.filter(
//       (u) => u.role === 'employee' && u.category?.toLowerCase() === 'repair technician'
//     );

//     const assignedTo = technicians.length > 0
//       ? technicians[Math.floor(Math.random() * technicians.length)].email
//       : null;

//     const newRepair = {
//       id: Date.now(),
//       user: user.email,
//       username: user.username,
//       device,
//       issue,
//       assignedTo,
//       status: 'pending',
//       createdAt: new Date().toISOString()
//     };

//     localStorage.setItem('repairs', JSON.stringify([...allRepairs, newRepair]));
//     setDevice('');
//     setIssue('');
//     setExistingRequest(newRepair);
//     navigate('/user/repair-status');
//   };

//   const handleCancelRepair = (id) => {
//     const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];
//     const updated = allRepairs.filter(r => r.id !== id);
//     localStorage.setItem('repairs', JSON.stringify(updated));
//     setExistingRequest(null);
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1e2f] via-[#2e2e4f] to-black text-white px-4">
//         <p className="text-center text-lg text-red-300">🔐 Please log in to book a repair.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6">
//       <div className="max-w-2xl mx-auto">
//         <h1 className="text-2xl font-bold mb-8 flex items-center gap-3">
//           <FaTools className="text-blue-400" />
//           {existingRequest ? 'Existing Repair Request' : 'Create New Repair Request'}
//         </h1>
        
//         {existingRequest ? (
//           <div className="space-y-6">
//             <div className="bg-gray-700/30 rounded-lg p-5 border border-gray-600">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="font-semibold text-lg">{existingRequest.device}</h3>
//                   <p className="text-gray-300">{existingRequest.issue}</p>
//                 </div>
//                 <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(existingRequest.status)}`}>
//                   {getStatusText(existingRequest.status)}
//                 </span>
//               </div>
              
//               <div className="flex flex-wrap gap-6 mt-4">
//                 <div>
//                   <p className="text-gray-400 text-sm">Technician</p>
//                   <p className={existingRequest.assignedTo ? 'text-green-400' : 'text-yellow-400'}>
//                     {existingRequest.assignedTo || 'Not yet assigned'}
//                   </p>
//                 </div>
                
//                 <div>
//                   <p className="text-gray-400 text-sm">Submitted</p>
//                   <p>{new Date(existingRequest.createdAt).toLocaleDateString()}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
//               <div
//                 className={`h-full rounded-full ${getStatusColor(existingRequest.status)}`}
//                 style={{ width: `${getProgress(existingRequest.status)}%` }}
//               />
//             </div>
            
//             <div className="flex justify-between gap-4">
//               <button
//                 onClick={() => handleCancelRepair(existingRequest.id)}
//                 className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium flex-1"
//               >
//                 Cancel Request
//               </button>
//               <button
//                 onClick={() => navigate('/user/repair-status')}
//                 className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex-1"
//               >
//                 View All Repairs
//               </button>
//             </div>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmitRepair} className="space-y-6">
//             <div>
//               <label className="block text-gray-400 mb-2">Device Information</label>
//               <input
//                 type="text"
//                 placeholder="Device name, model, etc."
//                 value={device}
//                 onChange={(e) => setDevice(e.target.value)}
//                 className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
//                 required
//               />
//             </div>
            
//             <div>
//               <label className="block text-gray-400 mb-2">Issue Description</label>
//               <textarea
//                 placeholder="Describe the problem in detail..."
//                 value={issue}
//                 onChange={(e) => setIssue(e.target.value)}
//                 rows={4}
//                 className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
//                 required
//               />
//             </div>
            
//             <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
//               <h3 className="font-semibold mb-3 flex items-center gap-2">
//                 <FaBell className="text-yellow-400" />
//                 What to expect next
//               </h3>
//               <ul className="space-y-2 text-sm text-gray-300">
//                 <li className="flex items-start gap-2">
//                   <span className="text-green-400">✓</span>
//                   <span>We'll assign a technician within 24 hours</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-green-400">✓</span>
//                   <span>You'll receive updates via email and in your dashboard</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-green-400">✓</span>
//                   <span>Repair completion typically takes 3-5 business days</span>
//                 </li>
//               </ul>
//             </div>
            
//             <button
//               type="submit"
//               className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-bold hover:from-blue-500 hover:to-cyan-500 transition-all"
//             >
//               Submit Repair Request
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }