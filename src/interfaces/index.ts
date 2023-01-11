export interface FullinfoI {
  thumbnail_url: string;
  details: {
    title: string;
    authors: { key: string; name: string }[];
    publish_date: string;
    physical_format: string;
    number_of_pages: number;
    weight: string;
    covers: number[];
  };
}

export interface SearchBookI {
  title: string;
  cover_i: string;
  isbn: ISBN[];
  key: string;
}

export type ISBN = string;
