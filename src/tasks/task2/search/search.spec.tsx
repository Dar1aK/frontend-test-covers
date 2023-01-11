import {
  fireEvent,
  render,
  waitFor,
  screen,
  act,
} from "@testing-library/react";
import { vi } from "vitest";

import {
  BOOK_MOCK,
  SEARCH_MOCK,
  SEARCH_MOCK_PAGE1,
  SEARCH_MOCK_PAGE2,
  SEARCH_MOCK_WITHOUT_COVER,
} from "../../../../tests/mocks";
import Search from ".";

const fetchBookFullData = {
  ["ISBN:123"]: BOOK_MOCK,
};

const fetchBookFullDataWithoutCover = {
  ["ISBN:123"]: {
    ...BOOK_MOCK,
    details: {
      ...BOOK_MOCK.details,
      covers: undefined,
    },
  },
};

describe("Search", () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => SEARCH_MOCK,
    })
  ) as jest.Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render successfully", () => {
    const { baseElement } = render(<Search />);
    expect(baseElement).toBeTruthy();
  });

  it("should render page when request rejected", () => {
    global.fetch = vi.fn(() =>
      Promise.reject({
        json: () => null,
      })
    ) as jest.Mock;
    const { baseElement } = render(<Search />);
    expect(baseElement).toBeTruthy();
  });

  it("should render page without list when request rejected", async () => {
    global.fetch = vi.fn(() =>
      Promise.reject({
        json: () => null,
      })
    ) as jest.Mock;
    const { queryByRole } = render(<Search />);

    await waitFor(() => expect(queryByRole("list")).toBeNull(), {
      timeout: 3000,
    });
  });

  it("should render loader successfully after request started", async () => {
    const { getByRole, queryByAltText } = await render(<Search />);

    act(() => {
      fireEvent.input(getByRole("textbox"), {
        target: { value: "The Hobbit" },
      });
    });

    expect(queryByAltText("loader")).toBeTruthy();
  });

  it("should render list successfully after request ended successfully", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => SEARCH_MOCK,
      })
    ) as jest.Mock;
    const { getByRole, queryByRole } = await render(<Search />);

    act(() => {
      fireEvent.input(getByRole("textbox"), {
        target: { value: "The Hobbit" },
      });
    });

    await waitFor(() => expect(queryByRole("list")).toBeTruthy(), {
      timeout: 3000,
    });
  });

  it("should render list with titles successfully", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => SEARCH_MOCK,
      })
    ) as jest.Mock;
    const { getByRole, getByText, getAllByRole } = await render(<Search />);

    act(() => {
      fireEvent.input(getByRole("textbox"), {
        target: { value: "The Hobbit" },
      });
    });

    await waitFor(() => expect(getByText("The Hobbit")).toBeTruthy(), {
      timeout: 3000,
    });
    expect(getByText("Novels (Hobbit / Lord of the Rings)")).toBeTruthy();
    expect(getAllByRole("listitem")).toHaveLength(2);
  });

  it("should render covers successfully", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => SEARCH_MOCK,
      })
    ) as jest.Mock;
    const { getByRole, getAllByRole } = await render(<Search />);

    act(() => {
      fireEvent.input(getByRole("textbox"), {
        target: { value: "The Hobbit" },
      });
    });

    await waitFor(
      () =>
        expect(getAllByRole("contentinfo")[0]).toHaveStyle(
          `background-image: url("https://covers.openlibrary.org/b/id/8406786-L.jpg")`
        ),
      {
        timeout: 3000,
      }
    );
    expect(getAllByRole("contentinfo")[1]).toHaveStyle(
      `background-image: url("https://covers.openlibrary.org/b/id/255844-L.jpg")`
    );
  });

  it("should render element without 1 cover successfully", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => SEARCH_MOCK_WITHOUT_COVER,
      })
    ) as jest.Mock;
    const { getByRole, getAllByRole } = await render(<Search />);

    act(() => {
      fireEvent.input(getByRole("textbox"), {
        target: { value: "The Hobbit" },
      });
    });

    await waitFor(
      () =>
        expect(getAllByRole("contentinfo")[1]).toHaveStyle(
          `background-image: url("http://127.0.0.1:8080/src/assets/no-cover.jpg")`
        ),
      {
        timeout: 3000,
      }
    );
  });

  it("should render listitem's overlay successfully", async () => {
    vi.spyOn(global, "fetch").mockImplementation((param) => {
      const url = param as string;
      if (url.includes("search.json?")) {
        return Promise.resolve({
          json: () => SEARCH_MOCK,
        }) as Promise<any>;
      }
      return Promise.resolve({
        json: () => fetchBookFullData,
      }) as Promise<any>;
    });

    const { getByRole, getByText } = await render(<Search />);

    act(() => {
      fireEvent.input(getByRole("textbox"), {
        target: { value: "The Hobbit" },
      });
    });

    await new Promise((r) => setTimeout(r, 3000));

    act(() => {
      fireEvent.mouseEnter(screen.getAllByRole("listitem")[0]);
    });

    await waitFor(() => expect(getByText("Neal Stephenson")).toBeTruthy());
    expect(getByText("Snow Crash.")).toBeTruthy();
    expect(getByText("December 1, 1995")).toBeTruthy();
  });

  it("should render covers overlay successfully", async () => {
    vi.spyOn(global, "fetch").mockImplementation((param) => {
      const url = param as string;
      if (url.includes("search.json?")) {
        return Promise.resolve({
          json: () => SEARCH_MOCK,
        }) as Promise<any>;
      }
      return Promise.resolve({
        json: () => fetchBookFullData,
      }) as Promise<any>;
    });

    const { getByRole, getAllByRole, getByText } = await render(<Search />);

    act(() => {
      fireEvent.input(getByRole("textbox"), {
        target: { value: "The Hobbit" },
      });
    });

    await new Promise((r) => setTimeout(r, 3000));

    act(() => {
      fireEvent.mouseEnter(screen.getAllByRole("listitem")[0]);
    });

    await waitFor(
      () =>
        expect(getAllByRole("img")[0].getAttribute("src")).toBe(
          "https://covers.openlibrary.org/b/id/1005829-L.jpg"
        ),
      {
        timeout: 3000,
      }
    );
  });

  it("should render element without cover overlay successfully", async () => {
    vi.spyOn(global, "fetch").mockImplementation((param) => {
      const url = param as string;
      if (url.includes("search.json?")) {
        return Promise.resolve({
          json: () => SEARCH_MOCK_WITHOUT_COVER,
        }) as Promise<any>;
      }
      return Promise.resolve({
        json: () => fetchBookFullDataWithoutCover,
      }) as Promise<any>;
    });

    const { getByRole, queryByRole } = await render(<Search />);

    act(() => {
      fireEvent.input(getByRole("textbox"), {
        target: { value: "The Hobbit" },
      });
    });

    await new Promise((r) => setTimeout(r, 3000));

    act(() => {
      fireEvent.mouseEnter(screen.getAllByRole("listitem")[0]);
    });

    await waitFor(() => expect(queryByRole("img")).toBeNull(), {
      timeout: 3000,
    });
  });

  it("should disappear listitem's overlay onMouseLeave successfully", async () => {
    vi.spyOn(global, "fetch").mockImplementation((param) => {
      const url = param as string;
      if (url.includes("search.json?")) {
        return Promise.resolve({
          json: () => SEARCH_MOCK,
        }) as Promise<any>;
      }
      return Promise.resolve({
        json: () => fetchBookFullData,
      }) as Promise<any>;
    });

    const { getByRole, getByText, queryByText } = await render(<Search />);

    act(() => {
      fireEvent.input(getByRole("textbox"), {
        target: { value: "The Hobbit" },
      });
    });

    await new Promise((r) => setTimeout(r, 3000));

    act(() => {
      fireEvent.mouseEnter(screen.getAllByRole("listitem")[0]);
    });

    await waitFor(() => expect(getByText("Neal Stephenson")).toBeTruthy());

    act(() => {
      fireEvent.mouseLeave(screen.getAllByRole("listitem")[0]);
    });

    await waitFor(() => expect(queryByText("Neal Stephenson")).toBeNull());
  });

  it("should render page without list successfully after onClick on Clear", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => SEARCH_MOCK,
      })
    ) as jest.Mock;
    const { getByRole, queryByRole, getByText } = await render(<Search />);

    act(() => {
      fireEvent.input(getByRole("textbox"), {
        target: { value: "The Hobbit" },
      });
    });

    await waitFor(() => expect(queryByRole("list")).toBeTruthy(), {
      timeout: 3000,
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.click(getByText("Clear").closest("button") as Element);
    });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(queryByRole("list")).toBeNull();
  });

  it("should render successfully after onClick on link ", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => SEARCH_MOCK,
      })
    ) as jest.Mock;
    const { getByRole, getByText } = await render(<Search />);

    act(() => {
      fireEvent.click(getByRole("link"));
    });

    await waitFor(() => expect(getByText("The Hobbit")).toBeTruthy(), {
      timeout: 3000,
    });
  });

  it("should render Results block successfully", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => SEARCH_MOCK_PAGE1,
      })
    ) as jest.Mock;
    const { getByRole, getByText } = await render(<Search />);

    act(() => {
      fireEvent.input(getByRole("textbox"), {
        target: { value: "The Hobbit" },
      });
    });

    await waitFor(
      () => expect(getByText("Results 1-10 from 12")).toBeTruthy(),
      {
        timeout: 3000,
      }
    );
  });

  it("should render list successfully after click on Next", async () => {
    vi.spyOn(global, "fetch").mockImplementation((param) => {
      const url = param as string;
      if (url.includes("page=1")) {
        return Promise.resolve({
          json: () => SEARCH_MOCK_PAGE1,
        }) as Promise<any>;
      }
      return Promise.resolve({
        json: () => SEARCH_MOCK_PAGE2,
      }) as Promise<any>;
    });

    const { getByRole, getByText } = await render(<Search />);
    act(() => {
      fireEvent.input(getByRole("textbox"), {
        target: { value: "The Hobbit" },
      });
    });

    await new Promise((r) => setTimeout(r, 3000));

    act(() => {
      fireEvent.click(getByText("Next").closest("button") as Element);
    });

    await waitFor(
      () => expect(getByText("Results 11-12 from 12")).toBeTruthy(),
      {
        timeout: 3000,
      }
    );
  });

  it("should render list successfully after click on Prev", async () => {
    vi.spyOn(global, "fetch").mockImplementation((param) => {
      const url = param as string;
      if (url.includes("page=1")) {
        return Promise.resolve({
          json: () => SEARCH_MOCK_PAGE1,
        }) as Promise<any>;
      }
      return Promise.resolve({
        json: () => SEARCH_MOCK_PAGE2,
      }) as Promise<any>;
    });

    const { getByRole, getByText } = await render(<Search />);

    act(() => {
      fireEvent.input(getByRole("textbox"), {
        target: { value: "The Hobbit" },
      });
    });

    await new Promise((r) => setTimeout(r, 3000));

    act(() => {
      fireEvent.click(getByText("Next").closest("button") as Element);
    });

    await new Promise((r) => setTimeout(r, 3000));

    act(() => {
      fireEvent.click(getByText("Prev").closest("button") as Element);
    });

    await waitFor(
      () => expect(getByText("Results 1-10 from 12")).toBeTruthy(),
      {
        timeout: 3000,
      }
    );
  });
});
