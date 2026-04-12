export type IdeaItem = {
  id: string;
  text: string;
  score?: number;
  moved?: boolean;
  movedFrom?: string;
};

export type ResItem = {
  idea: { id: string; text: string };
  topic: { id: string; topicLvl1: string; topicLvl2: string; created?: boolean };
  score: number;
};

export type ResLike = {
  time: number;
  name: string;
  results: ResItem[];
  origin?: {
    results: ResItem[];
  };
};

export type GroupedTopicIdea = {
  id: string;
  text: string;
  score: number;
  moved: boolean;
  movedFrom?: string;
};

export type GroupedTopicSubtopic = {
  topic: ResItem["topic"];
  ideas: GroupedTopicIdea[];
};

export type GroupedTopic = {
  topicLvl1: string;
  subtopics: GroupedTopicSubtopic[];
  ideasCount: number;
};
