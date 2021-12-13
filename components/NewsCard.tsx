import React, { ReactElement } from "react";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

import styles from "../styles/Card.module.css";

interface Props {
  topics: any[];
  name: string;
  description: string;
  publicationDate: string;
  organization: any[];
  imageUrl: string;
}

dayjs.extend(customParseFormat);

function NewsCard({
  topics,
  name,
  description,
  publicationDate,
  organization,
  imageUrl,
}: Props): ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <img
          src={imageUrl}
          className={styles.image}
          alt={name}
        />
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.topicContainer}>
          {topics.map((topic) => {
            return (
              <span
                className={styles.individualTopic}
                key={topic.id}
              >
                  {topic.title}
              </span>
            );
          })}
        </div>
        <div className={styles.name}>{name}</div>
        <p className={styles.description}>{description}</p>
        <div className={styles.end}>
          <span className={styles.publicationDate}>{dayjs(publicationDate).format('MMM DD, YYYY').toString()}</span>
          <div>
            {organization.map((org) => {
              return (
                <span
                  key={org.fields.name}
                  className={styles.orgName}
                >
                  {org.fields.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;
