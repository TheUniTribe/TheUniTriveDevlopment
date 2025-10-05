import { Clock, Users, Briefcase, MapPin } from "lucide-react";
import { Badge } from "@/Components/ui/Badge";
import PrimaryButton from "@/Components/PrimaryButton";

const JobCard = ({
  title,
  company,
  location,
  description,
  postedTime,
  applicantCount,
  tags,
  onApply,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="flex flex-col space-y-4">
        {/* Header Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-medium">{company}</span>
            <span className="text-gray-400">•</span>
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{postedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{applicantCount} applicants</span>
            </div>
          </div>
          
          {onApply && (
            <PrimaryButton 
              onClick={onApply}
              className="text-sm px-4 py-2"
            >
              Apply Now
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
