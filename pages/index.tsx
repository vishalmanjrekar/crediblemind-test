import { useState } from "react";
import Head from "next/head";
import { Pagination } from "@mui/material";
import Link from "next/link";
import { AiOutlineSearch } from 'react-icons/ai';
import type, { GetServerSideProps, InferGetServerSidePropsType } from "next";
import AlgoliaSearch from "../lib/algoliaService";
import Contentful from "../lib/contentfulService";
import Nav from "../components/Nav";
import NewsCard from "../components/NewsCard";
import { News, NewsConfig } from "../types";
import styles from "../styles/Home.module.css";

const Home = ({ newsConfig, news: newsData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [news, setNews] = useState(newsData);
  const [page, setPage] = useState(0);
  const [searchItem, setSearchItem] = useState('');

  const newsIndex = AlgoliaSearch.initIndex('news');

  return (
    <div className={styles.container}>
      <Head>
        <title>Credible Mind</title>
        <meta name="description" content="Credible Mind news" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Nav
          menu={newsConfig.menuLabel}
          logoUrl={newsConfig.logo.fields.file.url}
        />
        <div className={styles.contentContainer}>
          <h1 style={{ textAlign: 'center' }}>{newsConfig.ttile}</h1>
          <div className={styles.newsContainer}>
            <div className={styles.newsLeft}>
              <div className={styles.filterContainer}>
                <span className={styles.searchLabel}>{newsConfig.searchLabel}</span>
                <div className={styles.searchInput}>
                  <input
                      placeholder="Search"
                      type="text"
                      className={styles.mainInput}
                      value={searchItem}
                      onChange={(e) => setSearchItem(e.target.value)}
                  />
                  <button
                      className={styles.searchButton}
                      onClick={async () => {
                        try {
                          setPage(0);
                          const res = await newsIndex.search(searchItem, {
                            page: 0,
                          });
                          setNews(res);
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                  >
                    <AiOutlineSearch color={'white'} width={12} height={12} />
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.newsRight}>
              {
                news.hits.length === 0 ?
                    <h4>No News matches your search criteria </h4>
                : news.hits.map((individualNews: News) => {
                return (
                  <Link
                    key={individualNews.name}
                    href={`/news/${individualNews.slug}`}
                    passHref={true}
                  >
                    <a>
                      <NewsCard
                        imageUrl={individualNews.imageUrl}
                        publicationDate={individualNews.publicationDate}
                        organization={individualNews.organization}
                        description={individualNews.description}
                        name={individualNews.name}
                        topics={individualNews.topics}
                      />
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className={styles.paginationContainer}>
            <Pagination
              count={news.nbPages}
              color="primary"
              page={page + 1}
              onChange={async (event: any, page: number) => {
                setPage(page - 1);
                // Search for new page.
                const news = await newsIndex.search(searchItem, {
                  page: page - 1,
                });
                setNews(news);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{ newsConfig: NewsConfig, news: any }> = async () => {
  const newsIndex = AlgoliaSearch.initIndex('news');
  const newsConfig = await Contentful.getEntries<NewsConfig>({ content_type: 'newsConfig' });
  const news = await newsIndex.search('', { page: 0 });

  return {
    props: {
      // Only send require data.
      newsConfig: newsConfig.items[0].fields,
      news,
    },
  };
};

export default Home;
