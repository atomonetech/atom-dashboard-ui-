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
