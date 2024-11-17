// ViolinArticlesPage.js
import React from 'react';

// Violin-specific articles data
const violinArticlesData = [
  {
    id: 14306,
    title: "Dây Đàn Violin Lựa Chọn Như Thế Nào?",
    link: "https://nhaccutienmanh.vn/day-dan-violin-lua-chon-nhu-the-nao/",
    imgSrc: "https://nhaccutienmanh.vn/wp-content/uploads/2019/12/huong-dan-lua-chon-day-dan-violin.png",
    publishDate: "2019-12-25",
    updateDate: "2021-03-11",
    author: "Nhạc cụ Tiến Mạnh",
    description: "Dây đàn violin được lựa chọn như thế nào? Những loại dây đàn violin. Thương hiệu nổi tiếng bán dây đàn violin",
  },
  // Add more violin articles if needed
];

// Article component reused from PianoArticlesPage
const Article = ({ title, link, imgSrc, publishDate, updateDate, author, description }) => {
  return (
    <article className="article">
      <header>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <img src={imgSrc} alt={title} className="article-image" />
        </a>
      </header>
      <div className="article-content">
        <h3 className="article-title">
          <a href={link} target="_blank" rel="noopener noreferrer">{title}</a>
        </h3>
        <div className="article-meta">
          <span className="article-date">
            <i className="far fa-calendar-alt"></i> Published: {publishDate}
          </span>
          <span className="article-update-date">
            <i className="far fa-sync-alt"></i> Updated: {updateDate}
          </span>
          <span className="article-author">
            <i className="far fa-user-tag"></i> {author}
          </span>
        </div>
        <p className="article-description">{description}</p>
      </div>
    </article>
  );
};

// ViolinArticlesPage component
const ViolinArticlesPage = () => {
  return (
    <div className="container">
      <div className='cartPage2'>
          <div className="row">
            <div className="col-12">
              <h1 className="page-title">Bài viết về đàn Violin <span className="post-count">({violinArticlesData.length} bài viết)</span></h1>
              <div className="articles-list">
                {violinArticlesData.map((article) => (
                  <Article key={article.id} {...article} />
                ))}
              </div>
            </div>
      </div>
      </div>
    </div>
  );
};

export default ViolinArticlesPage;
