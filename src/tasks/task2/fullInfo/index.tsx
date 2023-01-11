import { useEffect, useState } from "react";

import { FullinfoI } from "../../../interfaces";
import noCover from "../../../assets/no-cover.jpg";
import styles from "./index.module.css";

export const BOOK_ID = "ISBN:9783442236862";

const Fullinfo = () => {
  const [fullinfo, setFullinfo] = useState<null | FullinfoI>(null);

  useEffect(() => {
    fetch(
      `https://openlibrary.org/api/books?bibkeys=${BOOK_ID}&jscmd=details&format=json`
    )
      .then((res) => res.json())
      .then((res) => setFullinfo(res[BOOK_ID]))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <h2>Full info</h2>
      {fullinfo && (
        <div className={styles.fullInfo}>
          <img
            src={
              fullinfo.details.covers
                ? `https://covers.openlibrary.org/b/id/${fullinfo.details.covers[0]}-L.jpg`
                : noCover
            }
            alt=""
            role="img"
          />
          <div>
            <p>
              <b>Title</b>: <i>{fullinfo.details.title}</i>
            </p>
            <p>
              <b>Author</b>:{" "}
              {fullinfo.details.authors.map(({ name }) => (
                <span key={name}>
                  {name}
                  <br />
                </span>
              ))}
            </p>
            {fullinfo.details.publish_date && (
              <p>
                <b>Date</b>: {fullinfo.details.publish_date}
              </p>
            )}
            {fullinfo.details.physical_format && (
              <p>
                <b>Physical format</b>: {fullinfo.details.physical_format}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Fullinfo;
