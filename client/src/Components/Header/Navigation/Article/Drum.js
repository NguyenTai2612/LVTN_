// DrumArticlesPage.js
import React from 'react';

// Drum-specific articles data
const drumArticlesData = [
  {
    id: 17133,
    title: "Mách Nhỏ Kinh Nghiệm Mua Trống Trẻ Em Cực Kỳ Hữu Ích",
    link: "https://nhaccutienmanh.vn/kinh-nghiem-mua-trong-tre-em-cuc-ky-huu-ich/",
    imgSrc: "https://nhaccutienmanh.vn/wp-content/uploads/2020/02/mach-nho-kinh-nghiem-mua-trong-tre-em-cuc-ky-huu-ich.jpg",
    publishDate: "2020-02-21",
    updateDate: "2021-03-11",
    author: "Nhạc cụ Tiến Mạnh",
    description: "Trống là loại nhạc cụ đem đến cho người chơi rất nhiều cung bậc cảm xúc khác nhau. Chơi trống là bộ môn thú vị phù hợp với rất nhiều độ tuổi đặc biệt là trẻ nhỏ. Chúng giúp kích...",
  },
  {
    id: 17121,
    title: "Tất Tần Tật Kinh Nghiệm Về Trống Jazz Mà Bạn Nên Biết",
    link: "https://nhaccutienmanh.vn/tat-tan-tat-kinh-nghiem-ve-trong-jazz-ma-ban-nen-biet/",
    imgSrc: "https://nhaccutienmanh.vn/wp-content/uploads/2020/02/tat-tan-tat-kinh-nghiem-ve-trong-jazz-ma-ban-nen-biet.jpg",
    publishDate: "2020-02-21",
    updateDate: "2021-03-11",
    author: "Nhạc cụ Tiến Mạnh",
    description: "Trống Jazz là bộ trống đã xuất hiện trên thị trường nhạc cụ từ rất lâu. Sở hữu thiết kế sang trọng, đẳng cấp, âm thanh chuyên nghiệp. Rất nhiều bạn trẻ đã có niềm đam mê không hề nhỏ...",
  },
  {
    id: 16563,
    title: "Bộ Trống Cajon Là Gì Và Những Điều Nhất Định Phải Biết",
    link: "https://nhaccutienmanh.vn/bo-trong-cajon-la-gi/",
    imgSrc: "https://nhaccutienmanh.vn/wp-content/uploads/2020/02/trong-cajon-la-gi-va-nhung-dieu-nhat-dinh-phai-biet.jpg",
    publishDate: "2020-02-07",
    updateDate: "2021-03-11",
    author: "Nhạc cụ Tiến Mạnh",
    description: "Trong rất nhiều các loại trống trên thị trường hiện nay thì bộ trống cajon được biết đến là nhạc cụ trống drum có thiết kế khá độc đáo. Âm thanh mà chúng mang đến thường rất vui nhộn. Để giúp...",
  },
  {
    id: 16365,
    title: "Tìm Hiểu Về Giá Trống Điện Tử Trên Thị Trường Hiện Nay Khoảng Bao Nhiêu?",
    link: "https://nhaccutienmanh.vn/tim-hieu-gia-trong-dien-tu-tren-thi-truong/",
    imgSrc: "https://nhaccutienmanh.vn/wp-content/uploads/2020/02/tim-hieu-ve-gia-trong-dien-tu-tren-thi-truong-hien-nay-khoang-bao-nhieu.jpg",
    publishDate: "2020-02-03",
    updateDate: "2021-03-11",
    author: "Nhạc cụ Tiến Mạnh",
    description: "Trống điện tử được biết đến là dòng nhạc cụ rất thịnh hành và được sử dụng rất nhiều hiện nay. Cũng bởi lẽ đó mà giá trống điện tử khoảng bao nhiêu đang dần trở thành sự quan tâm...",
  },
];

// Article component (reusable)
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

// DrumArticlesPage component
const DrumArticlesPage = () => {
  return (
    <div className="container">
      <div className='cartPage'>
          <div className="row">
            <div className="col-12">
              <h1 className="page-title">Bài viết về Trống <span className="post-count">({drumArticlesData.length} bài viết)</span></h1>
              <div className="articles-list">
                {drumArticlesData.map((article) => (
                  <Article key={article.id} {...article} />
                ))}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default DrumArticlesPage;
