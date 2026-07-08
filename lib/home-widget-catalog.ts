export const HOME_WIDGET_CATALOG: Record<string, string> = {
  quickActions: "Quick Actions",
  announcements: "Announcements",
  timeConverter: "Time Converter",
  favoriteArticles: "Favorite Articles",
  trendingArticles: "Trending Articles",
  recentArticles: "Recent Articles",
  recentActivity: "Recent Activity",
  upcomingTraining: "Upcoming Training",
  importantLinks: "Important Links",
};

export const DEFAULT_HOME_WIDGETS: { type: string; order: number; size: string }[] = [
  { type: "quickActions", order: 0, size: "full" },
  { type: "announcements", order: 1, size: "half" },
  { type: "timeConverter", order: 2, size: "half" },
  { type: "favoriteArticles", order: 3, size: "half" },
  { type: "trendingArticles", order: 4, size: "half" },
  { type: "recentArticles", order: 5, size: "half" },
  { type: "recentActivity", order: 6, size: "half" },
  { type: "upcomingTraining", order: 7, size: "full" },
  { type: "importantLinks", order: 8, size: "half" },
];
