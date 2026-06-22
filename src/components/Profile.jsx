// src/components/Profile.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Edit, Save, Camera, Check, Upload, X } from "lucide-react";
import Sidebar from "./Sidebar";

export default function Profile({ onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [customImage, setCustomImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const userRole = localStorage.getItem("user_role");
  const userName = localStorage.getItem("username");
  const authToken =
    localStorage.getItem("access_token") || localStorage.getItem("token");

  const cleanUserName = userName
    ? userName
        .split("@")[0]
        .replace(/\./g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "User";

  const [profileData, setProfileData] = useState({
    name: cleanUserName,
    email: userName || "",
    phone: "",
    location: "",
    role: userRole || "User",
    department: "",
    designation: "",
  });

  const API_URL = "http://192.168.0.34:8000/api/profile/me/";

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        localStorage.setItem("full_name", data.full_name || "");
        if (data.profile_image) {
          localStorage.setItem("profile_image", data.profile_image);
        }
        console.log("PROFILE FETCH DATA:", data);

        setProfileData((prev) => ({
          ...prev,
          name: data.full_name || data.username || prev.name,
          email: data.contact_email || data.email || prev.email,
          phone: data.mobile_no || "",
          location: data.location || "",
          role: data.role || data.user_role || prev.role,
          department: data.department || "",
          designation: data.designation || "",
        }));
        if (data.profile_image) {
          setCustomImage(data.profile_image);
          setSelectedAvatar(-1);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [authToken]);

  const avatars = [
    {
      id: 0,
      type: "emoji",
      emoji: "👨‍💼",
      name: "Professional",
      bgColor: "bg-gradient-to-br from-teal-500 to-blue-600",
    },
    {
      id: 1,
      type: "emoji",
      emoji: "👩‍💼",
      name: "Manager",
      bgColor: "bg-gradient-to-br from-purple-500 to-pink-600",
    },
    {
      id: 2,
      type: "emoji",
      emoji: "👩‍🔧",
      name: "Engineer",
      bgColor: "bg-gradient-to-br from-orange-500 to-red-600",
    },
    {
      id: 3,
      type: "emoji",
      emoji: "👨‍🏭",
      name: "Worker",
      bgColor: "bg-gradient-to-br from-green-500 to-teal-600",
    },
    {
      id: 4,
      type: "emoji",
      emoji: "👩‍💻",
      name: "Tech Lead",
      bgColor: "bg-gradient-to-br from-yellow-500 to-amber-600",
    },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setProfileImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result);
        setSelectedAvatar(-1);
      };

      reader.readAsDataURL(file);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      setCameraStream(stream);
      setShowCamera(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
  console.error("Camera error:", error);

  alert(
    `Camera Error:
${error.name}
${error.message}`
  );
}
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "profile-camera.jpg", {
        type: "image/jpeg",
      });

      setProfileImageFile(file);
      setCustomImage(URL.createObjectURL(file));
      setSelectedAvatar(-1);
      setShowCamera(false);

      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    }, "image/jpeg");
  };
  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("full_name", profileData.name);
      formData.append("contact_email", profileData.email);
      formData.append("mobile_no", profileData.phone);
      formData.append("location", profileData.location);
      formData.append("department", profileData.department);
      formData.append("designation", profileData.designation);

      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      }

      const response = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const updatedData = await response.json();

      setProfileData((prev) => ({
        ...prev,
        name: updatedData.full_name || prev.name,
        email: updatedData.contact_email || updatedData.email || prev.email,
        phone: updatedData.mobile_no || "",
        location: updatedData.location || "",
        role: updatedData.role || updatedData.user_role || prev.role,
        department: updatedData.department || "",
        designation: updatedData.designation || "",
      }));

      if (updatedData.profile_image) {
        setCustomImage(updatedData.profile_image);
        setSelectedAvatar(-1);
      }

      setProfileImageFile(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Profile save failed. Please check backend API.");
    }
  };

  const getCurrentAvatar = () => {
    if (selectedAvatar === -1 && customImage) {
      return { type: "custom", image: customImage };
    }

    return avatars[selectedAvatar];
  };

  const currentAvatar = getCurrentAvatar();

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 70%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
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
              background: i % 2 === 0 ? "#14b8a6" : "#fbbf24",
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

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(20, 184, 166, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.5) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <Sidebar onLogout={onLogout} />

      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">My Profile</h1>
            <p className="text-slate-400 text-sm">
              Manage your account settings and preferences
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14b8a6]"></div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div
                  className="bg-[#1e293b] rounded-3xl p-8 sticky top-8"
                  style={{ border: "2px solid #1e3a52" }}
                >
                  <div className="relative mb-6">
                    <motion.div
                      className="relative mx-auto w-48 h-48"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        className="absolute -inset-4 rounded-full blur-2xl opacity-60"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(20, 184, 166, 0.3), rgba(59, 130, 246, 0.3))",
                        }}
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

                      <div
                        className="relative w-48 h-48 rounded-full overflow-hidden shadow-2xl"
                        style={{
                          border: "4px solid #1e3a52",
                          boxShadow: "0 25px 50px -12px rgba(30, 58, 82, 0.5)",
                        }}
                      >
                        <div
                          className={`w-full h-full ${
                            currentAvatar.type === "custom"
                              ? "bg-slate-800"
                              : currentAvatar.bgColor
                          } flex items-center justify-center`}
                        >
                          {currentAvatar.type === "custom" ? (
                            <img
                              src={currentAvatar.image}
                              alt="Custom Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-8xl">
                              {currentAvatar.emoji}
                            </span>
                          )}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                        className="absolute bottom-2 right-2 w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-4"
                        style={{
                          backgroundColor: "#14b8a6",
                          borderColor: "#1e293b",
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
                          style={{ border: "2px solid #1e3a52" }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <p
                              className="text-sm font-medium"
                              style={{ color: "#14b8a6" }}
                            >
                              Choose Avatar
                            </p>

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
                            style={{ backgroundColor: "#14b8a6" }}
                          >
                            <Upload className="w-4 h-4" />
                            Upload Your Photo
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={openCamera}
                            className="w-full mb-4 p-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                            style={{ backgroundColor: "#1e3a52" }}
                          >
                            <Camera className="w-4 h-4" />
                            Open Camera
                          </motion.button>
                          {showCamera && (
                            <div className="mb-4 p-3 rounded-xl bg-[#020617]">
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full rounded-xl mb-3"
                              />

                              <canvas ref={canvasRef} className="hidden" />

                              <button
                                onClick={capturePhoto}
                                className="w-full p-3 rounded-xl text-white font-semibold"
                                style={{ backgroundColor: "#14b8a6" }}
                              >
                                Capture & Upload
                              </button>
                            </div>
                          )}
                          {profileImageFile && (
                            <button
                              onClick={handleSave}
                              className="w-full mb-4 p-3 rounded-xl text-white font-semibold"
                              style={{ backgroundColor: "#22c55e" }}
                            >
                              Upload Image
                            </button>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="user"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <div
                            className="pt-4"
                            style={{ borderTop: "1px solid #1e3a52" }}
                          >
                            <p className="text-slate-400 text-xs mb-3">
                              Or choose preset:
                            </p>

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
                                    border:
                                      selectedAvatar === avatar.id &&
                                      !customImage
                                        ? "2px solid #1e3a52"
                                        : "2px solid rgba(30, 58, 82, 0.5)",
                                    boxShadow:
                                      selectedAvatar === avatar.id &&
                                      !customImage
                                        ? "0 10px 15px -3px rgba(30, 58, 82, 0.5)"
                                        : "none",
                                  }}
                                >
                                  <span className="text-2xl">
                                    {avatar.emoji}
                                  </span>

                                  {selectedAvatar === avatar.id &&
                                    !customImage && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute inset-0 backdrop-blur-sm flex items-center justify-center"
                                        style={{
                                          backgroundColor:
                                            "rgba(20, 184, 166, 0.3)",
                                        }}
                                      >
                                        <Check
                                          className="w-6 h-6 text-white"
                                          strokeWidth={3}
                                        />
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
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {profileData.name}
                    </h2>

                    <p className="text-sm mb-1" style={{ color: "#14b8a6" }}>
                      {profileData.role}
                    </p>

                    <p className="text-slate-400 text-sm">
                      {profileData.department}
                    </p>

                    <p className="text-slate-400 text-sm">
                      {profileData.designation}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div
                      className="p-4 rounded-xl bg-[#0f172a] text-center"
                      style={{ border: "2px solid #1e3a52" }}
                    >
                      <p
                        className="text-3xl font-bold mb-1"
                        style={{ color: "#14b8a6" }}
                      >
                        0
                      </p>
                      <p className="text-slate-400 text-xs">Tasks Done</p>
                    </div>

                    <div
                      className="p-4 rounded-xl bg-[#0f172a] text-center"
                      style={{ border: "2px solid #fbbf24" }}
                    >
                      <p className="text-3xl font-bold text-[#fbbf24] mb-1">
                        0%
                      </p>
                      <p className="text-slate-400 text-xs">Efficiency</p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      isEditing ? handleSave() : setIsEditing(true)
                    }
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                      isEditing
                        ? "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30"
                        : "shadow-lg"
                    }`}
                    style={{
                      backgroundColor: isEditing ? undefined : "#14b8a6",
                      boxShadow: isEditing
                        ? undefined
                        : "0 10px 15px -3px rgba(20, 184, 166, 0.3)",
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

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 space-y-6"
              >
                <div
                  className="bg-[#1e293b] h-full rounded-3xl p-8"
                  style={{ border: "2px solid #1e3a52" }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: "rgba(20, 184, 166, 0.2)" }}
                    >
                      <User className="w-6 h-6" style={{ color: "#14b8a6" }} />
                    </motion.div>

                    <h2
                      className="text-xl font-bold"
                      style={{ color: "#14b8a6" }}
                    >
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { label: "Full Name", value: "name", type: "text" },
                      { label: "Email Address", value: "email", type: "email" },
                      { label: "Phone Number", value: "phone", type: "tel" },
                      { label: "Plant", value: "location", type: "text" },
                      {
                        label: "Department",
                        value: "department",
                        type: "text",
                      },
                      {
                        label: "Designation",
                        value: "designation",
                        type: "text",
                      },
                    ].map((field) => (
                      <div key={field.value}>
                        <label className="text-white text-sm mb-2 block font-medium">
                          {field.label}
                        </label>

                        <div className="relative group">
                          <motion.div
                            className="absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity"
                            style={{
                              background:
                                "linear-gradient(to right, #14b8a6, #3b82f6)",
                            }}
                          />

                          <input
                            type={field.type}
                            value={profileData[field.value] || ""}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                [field.value]: e.target.value,
                              })
                            }
                            disabled={!isEditing || field.value === "email"}
                            className="relative w-full px-4 py-3 rounded-xl bg-[#0f172a] text-white disabled:opacity-70 focus:outline-none"
                            style={{ border: "1px solid #1e3a52" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
