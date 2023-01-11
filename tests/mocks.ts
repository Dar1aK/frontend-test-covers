export const BOOK_MOCK = {
  details: {
    publishers: ["Goldmann"],
    number_of_pages: 534,
    weight: "12.3 ounces",
    covers: [1005829],
    physical_format: "Paperback",
    key: "/books/OL9034871M",
    authors: [
      {
        key: "/authors/OL19430A",
        name: "Neal Stephenson",
      },
    ],
    title: "Snow Crash.",
    publish_date: "December 1, 1995",
  },
};

export const SEARCH_MOCK = {
  docs: [
    {
      title: "The Hobbit",
      cover_i: 8406786,
      isbn: ["123", "345"],
      key: "/works/OL262758W",
    },
    {
      title: "Novels (Hobbit / Lord of the Rings)",
      cover_i: 255844,
      isbn: ["968", "745"],
      key: "/works/OL262975Y",
    },
  ],
  start: 0,
  numFound: 143,
};

export const SEARCH_MOCK_PAGE1 = {
  docs: [
    {
      title: "The Hobbit",
      cover_i: 8406786,
      isbn: ["123", "345"],
      key: "/works/OL262758W",
    },
    {
      title: "Novels (Hobbit / Lord of the Rings)",
      cover_i: 255844,
      isbn: ["968", "745"],
      key: "/works/OL262975Y",
    },
    {
      title: "The Hobbit",
      cover_i: 8406786,
      isbn: ["123", "345"],
      key: "/works/OL262758W1",
    },
    {
      title: "Novels (Hobbit / Lord of the Rings)",
      cover_i: 255844,
      isbn: ["968", "745"],
      key: "/works/OL262975Y2",
    },
    {
      title: "The Hobbit",
      cover_i: 8406786,
      isbn: ["123", "345"],
      key: "/works/OL262758W3",
    },
    {
      title: "Novels (Hobbit / Lord of the Rings)",
      cover_i: 255844,
      isbn: ["968", "745"],
      key: "/works/OL262975Y4",
    },
    {
      title: "The Hobbit",
      cover_i: 8406786,
      isbn: ["123", "345"],
      key: "/works/OL262758W5",
    },
    {
      title: "Novels (Hobbit / Lord of the Rings)",
      cover_i: 255844,
      isbn: ["968", "745"],
      key: "/works/OL262975Y6",
    },
    {
      title: "The Hobbit",
      cover_i: 8406786,
      isbn: ["123", "345"],
      key: "/works/OL262758W7",
    },
    {
      title: "Novels (Hobbit / Lord of the Rings)",
      cover_i: 255844,
      isbn: ["968", "745"],
      key: "/works/OL262975Y8",
    },
  ],
  start: 0,
  numFound: 12,
};

export const SEARCH_MOCK_PAGE2 = {
  docs: [
    {
      title: "The Hobbit",
      cover_i: 8406786,
      isbn: ["123", "345"],
      key: "/works/OL262758W",
    },
    {
      title: "Novels (Hobbit / Lord of the Rings)",
      cover_i: 255844,
      isbn: ["968", "745"],
      key: "/works/OL262975Y",
    },
  ],
  start: 10,
  numFound: 12,
};

export const SEARCH_MOCK_WITHOUT_COVER = {
  docs: [
    {
      title: "The Hobbit",
      cover_i: 8406786,
      isbn: ["123", "345"],
      key: "/works/OL262758W",
    },
    {
      title: "Novels (Hobbit / Lord of the Rings)",
      isbn: ["968", "745"],
      key: "/works/OL262975Y",
    },
  ],
  start: 0,
  numFound: 143,
};
