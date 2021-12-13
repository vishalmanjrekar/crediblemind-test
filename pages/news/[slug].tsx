import { GetServerSideProps } from 'next';
import NewsCard from '../../components/NewsCard';
import AlgoliaSearch from '../../lib/algoliaService';
import styles from '../../styles/Home.module.css';

interface Props {
  news: any;
}

function News({ news }: Props): JSX.Element {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <NewsCard
          name={news.name}
          imageUrl={news.imageUrl}
          publicationDate={news.publicationDate}
          organization={news.organization}
          topics={news.topics}
          description={news.description}
        />
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{news: any }> = async (context) => {
  const newsIndex = AlgoliaSearch.initIndex('news');
  const news = await newsIndex.search(context.query.slug as string);
  if (news.nbHits >= 1) {
    return {
      props: {
        // Send most relevant news.
        news: news.hits[0],
      },
    };
  }

  // If no news are found, send 404.
  return {
    notFound: true,
  };
};

export default News;
