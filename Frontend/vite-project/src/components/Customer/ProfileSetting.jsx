import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Lock } from 'lucide-react';
 
export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    phone: '+1 (555) 000-0000',
    bio: 'Digital designer and tech enthusiast.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  });
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile settings saved successfully!');
  };
 
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-700">Profile Settings</h2>
        <p className="text-sm text-slate-400 mt-1">Update your personal details and public profile.</p>
      </div>
 
      <form onSubmit={handleSubmit} className="space-y-8">
       
        {/* Avatar Upload Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-4 rounded-xl">
          <div className="relative group">
            <img
              src={profile.avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 p-2 bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-full shadow-lg transition-colors"
              title="Change Avatar"
            >
              <Camera size={16} />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-medium text-slate-700">Profile Picture</h4>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG or GIF. Max 2MB.</p>
            <div className="mt-3 flex gap-2 justify-center sm:justify-start">
              <button type="button" className="text-xs font-semibold text-[#6B46C1] hover:underline">Upload new</button>
              <span className="text-xs text-slate-300">|</span>
              <button type="button" className="text-xs font-semibold text-rose-500 hover:underline">Remove</button>
            </div>
          </div>
        </div>
 
        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
          {/* First Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:border-[#6B46C1] focus:ring-1 focus:ring-[#6B46C1] transition-all"
                placeholder="John"
              />
            </div>
          </div>
 
          {/* Last Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:border-[#6B46C1] focus:ring-1 focus:ring-[#6B46C1] transition-all"
                placeholder="Doe"
              />
            </div>
          </div>
 
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:border-[#6B46C1] focus:ring-1 focus:ring-[#6B46C1] transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>
 
          {/* Phone Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:border-[#6B46C1] focus:ring-1 focus:ring-[#6B46C1] transition-all"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
 
          {/* Biography */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-slate-600">Bio</label>
            <textarea
              name="bio"
              rows="4"
              value={profile.bio}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:border-[#6B46C1] focus:ring-1 focus:ring-[#6B46C1] transition-all resize-none"
              placeholder="Tell us a little bit about yourself..."
            />
          </div>
 
        </div>
 
        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-lg transition-colors text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#6B46C1] hover:bg-[#553C9A] rounded-lg shadow-sm shadow-[#6B46C1]/10 transition-colors"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
 
      </form>
    </div>
  );
}