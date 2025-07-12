import React, { useState } from 'react';
import { ArrowRight, Calendar, Clock, Users, MessageSquare, MapPin, Monitor, Zap } from 'lucide-react';

const SwapForm = () => {
  const [providerId, setProviderId] = useState('');
  const [skillOffered, setSkillOffered] = useState({ skill: '', description: '', level: '' });
  const [skillRequested, setSkillRequested] = useState({ skill: '', description: '', level: '' });
  const [message, setMessage] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [duration, setDuration] = useState(60);
  const [meetingType, setMeetingType] = useState('online');
  const [meetingDetails, setMeetingDetails] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate API call
    console.log({
      providerId,
      skillOffered,
      skillRequested,
      message,
      scheduledDate,
      duration,
      meetingType,
      meetingDetails,
    });
    // Handle success (e.g., redirect or show message)
  };

  const InputField = ({ icon: Icon, label, type = "text", placeholder, value, onChange, required = false, className = "" }) => (
    <div className="group relative ">
      <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300 shadow-sm hover:shadow-md ${className}`}
        />
      </div>
    </div>
  );

  const SelectField = ({ icon: Icon, label, value, onChange, options, className = "" }) => (
    <div className="group relative">
      <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
        )}
        <select
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300 shadow-sm hover:shadow-md appearance-none ${className}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );

  const TextAreaField = ({ icon: Icon, label, placeholder, value, onChange, rows = 4 }) => (
    <div className="group relative">
      <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-4 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
        )}
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300 shadow-sm hover:shadow-md resize-none`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <ArrowRight className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Skill Swap
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exchange knowledge and expertise with others in your community. Share what you know and learn something new.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Provider Information */}
            <div className="lg:col-span-2">
              <InputField
                icon={Users}
                label="Provider ID"
                placeholder="Enter your unique provider ID"
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                required
              />
            </div>

            {/* Skill Offered Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-3">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Skill You're Offering</h3>
              </div>
              
              <div className="space-y-6">
                <InputField
                  label="Skill Name"
                  placeholder="e.g., JavaScript Development"
                  value={skillOffered.skill}
                  onChange={(e) => setSkillOffered({ ...skillOffered, skill: e.target.value })}
                  required
                />
                
                <TextAreaField
                  label="Description"
                  placeholder="Describe what you'll teach and your experience..."
                  value={skillOffered.description}
                  onChange={(e) => setSkillOffered({ ...skillOffered, description: e.target.value })}
                  rows={3}
                />
                
                <SelectField
                  label="Your Level"
                  value={skillOffered.level}
                  onChange={(e) => setSkillOffered({ ...skillOffered, level: e.target.value })}
                  options={[
                    { value: '', label: 'Select your skill level' },
                    { value: 'Beginner', label: 'Beginner' },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced', label: 'Advanced' },
                    { value: 'Expert', label: 'Expert' }
                  ]}
                />
              </div>
            </div>

            {/* Skill Requested Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
                  <ArrowRight className="w-5 h-5 text-white transform rotate-180" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Skill You're Seeking</h3>
              </div>
              
              <div className="space-y-6">
                <InputField
                  label="Skill Name"
                  placeholder="e.g., Graphic Design"
                  value={skillRequested.skill}
                  onChange={(e) => setSkillRequested({ ...skillRequested, skill: e.target.value })}
                  required
                />
                
                <TextAreaField
                  label="Description"
                  placeholder="Describe what you'd like to learn..."
                  value={skillRequested.description}
                  onChange={(e) => setSkillRequested({ ...skillRequested, description: e.target.value })}
                  rows={3}
                />
                
                <SelectField
                  label="Desired Level"
                  value={skillRequested.level}
                  onChange={(e) => setSkillRequested({ ...skillRequested, level: e.target.value })}
                  options={[
                    { value: '', label: 'Select desired level' },
                    { value: 'Beginner', label: 'Beginner' },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced', label: 'Advanced' },
                    { value: 'Expert', label: 'Expert' }
                  ]}
                />
              </div>
            </div>

            {/* Session Details */}
            <div className="lg:col-span-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-3">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Session Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  icon={Calendar}
                  label="Scheduled Date & Time"
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
                
                <InputField
                  icon={Clock}
                  label="Duration (minutes)"
                  type="number"
                  placeholder="60"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                
                <SelectField
                  icon={Monitor}
                  label="Meeting Type"
                  value={meetingType}
                  onChange={(e) => setMeetingType(e.target.value)}
                  options={[
                    { value: 'online', label: 'Online' },
                    { value: 'in-person', label: 'In-Person' },
                    { value: 'hybrid', label: 'Hybrid' }
                  ]}
                />
                
                <div className="md:col-span-2">
                  <TextAreaField
                    icon={MapPin}
                    label="Meeting Details"
                    placeholder="Zoom link, address, or additional instructions..."
                    value={meetingDetails}
                    onChange={(e) => setMeetingDetails(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="lg:col-span-2">
              <TextAreaField
                icon={MessageSquare}
                label="Personal Message"
                placeholder="Tell them about yourself and why you're interested in this swap..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center group"
            >
              Create Skill Swap
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapForm;