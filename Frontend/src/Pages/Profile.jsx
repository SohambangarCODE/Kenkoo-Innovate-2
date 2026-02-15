import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateUser, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  // Theme Colors
  const PRIMARY_COLOR = "#1447E6";
  const SECONDARY_COLOR = "#3C53E8";

  useEffect(() => {
    if (!authLoading && !user) {
        navigate("/login");
    }
    if (user) {
        setFormData(user);
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("profileImage", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/upload-photo", {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${token}`
        },
        body: uploadData,
      });

      if (!res.ok) throw new Error("Failed to upload image");
      const updatedUser = await res.json();
      
      updateUser(updatedUser);
      setFormData(prev => ({ ...prev, profileImage: updatedUser.profileImage }));
    } catch (error) {
      console.error(error);
      alert("Failed to upload image.");
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      const updatedUser = await res.json();
      
      updateUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save changes.");
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1447E6]"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div 
          className="relative rounded-3xl overflow-hidden shadow-xl mb-8"
          style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%)` }}
        >
          <div className="absolute inset-0 bg-white/10 opacity-30 pattern-grid-lg"></div>
          <div className="relative px-8 py-10 md:py-14 text-white flex flex-col md:flex-row items-center md:items-end gap-6">
            
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <img 
                  src={user?.profileImage || "https://ui-avatars.com/api/?name=User&background=random"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                 <>
                   <label 
                     htmlFor="profile-image-upload"
                     className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                   >
                      <span className="text-xs font-medium text-white">Change Photo</span>
                   </label>
                   <input 
                      type="file" 
                      id="profile-image-upload" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                   />
                 </>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left mb-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{user?.name || "User Name"}</h1>
              <p className="text-blue-100 text-lg mt-1 flex items-center justify-center md:justify-start gap-2">
                <i className="ri-mail-line"></i> {user?.email || "email@example.com"}
              </p>
            </div>

            {/* Edit Button */}
            <div className="mb-4 md:mb-2">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 bg-white text-[#1447E6] font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                >
                  <i className="ri-edit-line"></i> Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button 
                    onClick={handleCancel}
                    className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl backdrop-blur-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-white text-[#1447E6] font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-0.5 active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Personal Stats / Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-heart-pulse-line text-[#1447E6]"></i> Health Stats
              </h3>
              
              <div className="space-y-4">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-50">
                   <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Age</div>
                   {isEditing ? (
                      <input 
                        type="number"
                        name="age"
                        value={formData.age || ""}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#1447E6] focus:border-transparent outline-none transition-all"
                      />
                   ) : (
                      <div className="text-xl font-bold text-gray-800">{user?.age ? `${user.age} yrs` : "N/A"}</div>
                   )}
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 bg-blue-50/50 p-4 rounded-xl border border-blue-50">
                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Height</div>
                    {isEditing ? (
                      <input 
                        type="text"
                        name="height"
                        value={formData.height || ""}
                        onChange={handleChange}
                        placeholder="e.g 180cm"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#1447E6] outline-none"
                      />
                    ) : (
                       <div className="text-lg font-bold text-gray-800">{user?.height || "-"}</div>
                    )}
                  </div>
                  <div className="flex-1 bg-blue-50/50 p-4 rounded-xl border border-blue-50">
                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Weight</div>
                    {isEditing ? (
                      <input 
                        type="text"
                        name="weight"
                        value={formData.weight || ""}
                        onChange={handleChange}
                        placeholder="e.g 75kg"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#1447E6] outline-none"
                      />
                    ) : (
                       <div className="text-lg font-bold text-gray-800">{user?.weight || "-"}</div>
                    )}
                  </div>
                </div>

                 <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-50">
                   <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Blood Type</div>
                   {isEditing ? (
                      <select 
                        name="bloodType"
                        value={formData.bloodType || ""}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#1447E6] outline-none"
                      >
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                   ) : (
                      <div className="text-xl font-bold text-gray-800">{user?.bloodType || "N/A"}</div>
                   )}
                </div>
              </div>
            </div>

            {/* About Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                 <i className="ri-user-smile-line text-[#1447E6]"></i> Bio
              </h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1447E6] focus:border-transparent outline-none transition-all resize-none text-sm"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed text-sm">
                  {user?.bio || "No bio added yet."}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Contact & Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                  <i className="ri-file-user-line text-[#1447E6]"></i> Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                   {/* Full Name */}
                   <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                      {isEditing ? (
                        <input 
                          type="text"
                          name="name"
                          value={formData.name || ""}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1447E6] focus:border-transparent outline-none transition-all font-medium text-gray-800"
                        />
                      ) : (
                        <div className="text-base font-medium text-gray-900 border-b border-dashed border-gray-200 pb-1">{user?.name}</div>
                      )}
                   </div>

                   {/* Email */}
                   <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
                      {isEditing ? (
                        <input 
                          type="email"
                          name="email"
                          value={formData.email || ""}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1447E6] focus:border-transparent outline-none transition-all font-medium text-gray-800"
                        />
                      ) : (
                        <div className="text-base font-medium text-gray-900 border-b border-dashed border-gray-200 pb-1">{user?.email}</div>
                      )}
                   </div>

                   {/* Phone */}
                   <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone Number</label>
                      {isEditing ? (
                        <input 
                          type="tel"
                          name="phone"
                          value={formData.phone || ""}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1447E6] focus:border-transparent outline-none transition-all font-medium text-gray-800"
                        />
                      ) : (
                        <div className="text-base font-medium text-gray-900 border-b border-dashed border-gray-200 pb-1">{user?.phone || "Not provided"}</div>
                      )}
                   </div>

                   {/* Address */}
                   <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mailing Address</label>
                      {isEditing ? (
                        <input 
                          type="text"
                          name="address"
                          value={formData.address || ""}
                          onChange={handleChange}
                          placeholder="Street, City, Zip Code"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1447E6] focus:border-transparent outline-none transition-all font-medium text-gray-800"
                        />
                      ) : (
                        <div className="text-base font-medium text-gray-900 border-b border-dashed border-gray-200 pb-1">{user?.address || "Not provided"}</div>
                      )}
                   </div>

                   {/* Profile Image URL (Optional field) */}
                   {isEditing && (
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Profile Image URL</label>
                        <input 
                          type="text"
                          name="profileImage"
                          value={formData.profileImage || ""}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1447E6] focus:border-transparent outline-none transition-all font-medium text-gray-800 text-sm"
                          placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-[10px] text-gray-400">Paste a direct link to an image.</p>
                      </div>
                   )}

                </div>
             </div>

             {/* Account Verification Mockup */}
             <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 md:p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Premium Member</h3>
                    <p className="text-gray-300 text-sm">Valid until Dec 2026</p>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                     <i className="ri-vip-crown-fill text-yellow-400 text-2xl"></i>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-3">
                   <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold uppercase rounded-md border border-green-500/30">
                      Active
                   </div>
                   <div className="text-xs text-gray-400 font-mono">ID: {user?._id?.substring(0, 8) || "UNKNOWN"}...</div>
                </div>
                
                {/* Decorative circles */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#1447E6] rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute top-0 right-20 w-20 h-20 bg-[#3C53E8] rounded-full opacity-20 blur-2xl"></div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;