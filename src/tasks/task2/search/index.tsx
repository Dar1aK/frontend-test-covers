import { useState, useCallback, useEffect } from "react";
import _debounce from "lodash/debounce";

import noCover from "../../../assets/no-cover.jpg";
import loader from "../../../assets/loader.svg";
import { FullinfoI, SearchBookI, ISBN } from "../../../interfaces";
import styles from "./index.module.css";

const BOOKS_PER_PAGE = 10;
const PAGES_COUNT = 10;
let controller: AbortController, signal;

const Search = () => {
  const [list, setList] = useState<SearchBookI[]>([]);
  const [info, setInfo] = useState<null | { start: number; numFound: number }>(
    null
  );
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hoverinfo, setHoverinfo] = useState<null | {
    [key: ISBN]: FullinfoI;
  }>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<null | number[]>(null);

  const handleDebounceFn = (val: string) => {
    const title = val.trim();

    if (controller) {
      controller.abort();
    }
    controller = new AbortController();
    signal = controller.signal;

    fetch(
      `http://openlibrary.org/search.json?limit=${BOOKS_PER_PAGE}&page=${page}${
        title ? "&title=" + title : ""
      }`,
      {
        signal: signal,
      }
    )
      .then((res) => res.json())
      .then((res) => {
        const { start, numFound, docs } = res;
        setList(docs);
        setInfo({ start, numFound });
      })
      .catch((err) => {
        setError("Something wrong. Try another search");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (search) {
      handleChange(search);
    }
  }, [page]);

  useEffect(() => {
    createPagination(page);
  }, [list, page]);

  const createPagination = (page: number) => {
    const maxPageCount = Math.ceil((info?.numFound || 0) / BOOKS_PER_PAGE);
    let start = page > PAGES_COUNT / 2 ? page - PAGES_COUNT / 2 : 1;
    let end =
      start + PAGES_COUNT < maxPageCount ? start + PAGES_COUNT : maxPageCount;

    var pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    setPagination(pages);
  };

  const handleChange = (value: string) => {
    setList([]);
    setLoading(true);
    setError("");
    setSearch(value);
    debounceFn(value);
  };

  const debounceFn = useCallback(
    _debounce((val) => handleDebounceFn(val), 3000),
    [page]
  );

  const onHover = (isbn: ISBN) => {
    if (isbn) {
      fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`
      )
        .then((res) => res.json())
        .then((res) => setHoverinfo(res))
        .catch((err) => console.error(err));
    }
  };

  return (
    <>
      <h2>Search</h2>
      <button
        onClick={() => {
          setPage(1);
          handleChange("");
        }}
        disabled={!search}
        role="button"
      >
        Clear
      </button>
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setPage(1);
          handleChange(e.target.value);
        }}
        placeholder="Input book title"
        role="textbox"
        autoFocus
      />{" "}
      e.g.{" "}
      <a
        onClick={() => {
          setPage(1);
          handleChange("Hobbit");
        }}
        role="link"
      >
        Hobbit
      </a>
      {isLoading && <img src={loader} alt="loader" className={styles.loader} />}
      {error && <p>{error}</p>}
      {!!list.length && (
        <>
          {info && (
            <div className={styles.btns}>
              <p>
                Results {info.start + 1}-{info.start + list.length} from{" "}
                {info.numFound}
              </p>
              {info.start > 0 && (
                <button
                  onClick={() => {
                    setPage((page) => page - 1);
                  }}
                >
                  Prev
                </button>
              )}

              {pagination?.map((number, i) => (
                <button
                  key={i}
                  onClick={() => setPage(number)}
                  disabled={number == page}
                >
                  {number}
                </button>
              ))}

              {(page - 1) * BOOKS_PER_PAGE + list.length < info.numFound && (
                <button
                  onClick={() => {
                    setPage((page) => page + 1);
                  }}
                >
                  Next
                </button>
              )}
            </div>
          )}

          <ul role="list">
            {list.map((book) => {
              const hoverISBN = hoverinfo?.[`ISBN:${book?.isbn?.[0]}`];
              return (
                <li
                  key={book.key}
                  onMouseEnter={() => onHover(book?.isbn?.[0])}
                  onMouseLeave={() => setHoverinfo(null)}
                  role="listitem"
                >
                  <h3>{book.title}</h3>
                  <img
                    className={styles.cover2}
                    src={
                      book.cover_i
                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                        : noCover
                    }
                    loading="lazy"
                    role="contentinfo"
                  />
                  {/* <div
                    style={{
                      backgroundImage: book.cover_i
                        ? `url(https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg)`
                        : `url(${noCover})`,
                    }}
                    className={styles.cover}
                    role="contentinfo"
                  /> */}
                  <div className={styles.overlay}>
                    {hoverISBN && (
                      <>
                        {hoverISBN?.details.covers && (
                          <img
                            src={`https://covers.openlibrary.org/b/id/${hoverISBN.details.covers[0]}-L.jpg`}
                            alt=""
                            role="img"
                          />
                        )}

                        <div className={styles.overlay__text}>
                          <p>
                            <b>Title: </b>
                            {hoverISBN.details.title}
                          </p>
                          <p>
                            <b>Author: </b>
                            {hoverISBN.details.authors?.map(({ name }) => (
                              <span key={name}>
                                {name}
                                <br />
                              </span>
                            ))}
                          </p>
                          {hoverISBN.details.publish_date && (
                            <p>
                              <b>Date: </b>
                              {hoverISBN.details.publish_date}
                            </p>
                          )}
                          {hoverISBN.details.physical_format && (
                            <p>
                              <b>Physical format: </b>{" "}
                              {hoverISBN.details.physical_format}
                            </p>
                          )}
                          {hoverISBN.details.number_of_pages && (
                            <p>
                              <b>Number of pages: </b>{" "}
                              {hoverISBN.details.number_of_pages}
                            </p>
                          )}
                          {hoverISBN.details.weight && (
                            <p>
                              <b>Weight: </b>
                              {hoverISBN.details.weight}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};

export default Search;
