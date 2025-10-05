import { useState } from "react";
import { Button } from "@/Components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/Card";
import { Input } from "@/Components/ui/Input";
import { Label } from "@/Components/ui/Label";
import { Textarea } from "@/Components/ui/Textarea";
import { Badge } from "@/Components/ui/Badge";
import {
  Edit3,
  Save,
  X,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Flag,
  Languages,
  Clock,
  Camera,
  Linkedin,
  Github,
  Twitter,
  Instagram
} from "lucide-react";

const PersonalDetailsCard = ({ profile, onUpdatePersonal }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile.personal);

  const handleSave = () => {
    onUpdatePersonal(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profile.personal);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform, value) => {
    setEditData(prev => ({
      ...prev,
      social: { ...prev.social, [platform]: value }
    }));
  };

  if (isEditing) {
    return (
      <Card className="shadow-medium">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Edit Personal Details</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Image Section */}
          <div className="flex items-center gap-4 p-4 border border-dashed border-border rounded-lg">
            <div className="relative">
              <img
                src={profile.personal.avatar}
                alt={profile.personal.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0"
              >
                <Camera className="w-3 h-3" />
              </Button>
            </div>
            <div>
              <p className="text-sm font-medium">Profile Picture</p>
              <p className="text-xs text-muted-foreground">Click the camera icon to change</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pronouns">Pronouns</Label>
              <Input
                id="pronouns"
                value={editData.pronouns}
                onChange={(e) => handleChange('pronouns', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              value={editData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={4}
              value={editData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={editData.website}
                onChange={(e) => handleChange('website', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={editData.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={editData.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
              />
            </div>
          </div>

          {/* Social Links Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={editData.social?.linkedin || ''}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={editData.social?.github || ''}
                  onChange={(e) => handleSocialChange('github', e.target.value)}
                  placeholder="github.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={editData.social?.twitter || ''}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  placeholder="@username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={editData.social?.instagram || ''}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="@username"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-medium">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          Personal Information
        </CardTitle>
        <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Details
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground mb-3">Contact Details</h3>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">{profile.personal.location}</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <a href={`mailto:${profile.personal.email}`} className="text-primary hover:underline">
                {profile.personal.email}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">{profile.personal.phone}</span>
            </div>

            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <a
                href={`https://${profile.personal.website}`}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.personal.website}
              </a>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground mb-3">Additional Information</h3>

            <div className="flex items-center gap-3">
              <Flag className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">{profile.personal.nationality}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">{profile.personal.timezone}</span>
            </div>

            <div className="flex items-start gap-3">
              <Languages className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex flex-wrap gap-2">
                {profile.personal.languages.map((lang, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold text-foreground mb-4">Social Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(profile.social).map(([platform, url]) => {
              if (!url) return null;

              const getIcon = (platform) => {
                switch (platform) {
                  case 'linkedin': return <Linkedin className="w-4 h-4" />;
                  case 'github': return <Github className="w-4 h-4" />;
                  case 'twitter': return <Twitter className="w-4 h-4" />;
                  case 'instagram': return <Instagram className="w-4 h-4" />;
                  default: return <Globe className="w-4 h-4" />;
                }
              };

              return (
                <a
                  key={platform}
                  href={`https://${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  {getIcon(platform)}
                  <span className="text-sm capitalize">{platform}</span>
                </a>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { PersonalDetailsCard };
