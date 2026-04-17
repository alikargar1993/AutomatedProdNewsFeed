import BookmarkSvg from '@assets/svg/bookmark.svg';
import HomeSvg from '@assets/svg/home.svg';
import NewspaperSvg from '@assets/svg/newspaper.svg';
import ShareSvg from '@assets/svg/share.svg';

export const svgIconMap = {
  bookmark: BookmarkSvg,
  home: HomeSvg,
  newspaper: NewspaperSvg,
  share: ShareSvg,
} as const;

export type SvgIconName = keyof typeof svgIconMap;
