import type { GroupedTopic, GroupedTopicSubtopic, ResItem } from '../types';

type TopicGroupEntry = {
  topicLvl1: string;
  subtopics: Map<string, GroupedTopicSubtopic>;
};

export function groupByTheme(items: ResItem[], originItems?: ResItem[]): GroupedTopic[] {
  const originByIdeaId = new Map<string, ResItem['topic']>();
  if (originItems) {
    for (const item of originItems) {
      originByIdeaId.set(item.idea.id, item.topic);
    }
  }

  const byTheme = new Map<string, TopicGroupEntry>();

  for (const item of items) {
    const originTopic = originByIdeaId.get(item.idea.id);
    const moved = Boolean(originTopic && originTopic.id !== item.topic.id);
    const movedFrom =
      moved && originTopic ? `${originTopic.topicLvl1} -> ${originTopic.topicLvl2}` : undefined;

    let themeGroup = byTheme.get(item.topic.topicLvl1);
    if (!themeGroup) {
      themeGroup = {
        topicLvl1: item.topic.topicLvl1,
        subtopics: new Map(),
      };
      byTheme.set(item.topic.topicLvl1, themeGroup);
    }

    let subtopicGroup = themeGroup.subtopics.get(item.topic.id);
    if (!subtopicGroup) {
      subtopicGroup = {
        topic: item.topic,
        ideas: [],
      };
      themeGroup.subtopics.set(item.topic.id, subtopicGroup);
    }

    subtopicGroup.ideas.push({
      id: item.idea.id,
      text: item.idea.text,
      score: item.score,
      moved,
      movedFrom,
    });
  }

  return Array.from(byTheme.values())
    .map((themeGroup) => {
      const subtopics = Array.from(themeGroup.subtopics.values())
        .map((subtopic) => ({
          ...subtopic,
          ideas: [...subtopic.ideas].sort((a, b) => b.score - a.score),
        }))
        .sort((a, b) => {
          const countDiff = b.ideas.length - a.ideas.length;
          if (countDiff !== 0) return countDiff;
          return a.topic.topicLvl2.toLowerCase().localeCompare(b.topic.topicLvl2.toLowerCase());
        });

      return {
        topicLvl1: themeGroup.topicLvl1,
        subtopics,
        ideasCount: subtopics.reduce((acc, subtopic) => acc + subtopic.ideas.length, 0),
      };
    })
    .sort((a, b) => {
      const countDiff = b.ideasCount - a.ideasCount;
      if (countDiff !== 0) return countDiff;
      return a.topicLvl1.toLowerCase().localeCompare(b.topicLvl1.toLowerCase());
    });
}
