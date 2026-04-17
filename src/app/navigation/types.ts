import type { NavigatorScreenParams } from '@react-navigation/native';

export type ArticlesStackParamList = {
  ArticleList: undefined;
  ArticleDetail: { articleId: number };
};

export type RootTabParamList = {
  ArticlesTab: NavigatorScreenParams<ArticlesStackParamList>;
  BookmarksTab: undefined;
};
