/**
 * Response from `GET /topstories.json` — ordered list of story IDs (newest first).
 * @see https://github.com/HackerNews/API
 */
export type HnTopStoryIdsResponse = number[];

/**
 * Raw item payload from `GET /item/{id}.json`.
 * Only a subset of fields is required for stories; others appear on jobs, comments, etc.
 */
export type HnItemDto = {
  id: number;
  type: string;
  by?: string;
  time?: number;
  text?: string;
  url?: string;
  score?: number;
  title?: string;
  descendants?: number;
  kids?: number[];
  deleted?: boolean;
  dead?: boolean;
  parent?: number;
  poll?: number;
  parts?: number[];
};

/**
 * Normalized Hacker News story used in the app after filtering to `type === 'story'`
 * with a present `url`.
 */
export type HnStory = {
  id: number;
  title: string;
  url: string;
  by: string;
  score: number;
  /** Unix time in seconds (HN `time` field). */
  time: number;
};
