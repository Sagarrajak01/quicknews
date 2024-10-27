import React, { Component } from "react";
import NewsItem from "./NewsItem";
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: 'in',
    pagesize: 9
  };

  static propTypes = {
    country: PropTypes.string,
    pagesize: PropTypes.number
  };

  constructor() {
    super();
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
    };
  }

  async componentDidMount() {
    await this.fetchArticles();
  }

  async componentDidUpdate(prevProps) {
    // Refetch articles if `country` or `pagesize` props change
    if (prevProps.country !== this.props.country || prevProps.pagesize !== this.props.pagesize) {
      this.setState({ page: 1, articles: [] }, this.fetchArticles);
    }
  }

  fetchArticles = async () => {
    const { page } = this.state;
    const { pagesize, country } = this.props;
    this.setState({ loading: true });

    let url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=a4ab1123a99741c7a2c2b85129fdac77&page=${page}&pageSize=${pagesize}`;
    let data = await fetch(url);
    let parsedData = await data.json();

    const filteredArticles = parsedData.articles ? parsedData.articles.filter((article) => article.urlToImage) : [];

    this.setState({
      articles: this.state.articles.concat(filteredArticles),
      totalResults: parsedData.totalResults,
      loading: false,
    });
  };

  fetchMoreData = async () => {
    this.setState(
      (prevState) => ({ page: prevState.page + 1 }),
      this.fetchArticles
    );
  };

  render() {
    const { articles } = this.state;

    return (
      <div className="container my-3">
        <h1 className="text-center">Top Headlines</h1>
        <InfiniteScroll
          dataLength={articles.length}
          next={this.fetchMoreData}
          hasMore={articles.length !== this.state.totalResults}
          loader={<h4>Loading...</h4>}
        >
          <div className="row">
            {articles.map((element, index) => (
              <div className="col-md-4" key={`${element.url}-${index}`}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 45) : " "}
                  description={element.description ? element.description.slice(0, 88) : " "}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}

export default News;