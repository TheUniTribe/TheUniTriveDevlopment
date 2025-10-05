import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/Tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/Card";
import { Badge } from "@/Components/ui/Badge";
import { Button } from "@/Components/ui/Button";
import { Progress } from "@/Components/ui/Progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/Avatar";
import {
  BarChart3,
  Users,
  Trophy,
  Star,
  MessageCircle,
  Heart,
  Eye,
  Share2,
  Crown,
  Award,
  TrendingUp,
  Calendar
} from "lucide-react";

const ProfileTabs = ({ profile }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Activity</span>
        </TabsTrigger>
        <TabsTrigger value="skills" className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span className="hidden sm:inline">Skills</span>
        </TabsTrigger>
        <TabsTrigger value="achievements" className="flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          <span className="hidden sm:inline">Achievements</span>
        </TabsTrigger>
        <TabsTrigger value="connections" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Network</span>
        </TabsTrigger>
        <TabsTrigger value="reputation" className="flex items-center gap-2">
          <Award className="w-4 h-4" />
          <span className="hidden sm:inline">Reputation</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skills Preview */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Top Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.professional.skills.slice(0, 4).map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.endorsements}</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Skills
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.activity.slice(0, 3).map((activity) => (
                <div key={activity.id} className="pb-4 border-b border-border last:border-b-0 last:pb-0">
                  <p className="text-sm mb-2 line-clamp-2">{activity.content}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {activity.engagement.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {activity.engagement.comments}
                    </span>
                    <span>{formatRelativeTime(activity.timestamp)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements Preview */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {profile.achievements.slice(0, 4).map((achievement) => (
                  <div key={achievement.id} className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="text-xs font-medium">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="activity" className="space-y-6">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Posts & Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {profile.activity.map((activity) => (
              <div key={activity.id} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={profile.personal.avatar} />
                    <AvatarFallback>{profile.personal.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{profile.personal.name}</span>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {activity.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-foreground mb-4">{activity.content}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <Heart className="w-4 h-4" />
                        {activity.engagement.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {activity.engagement.comments}
                      </button>
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <Share2 className="w-4 h-4" />
                        {activity.engagement.shares}
                      </button>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {activity.engagement.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="skills" className="space-y-6">
        <Card className="shadow-medium">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Skills & Endorsements</CardTitle>
            <Button size="sm">Add Skill</Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {profile.professional.skills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {skill.endorsements} endorsements
                    </span>
                    <Button variant="outline" size="sm">Endorse</Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={skill.level} className="flex-1 h-3" />
                  <span className="text-sm text-muted-foreground w-12">{skill.level}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="achievements" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.achievements.map((achievement) => (
            <Card key={achievement.id} className="shadow-medium hover:shadow-large transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">{achievement.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{achievement.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{achievement.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">+{achievement.points} points</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(achievement.dateEarned)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="connections" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Your Network ({profile.stats.connections})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.connections.filter(c => c.isConnected).map((connection) => (
                <div key={connection.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={connection.avatar} />
                      <AvatarFallback>{connection.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{connection.name}</div>
                      <div className="text-sm text-muted-foreground">{connection.role} at {connection.company}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Message</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Suggested Connections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.connections.filter(c => !c.isConnected).map((connection) => (
                <div key={connection.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={connection.avatar} />
                      <AvatarFallback>{connection.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{connection.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {connection.mutualConnections} mutual connections
                      </div>
                    </div>
                  </div>
                  <Button size="sm">Connect</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="reputation" className="space-y-6">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Reputation Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">{profile.reputation.score}</div>
                <div className="text-muted-foreground">Total Reputation</div>
                <Badge className="mt-2">Level {profile.reputation.level}</Badge>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Reputation Breakdown</h4>
                {profile.reputation.breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{item.category}</span>
                    <span className="font-medium text-primary">+{item.points}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export { ProfileTabs };
