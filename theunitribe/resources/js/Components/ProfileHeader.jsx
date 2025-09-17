import { Badge } from "@/Components/ui/Badge";
import { Button } from "@/Components/ui/Button";

const ProfileHeader = ({ profile }) => {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div
        className="h-48 md:h-64 bg-cover bg-center relative rounded-t-xl overflow-hidden"
        style={{ backgroundImage: `url(${profile.personal.coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Profile Content */}
      <div className="relative px-6 pb-6">
        {/* Profile Picture */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 md:-mt-20">
          <div className="relative">
            <img
              src={profile.personal.avatar}
              alt={profile.personal.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>

          {/* Profile Info and Actions */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate">
                    {profile.personal.name}
                  </h1>
                  <Badge variant="outline" className="text-xs">
                    {profile.personal.pronouns}
                  </Badge>
                </div>

                <p className="text-lg text-muted-foreground mb-3">
                  {profile.personal.title}
                </p>

                {/* Professional Info */}
                <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-foreground">{profile.professional.currentRole}</span>
                    <span className="text-muted-foreground">at</span>
                    <span className="font-medium text-foreground">{profile.professional.company}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {profile.professional.experience} • {profile.professional.industry}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground max-w-2xl">
                  {profile.personal.bio}
                </p>
              </div>

              {/* Minimal Action Buttons */}
              <div className="flex gap-2">
                <Button size="sm" variant="default">
                  Connect
                </Button>
                <Button variant="outline" size="sm">
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-6 flex flex-wrap gap-6 text-sm">
          <div className="text-center">
            <div className="font-semibold text-foreground">{profile.stats.connections}</div>
            <div className="text-muted-foreground">Connections</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{profile.stats.posts}</div>
            <div className="text-muted-foreground">Posts</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{profile.stats.profileViews}</div>
            <div className="text-muted-foreground">Profile Views</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{profile.reputation.score}</div>
            <div className="text-muted-foreground">Reputation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProfileHeader };
