import React, {useEffect, useState} from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

    const updateNews = async () => {
        props.setProgress(10);
        const url = `https://api.thenewsapi.com/v1/news/top?api_token=2IezmQzulfXEj2dH4fUOc7uphUukvFAqnqxSBerE&locale=${props.country}&categories=${props.category}&limit=${props.pageSize}&page=${page}`; 
        setLoading(true);
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(70);

        setArticles(parsedData.data);
        setTotalResults(parsedData.meta.found);
        setLoading(false);
        props.setProgress(100);
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - QuickByte News`;
        updateNews();
        // eslint-disable-next-line
    }, []);

    const fetchMoreData = async () => {   
        const url = `https://api.thenewsapi.com/v1/news/top?api_token=2IezmQzulfXEj2dH4fUOc7uphUukvFAqnqxSBerE&locale=${props.country}&categories=${props.category}&limit=${props.pageSize}&page=${page + 1}`;
        setPage(page + 1);
        let data = await fetch(url);
        let parsedData = await data.json();

        setArticles(articles.concat(parsedData.data));
        setTotalResults(parsedData.meta.found);
    };

    return (
        <>
            <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>
                QuickByte News - Top {capitalizeFirstLetter(props.category)} Headlines
            </h1>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length < totalResults}
                loader={<Spinner />}
            >
                <div className="container">
                    <div className="row">
                        {articles.map((element) => (
                            <div className="col-md-4" key={element.uuid}>
                                <NewsItem
                                    title={element.title || "No title available"}
                                    description={element.description || "No description available"}
                                    imageUrl={element.image_url || "https://via.placeholder.com/150"}
                                    newsUrl={element.url}
                                    author={element.author || "Unknown"}
                                    date={element.published_at || "Unknown date"}
                                    source={element.source || "Unknown source"}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    );
}

News.defaultProps = {
    country: 'us', // Adjusted to use 'locale' parameter which expects 'us' for United States.
    pageSize: 3,  // Default limit set to 3 as per the API request.
    category: 'general', // Matches 'categories' parameter in the API.
};

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    apiKey: PropTypes.string.isRequired,
    setProgress: PropTypes.func.isRequired,
};

export default News;
