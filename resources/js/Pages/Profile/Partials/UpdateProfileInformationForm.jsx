import React, { useState, useEffect, useCallback, useMemo } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import SelectInput from '@/Components/SelectInput';
import SocialMediaInput from '@/Components/SocialMediaInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { 
  FiUser, FiMail, FiCalendar, FiEdit, FiCamera, 
  FiPhone, FiMapPin, FiGlobe, FiTwitter, 
  FiFacebook, FiLinkedin, FiInstagram, FiGithub, FiCheck, FiX,
  FiLoader, FiRefreshCw, FiGlobe as FiWeb, FiEye, FiEyeOff
} from 'react-icons/fi';

export default function UpdateProfileInformation() {
  const { auth } = usePage().props;
  const user = auth.user;
  const isEmailVerified = !!user.email_verified_at;
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [locationLoading, setLocationLoading] = useState({
    countries: false,
    regions: false,
    cities: false,
    pincodes: false
  });
  const [showPhone, setShowPhone] = useState(false);
  const [progress, setProgress] = useState(0);

  // Calculate profile completeness
  useEffect(() => {
    const fields = [
      'name', 'email', 'bio', 'birth_date', 
      'phone', 'country_id', 'gender'
    ];
    const filledCount = fields.filter(field => 
      user[field] && (typeof user[field] === 'string' ? user[field].trim() !== '' : true)
    ).length;
    setProgress(Math.round((filledCount / fields.length) * 100));
  }, [user]);

  // Form initialization
  const initialFormData = useMemo(() => ({
    name: user.name,
    email: user.email,
    bio: user.bio || '',
    birth_date: user.birth_date || '',
    phone: user.phone || '',
    country_id: user.country_id ? String(user.country_id) : '',
    region_id: user.region_id ? String(user.region_id) : '',
    city_id: user.city_id ? String(user.city_id) : '',
    pincode_id: user.pincode_id ? String(user.pincode_id) : '',
    website: user.website || '',
    gender: user.gender || '',
    profile_image: user.profile_image || '',
    twitter: user.twitter || '',
    facebook: user.facebook || '',
    linkedin: user.linkedin || '',
    instagram: user.instagram || '',
    github: user.github || '',
  }), [user]);

  const { data, setData, post, errors, processing, recentlySuccessful, reset } = 
    useForm(initialFormData);

  // Location data states
  const [locationData, setLocationData] = useState({
    countries: [],
    regions: [],
    cities: [],
    pincodes: []
  });

  // Calculate minimum date for birth_date (13 years old)
  const minBirthDate = useMemo(() => {
    const today = new Date();
    return new Date(today.setFullYear(today.getFullYear() - 13))
      .toISOString()
      .split('T')[0];
  }, []);

  // Fetch location data with caching
  const fetchLocationData = useCallback(async (endpoint, params, key) => {
    setLocationLoading(prev => ({...prev, [key]: true}));
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`/${endpoint}?${query}`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const result = await response.json();
      setLocationData(prev => ({
        ...prev,
        [key]: result.map(item => ({ 
          value: String(item.id),
          label: item.name || item.pincode 
        }))
      }));
    } catch (error) {
      console.error(`Failed to fetch ${key}:`, error);
    } finally {
      setLocationLoading(prev => ({...prev, [key]: false}));
    }
  }, []);

  // Fetch countries on mount
  useEffect(() => {
    fetchLocationData('countries', {}, 'countries');
  }, [fetchLocationData]);

  // Fetch regions when country changes
  useEffect(() => {
    if (data.country_id) {
      fetchLocationData('regions', { country_id: data.country_id }, 'regions');
    } else {
      setLocationData(prev => ({ ...prev, regions: [], cities: [], pincodes: [] }));
      setData('region_id', '');
      setData('city_id', '');
      setData('pincode_id', '');
    }
  }, [data.country_id, fetchLocationData, setData]);

  // Fetch cities when region changes
  useEffect(() => {
    if (data.region_id) {
      fetchLocationData('cities', { region_id: data.region_id }, 'cities');
    } else {
      setLocationData(prev => ({ ...prev, cities: [], pincodes: [] }));
      setData('city_id', '');
      setData('pincode_id', '');
    }
  }, [data.region_id, fetchLocationData, setData]);

  // Fetch pincodes when city changes
  useEffect(() => {
    if (data.city_id) {
      fetchLocationData('pincodes', { city_id: data.city_id }, 'pincodes');
    } else {
      setLocationData(prev => ({ ...prev, pincodes: [] }));
      setData('pincode_id', '');
    }
  }, [data.city_id, fetchLocationData, setData]);

  // Handle image changes
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, GIF, or WebP)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
      return;
    }

    setData('profile_image', file);
    
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Submit handler
  const submit = (e) => {
    e.preventDefault();
    
    post(route('profile.update'), {
      preserveScroll: true,
      onSuccess: () => {
        setIsEditing(false);
        setImagePreview(null);
      },
      onError: () => {
        const firstError = Object.keys(errors)[0];
        if (firstError) {
          document.getElementById(firstError)?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }
    });
  };

  // Toggle edit mode
  const toggleEditing = () => {
    if (isEditing) {
      reset();
      setImagePreview(null);
    }
    setIsEditing(!isEditing);
  };

  // Gender options
  const genderOptions = useMemo(() => [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not', label: 'Prefer not to say' }
  ], []);

  // Calculate age from birth date
  const calculateAge = useCallback((birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return `${age} years`;
  }, []);

  // Toggle phone visibility
  const togglePhoneVisibility = () => {
    setShowPhone(!showPhone);
  };

  return (
    <section className={`bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full transform transition-all duration-300 hover:shadow-2xl`}>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <FiUser className="text-indigo-600 text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Profile Information
              </h2>
              <p className="mt-1 text-gray-500 text-sm">
                Manage your personal information and privacy settings
              </p>
            </div>
          </div>
          
          {/* Profile Completeness Meter */}
          <div className="mt-4 w-full max-w-xs">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Profile Completeness</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-700 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <button
          type="button"
          onClick={toggleEditing}
          className={`px-5 py-2.5 rounded-xl flex items-center transition-all shadow-md ${
            isEditing 
              ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg'
          }`}
          disabled={processing}
        >
          {processing ? (
            <FiLoader className="animate-spin mr-2" />
          ) : isEditing ? (
            <>
              <FiX className="mr-2" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <FiEdit className="mr-2" />
              <span>Edit Profile</span>
            </>
          )}
        </button>
      </header>

      <form onSubmit={submit} method='post' className="space-y-6">
        {/* Email Verification Banner */}
        {!isEmailVerified && (
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 flex items-start">
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <FiLoader className="text-yellow-600 text-xl animate-pulse" />
            </div>
            <div>
              <p className="text-sm text-yellow-800">
                Your email address is unverified.
              </p>
              <Link
                href={route('verification.send')}
                method="post"
                as="button"
                className="mt-1 flex items-center text-sm font-medium text-yellow-700 hover:text-yellow-600"
              >
                <FiRefreshCw className="mr-1" />
                Resend verification email
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Profile Image & Personal Info */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
              <div className="relative group flex justify-center mb-4">
                <div className="w-40 h-40 rounded-xl overflow-hidden border-4 border-white shadow-lg relative">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : user.profile_image_url ? (
                    <img 
                      src={user.profile_image_url} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <FiUser className="text-indigo-300 text-5xl" />
                    </div>
                  )}
                  
                  {/* Profile image overlay */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="bg-white text-indigo-600 p-3 rounded-full cursor-pointer hover:bg-indigo-50 transition-all shadow-lg">
                        <FiCamera className="text-lg" />
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleImageChange}
                          accept="image/jpeg,image/png,image/gif,image/webp"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <InputError message={errors.profile_image} />
              
              {isEditing && (
                <div className="text-center mt-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Max file size: 5MB • Recommended: 400x400px
                  </p>
                  {data.profile_image && (
                    <button 
                      type="button"
                      onClick={() => {
                        setData('profile_image', null);
                        setImagePreview(null);
                      }}
                      className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center justify-center mx-auto"
                    >
                      <FiX className="mr-1" />
                      Remove Image
                    </button>
                  )}
                </div>
              )}

              {/* Personal Info Section */}
              <div className="mt-8">
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  <FiUser className="mr-2 text-indigo-600" />
                  Personal Information
                </h3>
                
                <div className="space-y-5">
                  {/* Phone Field */}
                  <div>
                    <InputLabel htmlFor="phone" value="Phone" icon={<FiPhone className="text-gray-400" />} />
                    {isEditing ? (
                      <div className="relative">
                        <TextInput
                          id="phone"
                          className="mt-1 block w-full"
                          value={data.phone}
                          onChange={(e) => setData('phone', e.target.value)}
                          autoComplete="tel"
                          placeholder="+1 (555) 123-4567"
                        />
                        <InputError className="mt-1" message={errors.phone} />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <p className="mt-1 text-gray-900">
                          {user.phone ? (showPhone ? user.phone : '••••••••••') : 'Not provided'}
                        </p>
                        {user.phone && (
                          <button 
                            onClick={togglePhoneVisibility}
                            className="ml-2 text-indigo-600 hover:text-indigo-800 mt-1"
                          >
                            {showPhone ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Location Fields */}
                  <div>
                    <InputLabel htmlFor="country" value="Country" icon={<FiMapPin className="text-gray-400" />} />
                    {isEditing ? (
                      <div className="relative">
                        <SelectInput
                          id="country"
                          className="mt-1 block w-full"
                          value={data.country_id}
                          onChange={(e) => setData('country_id', e.target.value)}
                          options={[
                            { value: '', label: 'Select Country', disabled: true },
                            ...locationData.countries
                          ]}
                          disabled={locationLoading.countries}
                        />
                        {locationLoading.countries && (
                          <FiLoader className="absolute right-3 top-3 animate-spin text-gray-400" />
                        )}
                        <InputError className="mt-1" message={errors.country_id} />
                      </div>
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {user.country_name || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <InputLabel htmlFor="region" value="Region/State" icon={<FiMapPin className="text-gray-400" />} />
                    {isEditing ? (
                      <div className="relative">
                        <SelectInput
                          id="region"
                          className="mt-1 block w-full"
                          value={data.region_id}
                          onChange={(e) => setData('region_id', e.target.value)}
                          options={[
                            { 
                              value: '', 
                              label: data.country_id ? "Select Region" : "Select country first",
                              disabled: true 
                            },
                            ...locationData.regions
                          ]}
                          disabled={!data.country_id || locationLoading.regions}
                        />
                        {locationLoading.regions && (
                          <FiLoader className="absolute right-3 top-3 animate-spin text-gray-400" />
                        )}
                        <InputError className="mt-1" message={errors.region_id} />
                      </div>
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {user.region_name || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <InputLabel htmlFor="city" value="City" icon={<FiMapPin className="text-gray-400" />} />
                    {isEditing ? (
                      <div className="relative">
                        <SelectInput
                          id="city"
                          className="mt-1 block w-full"
                          value={data.city_id}
                          onChange={(e) => setData('city_id', e.target.value)}
                          options={[
                            { 
                              value: '', 
                              label: data.region_id ? "Select City" : "Select region first",
                              disabled: true 
                            },
                            ...locationData.cities
                          ]}
                          disabled={!data.region_id || locationLoading.cities}
                        />
                        {locationLoading.cities && (
                          <FiLoader className="absolute right-3 top-3 animate-spin text-gray-400" />
                        )}
                        <InputError className="mt-1" message={errors.city_id} />
                      </div>
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {user.city_name || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <InputLabel htmlFor="pincode" value="Postal Code" icon={<FiMapPin className="text-gray-400" />} />
                    {isEditing ? (
                      <div className="relative">
                        <SelectInput
                          id="pincode"
                          className="mt-1 block w-full"
                          value={data.pincode_id}
                          onChange={(e) => setData('pincode_id', e.target.value)}
                          options={[
                            { 
                              value: '', 
                              label: data.city_id ? "Select Postal Code" : "Select city first",
                              disabled: true 
                            },
                            ...locationData.pincodes
                          ]}
                          disabled={!data.city_id || locationLoading.pincodes}
                        />
                        {locationLoading.pincodes && (
                          <FiLoader className="absolute right-3 top-3 animate-spin text-gray-400" />
                        )}
                        <InputError className="mt-1" message={errors.pincode_id} />
                      </div>
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {user.pincode || 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* Gender Field */}
                  <div>
                    <InputLabel htmlFor="gender" value="Gender" />
                    {isEditing ? (
                      <>
                        <SelectInput
                          id="gender"
                          className="mt-1 block w-full"
                          value={data.gender}
                          onChange={(e) => setData('gender', e.target.value)}
                          options={genderOptions}
                        />
                        <InputError className="mt-1" message={errors.gender} />
                      </>
                    ) : (
                      <p className="mt-1 text-gray-900 capitalize">
                        {user.gender || 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-8">
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-6 border border-indigo-100 shadow-sm h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <InputLabel htmlFor="name" value="Full Name" icon={<FiUser className="text-gray-400" />} />
                  {isEditing ? (
                    <>
                      <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                      />
                      <InputError className="mt-1" message={errors.name} />
                    </>
                  ) : (
                    <p className="mt-1 text-gray-900 font-medium">{user.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <InputLabel 
                    htmlFor="email" 
                    value="Email" 
                    icon={<FiMail className="text-gray-400" />} 
                  />
                  {isEditing ? (
                    <>
                      <div className="relative">
                        <TextInput
                          id="email"
                          type="email"
                          className={`mt-1 block w-full ${!isEmailVerified ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          value={data.email}
                          onChange={(e) => {
                            if (isEmailVerified) {
                              setData('email', e.target.value)
                            }
                          }}
                          required
                          autoComplete="email"
                          disabled={!isEmailVerified || processing}
                        />
                        {!isEmailVerified && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <FiX className="text-red-500" />
                          </div>
                        )}
                      </div>
                      
                      {!isEmailVerified && (
                        <div className="mt-2 text-sm text-red-600">
                          <p>Verify your email to change it.</p>
                        </div>
                      )}
                      
                      <InputError className="mt-1" message={errors.email} />
                    </>
                  ) : (
                    <div className="mt-1 flex items-center">
                      <p className="text-gray-900">{user.email}</p>
                      {isEmailVerified ? (
                        <FiCheck className="ml-2 text-green-500" />
                      ) : (
                        <FiX className="ml-2 text-red-500" />
                      )}
                    </div>
                  )}
                </div>

                {/* Birth Date Field */}
                <div>
                  <InputLabel htmlFor="birth_date" value="Birth Date" icon={<FiCalendar className="text-gray-400" />} />
                  {isEditing ? (
                    <>
                      <TextInput
                        id="birth_date"
                        type="date"
                        className="mt-1 block w-full"
                        value={data.birth_date}
                        onChange={(e) => setData('birth_date', e.target.value)}
                        max={minBirthDate}
                      />
                      {data.birth_date && (
                        <p className="mt-1 text-sm text-gray-500">
                          Age: {calculateAge(data.birth_date)}
                        </p>
                      )}
                      <InputError className="mt-1" message={errors.birth_date} />
                    </>
                  ) : (
                    <div>
                      <p className="mt-1 text-gray-900">
                        {user.birth_date ? new Date(user.birth_date).toLocaleDateString() : 'Not specified'}
                      </p>
                      {user.birth_date && (
                        <p className="mt-1 text-sm text-gray-500">
                          Age: {calculateAge(user.birth_date)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Website Field */}
                <div>
                  <InputLabel htmlFor="website" value="Website" icon={<FiWeb className="text-gray-400" />} />
                  {isEditing ? (
                    <>
                      <TextInput
                        id="website"
                        type="url"
                        className="mt-1 block w-full"
                        value={data.website}
                        onChange={(e) => setData('website', e.target.value)}
                        placeholder="https://example.com"
                      />
                      <InputError className="mt-1" message={errors.website} />
                    </>
                  ) : (
                    user.website ? (
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-1 text-indigo-600 hover:underline inline-flex items-center"
                      >
                        {user.website}
                        <FiGlobe className="ml-1.5 text-sm" />
                      </a>
                    ) : (
                      <p className="mt-1 text-gray-900">Not provided</p>
                    )
                  )}
                </div>

                {/* Bio Field */}
                <div className="md:col-span-2">
                  <InputLabel htmlFor="bio" value="About Me" />
                  {isEditing ? (
                    <>
                      <TextArea
                        id="bio"
                        className="mt-1 block w-full min-h-[120px]"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        placeholder="Tell your story..."
                        maxLength={1000}
                      />
                      <div className="text-right text-sm text-gray-500 mt-1">
                        {data.bio.length}/1000 characters
                      </div>
                      <InputError className="mt-1" message={errors.bio} />
                    </>
                  ) : (
                    <p className="mt-1 text-gray-900 whitespace-pre-line">
                      {user.bio || (
                        <span className="text-gray-400 italic">No bio provided yet. Share something about yourself!</span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Social Media Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Social Profiles
                  </h3>
                  <span className="text-xs text-gray-500">
                    Optional but recommended
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <SocialMediaInput
                    icon={<FiTwitter className="text-blue-400" />}
                    platform="twitter"
                    value={data.twitter}
                    onChange={(value) => setData('twitter', value)}
                    placeholder="Username (e.g. user_name)"
                    editable={isEditing}
                    error={errors.twitter}
                  />
                  <SocialMediaInput
                    icon={<FiFacebook className="text-blue-600" />}
                    platform="facebook"
                    value={data.facebook}
                    onChange={(value) => setData('facebook', value)}
                    placeholder="Username (e.g. user.name)"
                    editable={isEditing}
                    error={errors.facebook}
                  />
                  <SocialMediaInput
                    icon={<FiLinkedin className="text-blue-700" />}
                    platform="linkedin"
                    value={data.linkedin}
                    onChange={(value) => setData('linkedin', value)}
                    placeholder="Username (e.g. user-name_123)"
                    editable={isEditing}
                    error={errors.linkedin}
                  />
                  <SocialMediaInput
                    icon={<FiInstagram className="text-pink-600" />}
                    platform="instagram"
                    value={data.instagram}
                    onChange={(value) => setData('instagram', value)}
                    placeholder="Username (e.g. user.name)"
                    editable={isEditing}
                    error={errors.instagram}
                  />
                  <SocialMediaInput
                    icon={<FiGithub className="text-gray-800" />}
                    platform="github"
                    value={data.github}
                    onChange={(value) => setData('github', value)}
                    placeholder="Username (e.g. user-name)"
                    editable={isEditing}
                    error={errors.github}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500 flex items-center">
              <FiLoader className="mr-2 animate-spin" />
              <span>Changes are saved automatically when you submit</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleEditing}
                className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <PrimaryButton 
                disabled={processing}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-shadow rounded-lg"
              >
                {processing ? (
                  <span className="flex items-center">
                    <FiLoader className="animate-spin mr-2" />
                    Updating...
                  </span>
                ) : 'Update Profile'}
              </PrimaryButton>
            </div>
          </div>
        )}
      </form>
      
      {/* Success Toast */}
      <Transition
        show={recentlySuccessful}
        enter="transition ease-out duration-300 transform"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
          <FiCheck className="mr-2" />
          <span>Profile updated successfully!</span>
        </div>
      </Transition>
    </section>
  );
}