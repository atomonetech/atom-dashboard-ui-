// import { useState } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { User, Mail, Phone, MapPin, Edit, Save, Camera, Check } from 'lucide-react';
// import Sidebar from './Sidebar';
// import { Card } from './ui/card';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import exampleAvatar from 'figma:asset/b9968cb9aa0208e0de8a3fb46726501d6c05a921.png';

// export default function Profile() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedAvatar, setSelectedAvatar] = useState(0);
//   const [showAvatarPicker, setShowAvatarPicker] = useState(false);
//   const [profileData, setProfileData] = useState({
//     name: 'Admin User',
//     email: 'admin@atomone.in',
//     phone: '+91 98765 43210',
//     location: 'Mumbai, India',
//     role: 'Plant Manager',
//     department: 'Operations'
//   });

//   // 5 unique cartoon avatars with different styles
//   const avatars = [
//     {
//       id: 0,
//       image: exampleAvatar,
//       name: 'Boy 1',
//       gradient: 'from-cyan-500 to-blue-600'
//     },
//     {
//       id: 1,
//       emoji: '👨‍💼',
//       name: 'Professional',
//       gradient: 'from-purple-500 to-pink-600',
//       bgColor: 'bg-gradient-to-br from-purple-500 to-pink-600'
//     },
//     {
//       id: 2,
//       emoji: '👩‍🔧',
//       name: 'Engineer',
//       gradient: 'from-orange-500 to-red-600',
//       bgColor: 'bg-gradient-to-br from-orange-500 to-red-600'
//     },
//     {
//       id: 3,
//       emoji: '👨‍🏭',
//       name: 'Worker',
//       gradient: 'from-green-500 to-teal-600',
//       bgColor: 'bg-gradient-to-br from-green-500 to-teal-600'
//     },
//     {
//       id: 4,
//       emoji: '👩‍💻',
//       name: 'Tech Lead',
//       gradient: 'from-yellow-500 to-amber-600',
//       bgColor: 'bg-gradient-to-br from-yellow-500 to-amber-600'
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-[#0f172a] flex relative overflow-hidden">
//       {/* Ultra Advanced Background Effects */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         {/* Animated Gradient Mesh */}
//         <motion.div
//           className="absolute inset-0"
//           animate={{
//             background: [
//               'radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
//               'radial-gradient(circle at 80% 70%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)',
//               'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
//             ],
//           }}
//           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
//         />

//         {/* Floating Particles */}
//         {[...Array(20)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-2 h-2 rounded-full"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               background: i % 2 === 0 ? '#06b6d4' : '#fbbf24',
//             }}
//             animate={{
//               y: [0, -100, 0],
//               x: [0, Math.random() * 50 - 25, 0],
//               opacity: [0, 1, 0],
//               scale: [0, 1, 0],
//             }}
//             transition={{
//               duration: Math.random() * 5 + 3,
//               repeat: Infinity,
//               delay: Math.random() * 3,
//             }}
//           />
//         ))}

//         {/* Grid Pattern */}
//         <div className="absolute inset-0 opacity-[0.02]" style={{
//           backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)`,
//           backgroundSize: '50px 50px'
//         }} />
//       </div>

//       <Sidebar />

//       <div className="flex-1 overflow-auto relative z-10">
//         <div className="max-w-[1200px] mx-auto px-8 py-8">
//           {/* Header */}
//           <div className="mb-8">
//             <motion.h1 
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-2 bg-gradient-to-r from-cyan-400 via-white to-yellow-400 bg-clip-text text-transparent relative inline-block"
//             >
//               My Profile
//               <motion.div
//                 className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-cyan-500 to-yellow-500 rounded-full"
//                 initial={{ width: 0 }}
//                 animate={{ width: '100%' }}
//                 transition={{ delay: 0.3, duration: 0.8 }}
//               />
//             </motion.h1>
//             <motion.p 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className="text-slate-400"
//             >
//               Manage your account settings and preferences
//             </motion.p>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-8">
//             {/* Left Column - Avatar & Quick Info */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//               className="lg:col-span-1"
//             >
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border-cyan-500/30 p-8 sticky top-8">
//                 {/* Avatar Section */}
//                 <div className="relative mb-6">
//                   <motion.div 
//                     className="relative mx-auto w-48 h-48"
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                   >
//                     {/* Animated Ring */}
//                     <motion.div
//                       className={`absolute -inset-4 bg-gradient-to-br ${avatars[selectedAvatar].gradient} rounded-full blur-2xl opacity-60`}
//                       animate={{
//                         scale: [1, 1.2, 1],
//                         rotate: [0, 360],
//                       }}
//                       transition={{
//                         duration: 8,
//                         repeat: Infinity,
//                         ease: "linear",
//                       }}
//                     />

//                     {/* Avatar Display */}
//                     <div className={`relative w-48 h-48 rounded-full overflow-hidden border-4 border-cyan-500/50 shadow-2xl ${
//                       avatars[selectedAvatar].image ? '' : avatars[selectedAvatar].bgColor
//                     } flex items-center justify-center`}>
//                       {avatars[selectedAvatar].image ? (
//                         <img 
//                           src={avatars[selectedAvatar].image} 
//                           alt="Avatar" 
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <span className="text-8xl">{avatars[selectedAvatar].emoji}</span>
//                       )}
//                     </div>

//                     {/* Camera Button */}
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => setShowAvatarPicker(!showAvatarPicker)}
//                       className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center shadow-xl border-4 border-[#1e293b] hover:from-cyan-400 hover:to-cyan-500 transition-all"
//                     >
//                       <Camera className="w-5 h-5 text-white" />
//                     </motion.button>
//                   </motion.div>

//                   {/* Avatar Picker Modal */}
//                   <AnimatePresence>
//                     {showAvatarPicker && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 20, scale: 0.8 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: 20, scale: 0.8 }}
//                         className="mt-6 p-4 rounded-2xl bg-[#0f172a]/95 backdrop-blur-xl border border-cyan-500/30"
//                       >
//                         <p className="text-cyan-400 text-sm mb-4 text-center font-medium">Choose Your Avatar</p>
//                         <div className="grid grid-cols-5 gap-3">
//                           {avatars.map((avatar) => (
//                             <motion.button
//                               key={avatar.id}
//                               whileHover={{ scale: 1.15, y: -5 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => {
//                                 setSelectedAvatar(avatar.id);
//                                 setShowAvatarPicker(false);
//                               }}
//                               className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${
//                                 selectedAvatar === avatar.id
//                                   ? 'border-cyan-400 shadow-lg shadow-cyan-500/50'
//                                   : 'border-slate-700 hover:border-cyan-500/50'
//                               } ${avatar.image ? '' : avatar.bgColor} flex items-center justify-center`}
//                             >
//                               {avatar.image ? (
//                                 <img 
//                                   src={avatar.image} 
//                                   alt={avatar.name} 
//                                   className="w-full h-full object-cover"
//                                 />
//                               ) : (
//                                 <span className="text-2xl">{avatar.emoji}</span>
//                               )}
//                               {selectedAvatar === avatar.id && (
//                                 <motion.div
//                                   initial={{ scale: 0 }}
//                                   animate={{ scale: 1 }}
//                                   className="absolute inset-0 bg-cyan-500/30 backdrop-blur-sm flex items-center justify-center"
//                                 >
//                                   <Check className="w-6 h-6 text-white" strokeWidth={3} />
//                                 </motion.div>
//                               )}
//                             </motion.button>
//                           ))}
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 {/* Name & Role */}
//                 <div className="text-center mb-6">
//                   <h2 className="text-slate-100 mb-2">{profileData.name}</h2>
//                   <p className="text-cyan-400 text-sm mb-1">{profileData.role}</p>
//                   <p className="text-slate-500 text-sm">{profileData.department}</p>
//                 </div>

//                 {/* Quick Stats */}
//                 <div className="grid grid-cols-2 gap-4 mb-6">
//                   <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center">
//                     <p className="text-cyan-400 font-mono mb-1">156</p>
//                     <p className="text-slate-400 text-xs">Tasks Done</p>
//                   </div>
//                   <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-center">
//                     <p className="text-yellow-400 font-mono mb-1">98.5%</p>
//                     <p className="text-slate-400 text-xs">Efficiency</p>
//                   </div>
//                 </div>

//                 {/* Edit Button */}
//                 <Button
//                   onClick={() => setIsEditing(!isEditing)}
//                   className={`w-full ${
//                     isEditing
//                       ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
//                       : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700'
//                   } text-white`}
//                 >
//                   {isEditing ? (
//                     <>
//                       <Save className="w-4 h-4 mr-2" />
//                       Save Changes
//                     </>
//                   ) : (
//                     <>
//                       <Edit className="w-4 h-4 mr-2" />
//                       Edit Profile
//                     </>
//                   )}
//                 </Button>
//               </Card>
//             </motion.div>

