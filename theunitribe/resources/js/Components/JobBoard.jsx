import { Clock, Users, Briefcase, MapPin } from "lucide-react";
import { Badge } from "@/Components/ui/Badge";
import PrimaryButton from "@/Components/PrimaryButton";

const JobBoard = () => {
  const jobListings = [
    {
      title: "Software Engineer Intern",
      company: "Google",
      location: "Mountain View, CA",
      description: "Work on cutting-edge tech and solve real-world problems.",
      postedTime: "2h ago",
      applicantCount: 50,
      tags: ["Full-time", "Internship", "Software"],
      onApply: () => alert("Applied to Google!"),
    },
    {
      title: "Frontend Developer",
      company: "Meta",
      location: "Remote",
      description: "Build fast, beautiful user interfaces at scale.",
      postedTime: "1d ago",
      applicantCount: 120,
      tags: ["Remote", "JavaScript", "React"],
      onApply: () => alert("Applied to Meta!"),
    },
  ];

  return (
    <div className="grid  px-3 py-4 bg-transparent">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">GigBoard</h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Discover compact job listings tailored for internships, gigs & full-time roles.
        </p>
      </div>

      {/* Job Cards */}
      <div className="grid max-w-3xl w-full mx-auto">
        {jobListings.map((job, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-md p-2 space-y-2 bg-transparent"
          >
            {/* Header */}
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {job.title}
              </h3>
              <div className="flex items-center text-xs text-gray-600 gap-1 flex-wrap">
                <Briefcase className="w-3 h-3 text-blue-600" />
                <span className="text-blue-600 font-medium">{job.company}</span>
                <span className="text-gray-400">•</span>
                <MapPin className="w-3 h-3 text-gray-500" />
                <span>{job.location}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-xs line-clamp-2">
              {job.description}
            </p>

            {/* Tags */}
            {job.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {job.tags.map((tag, tagIndex) => (
                  <Badge
                    key={tagIndex}
                    className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between border-t border-gray-100 ">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{job.postedTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{job.applicantCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More */}
      <div className="flex justify-center">
        <PrimaryButton className="text-xs px-4 py-1.5">View More Jobs</PrimaryButton>
      </div>
    </div>
  );
};

export default JobBoard;
