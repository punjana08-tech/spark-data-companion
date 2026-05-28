import data from "@/data/analytics.json";

export type Analytics = typeof data;
export const analytics = data as Analytics;
