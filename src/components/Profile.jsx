// src/components/Profile.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Edit, Save, Camera, Check, Upload, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { useUser } from "../../src/context/UserContext";

// =================================================================================
// THEME VARIABLES
// =================================================================================
const THEME_VARS = `
  /* LIGHT — Premium White & Blue (Strictly avoiding green/orange) */
  [data-theme="light"] {
    --bg-main: #f3f4f6;
    --bg-card: #ffffff;
    --bg-input: #f8fafc;
    --bg-modal: #ffffff;
    
    --text-main: #111827;
    --text-muted: #64748b;
    --text-label: #475569;
    
    --border-main: rgba(15, 23, 42, 0.08);
    --border-strong: rgba(15, 23, 42, 0.15);
    
    --accent-primary: #2563eb; /* Replaces Teal/Green */
    --accent-primary-hover: #1d4ed8;
    --accent-secondary: #4f46e5; /* Replaces Amber for distinction */
    --accent-tint: rgba(37, 99, 235, 0.1);
    
    --shadow-card: 0 10px 30px rgba(0, 0, 0, 0.04);
    --shadow-avatar: 0 25px 50px -12px rgba(37, 99, 235, 0.25);
    
    --glow-1: rgba(37, 99, 235, 0.2);
    --glow-2: rgba(79, 70, 229, 0.2);
    
    --pattern-color: rgba(37, 99, 235, 0.1);
    
    --btn-secondary-bg: #f1f5f9;
    --btn-secondary-text: #334155;
    
    --custom-avatar-bg: #e2e8f0;
  }

  /* DARK — Original AtomOne Palette (Untouched) */
  [data-theme="dark"] {
    --bg-main: #0f172a;
    --bg-card: #1e293b;
    --bg-input: #0f172a;
    --bg-modal: #0f172a;
    
    --text-main: #ffffff;
    --text-muted: #94a3b8;
    --text-label: #ffffff;
    
    --border-main: #1e3a52;
    --border-strong: rgba(30, 58, 82, 0.5);
    
    --accent-primary: #14b8a6; /* Original Teal */
    --accent-primary-hover: #0d9488;
    --accent-secondary: #fbbf24; /* Original Amber */
    --accent-tint: rgba(20, 184, 166, 0.2);
    
    --shadow-card: none;
    --shadow-avatar: 0 25px 50px -12px rgba(30, 58, 82, 0.5);
    
    --glow-1: rgba(20, 184, 166, 0.3);
    --glow-2: rgba(59, 130, 246, 0.3);
    
    --pattern-color: rgba(20, 184, 166, 0.5);
    
    --btn-secondary-bg: #1e3a52;
    --btn-secondary-text: #ffffff;
    
    --custom-avatar-bg: #1e293b;
  }
`;

