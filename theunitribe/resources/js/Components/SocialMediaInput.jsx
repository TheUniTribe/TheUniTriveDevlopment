import React, { useState, useEffect, useRef } from 'react';
import InputError from '@/Components/InputError';
import { FiX, FiExternalLink, FiEdit, FiCheck, FiCopy, FiInfo } from 'react-icons/fi';

const platformUrls = {
    twitter: 'https://twitter.com/',
    facebook: 'https://facebook.com/',
    linkedin: 'https://linkedin.com/in/',
    instagram: 'https://instagram.com/',
    github: 'https://github.com/',
};

const platformColors = {
    twitter: 'bg-blue-50 border-blue-200',
    facebook: 'bg-blue-50 border-blue-300',
    linkedin: 'bg-blue-50 border-blue-400',
    instagram: 'bg-pink-50 border-pink-200',
    github: 'bg-gray-50 border-gray-300',
};

const platformNames = {
    twitter: 'Twitter',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    github: 'GitHub',
};

const platformTips = {
    twitter: 'Enter your Twitter username (without @)',
    facebook: 'Enter your Facebook username',
    linkedin: 'Enter your LinkedIn public profile name',
    instagram: 'Enter your Instagram username',
    github: 'Enter your GitHub username',
};

export default function SocialMediaInput({ 
    icon, 
    platform, 
    value, 
    onChange, 
    placeholder, 
    editable,
    error
}) {
    const platformUrl = platformUrls[platform] || '';
    const [copied, setCopied] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isEditingInline, setIsEditingInline] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef(null);
    
    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const handleChange = (e) => {
        onChange(platform, e.target.value);
    };

    const handleClear = () => {
        onChange(platform, '');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(platformUrl + value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleInlineSave = () => {
        onChange(platform, tempValue);
        setIsEditingInline(false);
    };

    const handleInlineCancel = () => {
        setTempValue(value);
        setIsEditingInline(false);
    };

    // Close tooltip when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setShowTooltip(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div 
            className={`relative mb-4 p-4 rounded-xl border ${platformColors[platform]} transition-all duration-300 hover:shadow-md`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-white border mr-3 shadow-sm">
                        {icon}
                    </div>
                    <h3 className="font-semibold text-gray-800 capitalize">
                        {platformNames[platform]}
                    </h3>
                    
                    {/* Info button with tooltip */}
                    <div className="relative ml-2" ref={tooltipRef}>
                        <button
                            type="button"
                            onClick={() => setShowTooltip(!showTooltip)}
                            className="text-gray-400 hover:text-indigo-600"
                            aria-label="Information"
                        >
                            <FiInfo className="w-4 h-4" />
                        </button>
                        
                        {showTooltip && (
                            <div className="absolute z-10 left-0 mt-2 w-64 bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                <div className="text-sm text-gray-700 font-medium mb-1">
                                    {platformNames[platform]} Tips
                                </div>
                                <div className="text-xs text-gray-500">
                                    {platformTips[platform]}
                                </div>
                                <div className="absolute top-0 left-4 w-3 h-3 bg-white transform rotate-45 -translate-y-1/2 border-t border-l border-gray-200"></div>
                            </div>
                        )}
                    </div>
                </div>
                
                {editable && value && !isEditingInline && (
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={() => setIsEditingInline(true)}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                            aria-label="Edit"
                        >
                            <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            aria-label="Clear"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {editable && !isEditingInline ? (
                <div className="flex flex-col">
                    <div className="flex items-center">
                        <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-white text-gray-500 text-sm select-none">
                            {platformUrl}
                        </span>
                        <input
                            type="text"
                            value={value}
                            onChange={handleChange}
                            placeholder={placeholder}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    {error && <InputError message={error} className="mt-1" />}
                </div>
            ) : isEditingInline ? (
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center">
                        <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-white text-gray-500 text-sm select-none">
                            {platformUrl}
                        </span>
                        <input
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            placeholder={placeholder}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            autoFocus
                        />
                        <button
                            onClick={handleInlineSave}
                            className="p-2 bg-green-500 text-white rounded-r-md hover:bg-green-600 transition-colors"
                            aria-label="Save"
                        >
                            <FiCheck className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={handleInlineCancel}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleInlineSave}
                            className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : value ? (
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <a 
                            href={platformUrl + value} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-gray-800 hover:text-indigo-600 flex items-center transition-colors"
                        >
                            <span className="mr-1">@{value}</span>
                            <FiExternalLink className="text-sm text-gray-400" />
                        </a>
                        
                        <button
                            onClick={copyToClipboard}
                            className="ml-2 text-gray-400 hover:text-indigo-600 transition-colors relative group"
                            aria-label={copied ? "Copied!" : "Copy to clipboard"}
                        >
                            {copied ? (
                                <FiCheck className="text-green-500" />
                            ) : (
                                <FiCopy className="w-4 h-4" />
                            )}
                            {/* Tooltip for copy button */}
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                {copied ? "Copied!" : "Copy URL"}
                                <span className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
                            </span>
                        </button>
                    </div>
                    
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Connected
                    </span>
                </div>
            ) : (
                <div className="flex items-center justify-between">
                    <span className="text-gray-500 italic">Not connected</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                        Disconnected
                    </span>
                </div>
            )}
            
            <div className="mt-2 text-xs text-gray-500 flex items-center">
                <FiInfo className="mr-1 text-gray-400 flex-shrink-0" />
                <span>{platformTips[platform]}</span>
            </div>
        </div>
    );
}