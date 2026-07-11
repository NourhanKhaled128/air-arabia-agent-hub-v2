export const HOME_WIDGET_CATALOG: Record<string, string> = {
  quickActions: "Quick Actions",
  announcements: "Announcements",
  disruptions: "Flight Disruptions",
  timeConverter: "Time Converter",
  favoriteArticles: "Browse A–Z",
  trendingArticles: "Trending Articles",
  recentArticles: "Recent Articles",
  recentActivity: "Recent Activity",
  upcomingTraining: "Upcoming Training",
  importantLinks: "Important Links",
};

export const DEFAULT_HOME_WIDGETS: { type: string; order: number; size: string }[] = [
  { type: "quickActions", order: 0, size: "full" },
  { type: "announcements", order: 1, size: "half" },
  { type: "disruptions", order: 2, size: "half" },
  { type: "timeConverter", order: 3, size: "half" },
  { type: "favoriteArticles", order: 4, size: "half" },
  { type: "trendingArticles", order: 5, size: "half" },
  { type: "recentArticles", order: 6, size: "half" },
  { type: "recentActivity", order: 7, size: "half" },
  { type: "upcomingTraining", order: 8, size: "full" },
  { type: "importantLinks", order: 9, size: "half" },
];