export default function Profile({ onLogout }) {
  // Sync theme with global layout
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem("atomone-theme") || "light";
  });

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          setTheme(
            document.documentElement.getAttribute("data-theme") || "light",
          );
        }
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const handleStorage = () =>
      setTheme(window.localStorage.getItem("atomone-theme") || "light");
    window.addEventListener("storage", handleStorage);
    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

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

  const { setUser } = useUser();
  const API_URL = process.env.REACT_APP_API_URL + "/api/profile/me/" || "http://localhost:8000/api/profile/me/";
  // console.log("Auth Token:", authToken);

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
        // console.log("Profile API Response:", data);
        localStorage.setItem(
          "full_name",
          data.full_name || data.username || "",
        );

        localStorage.setItem("profile_image", data.profile_image || "");
        // console.log("PROFILE FETCH DATA:", data);

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
        setUser({
          fullName: data.full_name || data.username || "User",
          email: data.contact_email || data.email || data.username || "",
          profileImage: data.profile_image || "",
          role: data.role || data.user_role || "",
          department: data.department || "",
          designation: data.designation || "",
          phone: data.mobile_no || "",
          location: data.location || "",
        });
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
      alert(`Camera Error:\n${error.name}\n${error.message}`);
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

      setUser({
        fullName: updatedData.full_name || updatedData.username || "User",
        email:
          updatedData.contact_email || updatedData.email || profileData.email,
        profileImage: updatedData.profile_image || "",
        role: updatedData.role || updatedData.user_role || "",
        department: updatedData.department || "",
        designation: updatedData.designation || "",
        phone: updatedData.mobile_no || "",
        location: updatedData.location || "",
      });

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
    <div
      data-theme={theme}
      className="min-h-screen bg-[var(--bg-main)] flex relative overflow-hidden transition-colors duration-300"
    >
      <style>{THEME_VARS}</style>

      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, var(--glow-1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 70%, var(--glow-2) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, var(--glow-1) 0%, transparent 50%)",
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
              backgroundColor:
                i % 2 === 0
                  ? "var(--accent-primary)"
                  : "var(--accent-secondary)",
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
          className="absolute inset-0 opacity-[0.4]"
          style={{
            // backgroundImage: `linear-gradient(var(--pattern-color) 1px, transparent 1px), linear-gradient(90deg, var(--pattern-color) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <Sidebar onLogout={onLogout} />

      <div className="flex-1 overflow-auto relative z-10 custom-scrollbar">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold mb-2 text-[var(--text-main)]">
              My Profile
            </h1>
            <p className="text-[var(--text-muted)] text-sm font-medium">
              Manage your account settings and preferences
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]"></div>
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
                  className="bg-[var(--bg-card)] rounded-3xl p-8 sticky top-8 shadow-[var(--shadow-card)] transition-colors duration-300"
                  style={{ border: "1px solid var(--border-main)" }}
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
                            "radial-gradient(circle, var(--glow-1), var(--glow-2))",
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
                        className="relative w-48 h-48 rounded-full overflow-hidden"
                        style={{
                          border: "4px solid var(--bg-card)",
                          boxShadow: "var(--shadow-avatar)",
                        }}
                      >
                        <div
                          className={`w-full h-full ${
                            currentAvatar.type === "custom"
                              ? "bg-[var(--custom-avatar-bg)]"
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
                        className="absolute bottom-2 right-2 w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-4 bg-[var(--accent-primary)] border-[var(--bg-card)] cursor-pointer"
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
                          className="mt-6 p-4 rounded-2xl bg-[var(--bg-modal)] shadow-xl"
                          style={{ border: "1px solid var(--border-main)" }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-bold text-[var(--accent-primary)]">
                              Choose Avatar
                            </p>
                            <button
                              onClick={() => setShowAvatarPicker(false)}
                              className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full mb-4 p-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 bg-[var(--accent-primary)] cursor-pointer"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Your Photo
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={openCamera}
                            className="w-full mb-4 p-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] border border-[var(--border-main)] cursor-pointer hover:bg-[var(--border-main)] transition-colors"
                          >
                            <Camera className="w-4 h-4" />
                            Open Camera
                          </motion.button>

                          {showCamera && (
                            <div className="mb-4 p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-main)]">
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full rounded-xl mb-3 shadow-sm"
                              />
                              <canvas ref={canvasRef} className="hidden" />
                              <button
                                onClick={capturePhoto}
                                className="w-full p-3 rounded-xl text-white font-semibold bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] cursor-pointer transition-colors"
                              >
                                Capture & Upload
                              </button>
                            </div>
                          )}

                          {profileImageFile && (
                            <button
                              onClick={handleSave}
                              className="w-full mb-4 p-3 rounded-xl text-white font-semibold cursor-pointer shadow-md bg-green-500 hover:bg-green-600 transition-colors"
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
                            style={{
                              borderTop: "1px solid var(--border-main)",
                            }}
                          >
                            <p className="text-[var(--text-muted)] text-xs mb-3 font-semibold">
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
                                  className={`relative w-14 h-14 rounded-full overflow-hidden ${avatar.bgColor} flex items-center justify-center cursor-pointer shadow-sm`}
                                  style={{
                                    border:
                                      selectedAvatar === avatar.id &&
                                      !customImage
                                        ? "2px solid var(--accent-primary)"
                                        : "2px solid var(--border-main)",
                                    boxShadow:
                                      selectedAvatar === avatar.id &&
                                      !customImage
                                        ? "0 10px 15px -3px var(--accent-tint)"
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
                                        className="absolute inset-0 backdrop-blur-sm flex items-center justify-center bg-[var(--accent-tint)]"
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
                    <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">
                      {profileData.name}
                    </h2>
                    <p className="text-sm mb-1 font-semibold text-[var(--accent-primary)]">
                      {profileData.role}
                    </p>
                    <p className="text-[var(--text-muted)] font-medium text-sm">
                      {profileData.department}
                    </p>
                    <p className="text-[var(--text-muted)] font-medium text-sm">
                      {profileData.designation}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div
                      className="p-4 rounded-xl bg-[var(--bg-input)] text-center shadow-sm"
                      style={{ border: "1px solid var(--border-strong)" }}
                    >
                      <p className="text-3xl font-bold mb-1 text-[var(--accent-primary)]">
                        0
                      </p>
                      <p className="text-[var(--text-muted)] font-medium text-xs">
                        Tasks Done
                      </p>
                    </div>

                    <div
                      className="p-4 rounded-xl bg-[var(--bg-input)] text-center shadow-sm"
                      style={{ border: "1px solid var(--accent-secondary)" }}
                    >
                      <p className="text-3xl font-bold mb-1 text-[var(--accent-secondary)]">
                        0%
                      </p>
                      <p className="text-[var(--text-muted)] font-medium text-xs">
                        Efficiency
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      isEditing ? handleSave() : setIsEditing(true)
                    }
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isEditing
                        ? "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30"
                        : "bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] shadow-lg shadow-[var(--accent-tint)]"
                    }`}
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
                  className="bg-[var(--bg-card)] h-full rounded-3xl p-8 shadow-[var(--shadow-card)] transition-colors duration-300"
                  style={{ border: "1px solid var(--border-main)" }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--accent-tint)]"
                    >
                      <User className="w-6 h-6 text-[var(--accent-primary)]" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-[var(--accent-primary)]">
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
                        <label className="text-[var(--text-label)] text-sm mb-2 block font-semibold">
                          {field.label}
                        </label>

                        <div className="relative group">
                          <motion.div
                            className="absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{
                              background: "var(--accent-tint)",
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
                            className="relative w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] font-medium disabled:opacity-60 focus:outline-none transition-colors"
                            style={{ border: "1px solid var(--border-strong)" }}
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
