// PianoArticlesPage.js
import React from 'react';

const articlesData = [
  {
    id: 21703,
    title: "Cập Nhật Bảng Giá Đàn Piano Yamaha Chính Hãng Mới Nhất",
    link: "https://nhaccutienmanh.vn/cap-nhat-bang-gia-dan-piano-yamaha-chinh-hang-moi-nhat-tien-manh/",
    imgSrc: "https://nhaccutienmanh.vn/wp-content/uploads/2020/07/cap-nhat-bang-gia-dan-piano-yamaha-chinh-hang-moi-nhat-1-2.jpg",
    publishDate: "2020-07-12",
    updateDate: "2020-08-13",
    author: "Nhạc cụ Tiến Mạnh",
    description: "Hiện nay, piano Yamaha được xem là nhạc cụ được sử dụng thịnh thành rất rộng rãi ở thị trường Việt Nam và trên toàn thế giới. Với thiết kế đa dạng, bắt mắt cùng âm thanh chất lượng và...",
  },
  {
    id: 21385,
    title: "Giá Đàn Piano Roland Mới Cập Nhật 2020",
    link: "https://nhaccutienmanh.vn/gia-dan-piano-roland-moi-cap-nhat-2020/",
    imgSrc: "https://nhaccutienmanh.vn/wp-content/uploads/2020/07/cap-nhat-gia-dan-piano-roland-moi-nhat-hien-nay.jpg",
    publishDate: "2020-07-11",
    updateDate: "2020-07-11",
    author: "Nhạc cụ Tiến Mạnh",
    description: "Piano Roland với nhiều mẫu mã mới cập nhật 2020 mang lại trải nghiệm âm thanh chất lượng cao...",
  },
  {
    id: 21123,
    title: "Giá Đàn Piano Các Loại từ A Đến Z Trên Thị Trường Hiện Nay",
    link: "https://nhaccutienmanh.vn/gia-dan-piano-cac-loai-tu-a-den-z-tren-thi-truong-hien-nay/",
    imgSrc: "https://nhaccutienmanh.vn/wp-content/uploads/2020/07/gia-dan-piano-hien-nay-co-dat-hay-khong.jpg",
    publishDate: "2020-07-07",
    updateDate: "2020-07-27",
    author: "Nhạc cụ Tiến Mạnh",
    description: "Tìm Hiểu Giá Đàn Piano bao nhiêu là tốt có lẽ là một vấn đề vô cùng đau đầu Đối với những người muốn tìm kiếm và sở hữu một cây piano. Bởi trên thị trường có quá nhiều loại...",
  },
  {
    id: 20829,
    title: "Đàn Piano Cho Bé Bật Mí Cách Chọn Piano Chất Lượng Giá Phải Chăng",
    link: "https://nhaccutienmanh.vn/dan-piano-cho-be-bat-mi-cach-chon-piano-chat-luong/",
    imgSrc: "https://nhaccutienmanh.vn/wp-content/uploads/2020/06/bat-mi-bi-quyet-chon-dan-piano-cho-be-phu-hop-hieu-qua-2.jpg",
    publishDate: "2020-06-18",
    updateDate: "2020-07-16",
    author: "Nhạc cụ Tiến Mạnh",
    description: "Nhu cầu cho trẻ nhỏ học đàn đang được rất bậc cha mẹ quan tâm và đầu tư. Bởi lẽ, bên cạnh những kiến thức quan trọng ở trường lớp thì các năng khiếu âm nhạc cũng rất cần...",
  },
  {
    id: 20777,
    title: "Đàn Piano Mini Cho Bé Mẹo Chọn Piano Chất Lượng Giá Rẻ",
    link: "https://nhaccutienmanh.vn/dan-piano-mini-cho-be-chat-luong-gia-re/",
    imgSrc: "https://nhaccutienmanh.vn/wp-content/uploads/2020/06/meo-chon-dan-piano-mini-chat-luong-gia-tot-cho-be-compressed.jpg",
    publishDate: "2020-06-17",
    updateDate: "2020-07-16",
    author: "Nhạc cụ Tiến Mạnh",
    description: "Thời đại 4.0 hiện nay, đa số cha mẹ đều muốn cho con học thêm piano bên cạnh các môn văn hóa ở trường học. Tuy nhiên để bé học hiệu quả nhất thì không chỉ chọn trung tâm đào...",
  },
];

// Article component
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

// Main PianoArticlesPage component
const PianoArticlesPage = () => {
  return (
    <div className="container">
     <div className='cartPage'>
          <div className="row">
            <div className="col-12">
              <h1 className="page-title">Bài viết về đàn Piano <span className="post-count">({articlesData.length} bài viết)</span></h1>
              <div className="articles-list">
                {articlesData.map((article) => (
                  <Article key={article.id} {...article} />
                ))}
              </div>
            </div>
          </div>
     </div>
    </div>
  );
};

export default PianoArticlesPage;