//             {/* Right Column - Details */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.4 }}
//               className="lg:col-span-2 space-y-6"
//             >
//               {/* Personal Information */}
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border-cyan-500/30 p-8">
//                 <div className="flex items-center gap-3 mb-6">
//                   <motion.div
//                     whileHover={{ rotate: 360 }}
//                     transition={{ duration: 0.6 }}
//                     className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center"
//                   >
//                     <User className="w-6 h-6 text-cyan-400" />
//                   </motion.div>
//                   <h2 className="text-cyan-400">Personal Information</h2>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div>
//                     <Label className="text-slate-300 mb-2 block">Full Name</Label>
//                     <div className="relative group">
//                       <motion.div
//                         className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity"
//                         animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
//                         transition={{ duration: 3, repeat: Infinity }}
//                       />
//                       <Input 
//                         value={profileData.name}
//                         disabled={!isEditing}
//                         className="relative bg-[#0f172a]/80 border-slate-700 text-slate-200 disabled:opacity-100"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <Label className="text-slate-300 mb-2 block">Email Address</Label>
//                     <div className="relative group">
//                       <motion.div
//                         className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity"
//                         animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
//                         transition={{ duration: 3, repeat: Infinity }}
//                       />
//                       <Input 
//                         value={profileData.email}
//                         disabled={!isEditing}
//                         className="relative bg-[#0f172a]/80 border-slate-700 text-slate-200 disabled:opacity-100"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <Label className="text-slate-300 mb-2 block">Phone Number</Label>
//                     <div className="relative group">
//                       <motion.div
//                         className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity"
//                         animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
//                         transition={{ duration: 3, repeat: Infinity }}
//                       />
//                       <Input 
//                         value={profileData.phone}
//                         disabled={!isEditing}
//                         className="relative bg-[#0f172a]/80 border-slate-700 text-slate-200 disabled:opacity-100"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <Label className="text-slate-300 mb-2 block">Location</Label>
//                     <div className="relative group">
//                       <motion.div
//                         className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity"
//                         animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
//                         transition={{ duration: 3, repeat: Infinity }}
//                       />
//                       <Input 
//                         value={profileData.location}
//                         disabled={!isEditing}
//                         className="relative bg-[#0f172a]/80 border-slate-700 text-slate-200 disabled:opacity-100"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </Card>

//               {/* Activity Timeline */}
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border-yellow-500/30 p-8">
//                 <div className="flex items-center gap-3 mb-6">
//                   <motion.div
//                     animate={{ rotate: [0, 360] }}
//                     transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//                     className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center"
//                   >
//                     <Mail className="w-6 h-6 text-yellow-400" />
//                   </motion.div>
//                   <h2 className="text-yellow-400">Recent Activity</h2>
//                 </div>

