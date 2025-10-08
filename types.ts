export interface Cut {
  place: string;
  characterCount: number;
  characters: string[]; // Added character names
  dialogue: string;
  situation: string;
  shot: string;
}

export type StoryPart = '기' | '승' | '전' | '결';