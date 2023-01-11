import { render, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { BOOK_MOCK } from "../../../../tests/mocks";
import Fullinfo, { BOOK_ID } from ".";

const fetchData = {
  [BOOK_ID]: BOOK_MOCK,
};

const fetchDataWith2Authors = {
  [BOOK_ID]: {
    details: {
      ...fetchData[BOOK_ID].details,
      authors: [
        {
          key: "/authors/OL19430A",
          name: "Neal Stephenson",
        },
        {
          key: "/authors/OL19430B",
          name: "Another Neal",
        },
      ],
    },
  },
};

const fetchDataWithoutCover = {
  [BOOK_ID]: {
    details: {
      ...fetchData[BOOK_ID].details,
      covers: undefined,
    },
  },
};

const fetchDataWithoutDateAndFormat = {
  [BOOK_ID]: {
    details: {
      ...fetchData[BOOK_ID].details,
      publish_date: undefined,
      physical_format: undefined,
    },
  },
};

describe("Fullinfo", () => {
  it("should render successfully", () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => fetchData,
      })
    ) as jest.Mock;
    const { baseElement } = render(<Fullinfo />);
    expect(baseElement).toBeTruthy();
  });

  it("should render page when reject", () => {
    global.fetch = vi.fn(() =>
      Promise.reject({
        json: () => null,
      })
    ) as jest.Mock;
    const { baseElement } = render(<Fullinfo />);
    expect(baseElement).toBeTruthy();
  });

  it("should render page without info when reject", async () => {
    global.fetch = vi.fn(() =>
      Promise.reject({
        json: () => null,
      })
    ) as jest.Mock;
    const { queryByText } = await render(<Fullinfo />);
    await waitFor(() => expect(queryByText("Author")).toBeNull());
    expect(queryByText("Title")).toBeNull();
  });

  it("should render author successfully", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => fetchData,
      })
    ) as jest.Mock;
    const { getByText } = await render(<Fullinfo />);
    await waitFor(() => expect(getByText("Neal Stephenson")).toBeTruthy());
  });

  it("should render a few authors successfully", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => fetchDataWith2Authors,
      })
    ) as jest.Mock;
    const { getByText } = await render(<Fullinfo />);
    await waitFor(() => expect(getByText("Neal Stephenson")).toBeTruthy());
    expect(getByText("Another Neal")).toBeTruthy();
  });

  it("should render cover", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => fetchData,
      })
    ) as jest.Mock;
    const { getByRole } = await render(<Fullinfo />);
    await waitFor(() =>
      expect(getByRole("img").getAttribute("src")).toBe(
        "https://covers.openlibrary.org/b/id/1005829-L.jpg"
      )
    );
  });

  it("should render fake when don't have cover", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => fetchDataWithoutCover,
      })
    ) as jest.Mock;
    const { getByRole } = await render(<Fullinfo />);
    await waitFor(() =>
      expect(getByRole("img").getAttribute("src")).toBe(
        "http://127.0.0.1:8080/src/assets/no-cover.jpg"
      )
    );
  });

  it("should render without date", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => fetchDataWithoutDateAndFormat,
      })
    ) as jest.Mock;
    const { queryByText } = await render(<Fullinfo />);
    await waitFor(() => expect(queryByText("Date")).toBeNull());
  });

  it("should render without format", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => fetchDataWithoutDateAndFormat,
      })
    ) as jest.Mock;
    const { queryByText } = await render(<Fullinfo />);
    await waitFor(() => expect(queryByText("Physical format")).toBeNull());
  });
});
