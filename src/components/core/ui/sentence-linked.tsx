import { Link } from "@nextui-org/react";
import React, { Fragment } from "react";

const SentenceLinked = ({
  sentence,
  toLink,
}: {
  sentence?: string | null;
  toLink?: string[];
}) => {
  if (sentence == null) return null;

  if (toLink == undefined) return sentence;

  return (
    <>
      {sentence.split(" ").map((word, index) => (
        <Fragment key={index}>
          {toLink.includes(word) ? (
            <Link href={`/explore/trend/${word}`}>
              <a>{word}</a>
            </Link>
          ) : (
            word
          )}{" "}
        </Fragment>
      ))}
    </>
  );
};

export default SentenceLinked;