//                 <div className="space-y-4">
//                   {[
//                     { action: 'Logged in to dashboard', time: '2 hours ago', color: 'cyan' },
//                     { action: 'Updated machine M-15 settings', time: '5 hours ago', color: 'green' },
//                     { action: 'Generated analytics report', time: '1 day ago', color: 'yellow' },
//                     { action: 'Assigned operators to Plant 2', time: '2 days ago', color: 'purple' },
//                   ].map((activity, index) => (
//                     <motion.div
//                       key={index}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.5 + index * 0.1 }}
//                       className="flex items-center gap-4 p-4 rounded-xl bg-[#0f172a]/50 border border-slate-700/30 hover:border-cyan-500/30 transition-all group"
//                     >
//                       <motion.div
//                         className={`w-3 h-3 rounded-full bg-${activity.color}-400 shadow-lg shadow-${activity.color}-500/50`}
//                         animate={{ scale: [1, 1.3, 1] }}
//                         transition={{ duration: 2, repeat: Infinity }}
//                       />
//                       <div className="flex-1">
//                         <p className="text-slate-200 text-sm group-hover:text-cyan-400 transition-colors">{activity.action}</p>
//                         <p className="text-slate-500 text-xs mt-1">{activity.time}</p>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </Card>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// src/components/Profile.jsx
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Edit, Save, Camera, Check, Upload, X } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Profile({ onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [customImage, setCustomImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@atomone.in',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    role: 'Plant Manager',
    department: 'Operations'
  });

  const avatars = [
    {
      id: 0,
      type: 'emoji',
      emoji: '👨‍💼',
      name: 'Professional',
      bgColor: 'bg-gradient-to-br from-teal-500 to-blue-600'
    },
    {
      id: 1,
      type: 'emoji',
      emoji: '👩‍💼',
      name: 'Manager',
      bgColor: 'bg-gradient-to-br from-purple-500 to-pink-600'
    },
    {
      id: 2,
      type: 'emoji',
      emoji: '👩‍🔧',
      name: 'Engineer',
      bgColor: 'bg-gradient-to-br from-orange-500 to-red-600'
    },
    {
      id: 3,
      type: 'emoji',
      emoji: '👨‍🏭',
      name: 'Worker',
      bgColor: 'bg-gradient-to-br from-green-500 to-teal-600'
    },
    {
      id: 4,
      type: 'emoji',
      emoji: '👩‍💻',
      name: 'Tech Lead',
      bgColor: 'bg-gradient-to-br from-yellow-500 to-amber-600'
    },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result);
        setSelectedAvatar(-1);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Saving profile:', profileData);
  };

  const getCurrentAvatar = () => {
    if (selectedAvatar === -1 && customImage) {
      return { type: 'custom', image: customImage };
    }
    return avatars[selectedAvatar];
  };

  const currentAvatar = getCurrentAvatar();

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 70%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? '#14b8a6' : '#fbbf24',
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(20, 184, 166, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <Sidebar onLogout={onLogout} />

      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">My Profile</h1>
            <p className="text-slate-400 text-sm">Manage your account settings and preferences</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Admin User Box */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              {/* ✅ DARK NAVY BLUE BORDER */}
              <div 
                className="bg-[#1e293b] rounded-3xl p-8 sticky top-8"
                style={{ border: '2px solid #1e3a52' }}
              >
                <div className="relative mb-6">
                  <motion.div 
                    className="relative mx-auto w-48 h-48"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="absolute -inset-4 rounded-full blur-2xl opacity-60"
                      style={{ background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3), rgba(59, 130, 246, 0.3))' }}
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    {/* ✅ DARK NAVY BLUE BORDER */}
                    <div 
                      className="relative w-48 h-48 rounded-full overflow-hidden shadow-2xl"
                      style={{ 
                        border: '4px solid #1e3a52',
                        boxShadow: '0 25px 50px -12px rgba(30, 58, 82, 0.5)'
                      }}
                    >
                      <div className={`w-full h-full ${
                        currentAvatar.type === 'custom' ? 'bg-slate-800' : currentAvatar.bgColor
                      } flex items-center justify-center`}>
                        {currentAvatar.type === 'custom' ? (
                          <img 
                            src={currentAvatar.image} 
                            alt="Custom Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-8xl">{currentAvatar.emoji}</span>
                        )}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                      className="absolute bottom-2 right-2 w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-4"
                      style={{ 
                        backgroundColor: '#14b8a6',
                        borderColor: '#1e293b'
                      }}
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </motion.button>
                  </motion.div>

                  <AnimatePresence>
                    {showAvatarPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className="mt-6 p-4 rounded-2xl bg-[#0f172a]"
                        style={{ border: '2px solid #1e3a52' }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-medium" style={{ color: '#14b8a6' }}>Choose Avatar</p>
                          <button
                            onClick={() => setShowAvatarPicker(false)}
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full mb-4 p-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#14b8a6' }}
                        >
                          <Upload className="w-4 h-4" />
                          Upload Your Photo
                        </motion.button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />

                        <div className="pt-4" style={{ borderTop: '1px solid #1e3a52' }}>
                          <p className="text-slate-400 text-xs mb-3">Or choose preset:</p>
                          <div className="grid grid-cols-5 gap-3">
                            {avatars.map((avatar) => (
                              <motion.button
                                key={avatar.id}
                                whileHover={{ scale: 1.15, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setSelectedAvatar(avatar.id);
                                  setCustomImage(null);
                                  setShowAvatarPicker(false);
                                }}
                                className={`relative w-14 h-14 rounded-full overflow-hidden ${avatar.bgColor} flex items-center justify-center`}
                                style={{ 
                                  border: selectedAvatar === avatar.id && !customImage
                                    ? '2px solid #1e3a52'
                                    : '2px solid rgba(30, 58, 82, 0.5)',
                                  boxShadow: selectedAvatar === avatar.id && !customImage
                                    ? '0 10px 15px -3px rgba(30, 58, 82, 0.5)'
                                    : 'none'
                                }}
                              >
                                <span className="text-2xl">{avatar.emoji}</span>
                                {selectedAvatar === avatar.id && !customImage && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute inset-0 backdrop-blur-sm flex items-center justify-center"
                                    style={{ backgroundColor: 'rgba(20, 184, 166, 0.3)' }}
                                  >
                                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                                  </motion.div>
                                )}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{profileData.name}</h2>
                  <p className="text-sm mb-1" style={{ color: '#14b8a6' }}>{profileData.role}</p>
                  <p className="text-slate-400 text-sm">{profileData.department}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* ✅ DARK NAVY BLUE BORDER */}
                  <div 
                    className="p-4 rounded-xl bg-[#0f172a] text-center"
                    style={{ border: '2px solid #1e3a52' }}
                  >
                    <p className="text-3xl font-bold mb-1" style={{ color: '#14b8a6' }}>156</p>
                    <p className="text-slate-400 text-xs">Tasks Done</p>
                  </div>
                  <div 
                    className="p-4 rounded-xl bg-[#0f172a] text-center"
                    style={{ border: '2px solid #fbbf24' }}
                  >
                    <p className="text-3xl font-bold text-[#fbbf24] mb-1">98.5%</p>
                    <p className="text-slate-400 text-xs">Efficiency</p>
                  </div>
                </div>

                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    isEditing
                      ? 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30'
                      : 'shadow-lg'
                  }`}
                  style={{ 
                    backgroundColor: isEditing ? undefined : '#14b8a6',
                    boxShadow: isEditing ? undefined : '0 10px 15px -3px rgba(20, 184, 166, 0.3)'
                  }}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Personal Information - ✅ DARK NAVY BLUE BORDER */}
              <div 
                className="bg-[#1e293b] rounded-3xl p-8"
                style={{ border: '2px solid #1e3a52' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(20, 184, 166, 0.2)' }}
                  >
                    <User className="w-6 h-6" style={{ color: '#14b8a6' }} />
                  </motion.div>
                  <h2 className="text-xl font-bold" style={{ color: '#14b8a6' }}>Personal Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name', value: 'name', type: 'text' },
                    { label: 'Email Address', value: 'email', type: 'email' },
                    { label: 'Phone Number', value: 'phone', type: 'tel' },
                    { label: 'Location', value: 'location', type: 'text' }
                  ].map((field) => (
                    <div key={field.value}>
                      <label className="text-white text-sm mb-2 block font-medium">{field.label}</label>
                      <div className="relative group">
                        <motion.div
                          className="absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity"
                          style={{ background: 'linear-gradient(to right, #14b8a6, #3b82f6)' }}
                        />
                        {/* ✅ DARK NAVY BLUE BORDER */}
                        <input 
                          type={field.type}
                          value={profileData[field.value]}
                          onChange={(e) => setProfileData({...profileData, [field.value]: e.target.value})}
                          disabled={!isEditing}
                          className="relative w-full px-4 py-3 rounded-xl bg-[#0f172a] text-white disabled:opacity-70 focus:outline-none"
                          style={{ border: '1px solid #1e3a52' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity - ✅ YELLOW BORDER */}
              <div 
                className="bg-[#1e293b] rounded-3xl p-8"
                style={{ border: '2px solid #fbbf24' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-xl bg-[#fbbf24]/20 flex items-center justify-center"
                  >
                    <Mail className="w-6 h-6 text-[#fbbf24]" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-[#fbbf24]">Recent Activity</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { action: 'Logged in to dashboard', time: '2 hours ago' },
                    { action: 'Updated machine M-15 settings', time: '5 hours ago' },
                    { action: 'Generated analytics report', time: '1 day ago' },
                    { action: 'Assigned operators to Plant 2', time: '2 days ago' },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-[#0f172a] transition-all group cursor-pointer"
                      style={{ border: '1px solid #1e3a52' }}
                    >
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#14b8a6' }}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm group-hover:text-[#14b8a6] transition-colors">{activity.action}</p>
                        <p className="text-slate-400 text-xs mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
