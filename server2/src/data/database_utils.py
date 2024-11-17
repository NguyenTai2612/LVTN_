import numpy as np
from scipy.spatial.distance import cosine
from feature_extraction import extract_features  # Nhập khẩu hàm trích xuất đặc trưng

def update_product_features(connection):
    cursor = connection.cursor()
    cursor.execute("SELECT id, imageUrl FROM ProductImages")
    products = cursor.fetchall()

    for product_id, image_url in products:
        features = extract_features(image_url, is_url=True)
        if features is not None:
            features_str = ','.join(map(str, features))
            cursor.execute(
                "UPDATE Products SET features=%s WHERE id=%s",
                (features_str, product_id)
            )
            connection.commit()
            print(f"Đã cập nhật đặc trưng cho sản phẩm ID: {product_id}")
        else:
            print(f"Không thể xử lý ảnh sản phẩm ID: {product_id}")

def find_similar_products(connection, uploaded_image_path, is_url=False, top_n=5):
    # Trích xuất đặc trưng từ ảnh tải lên
    query_features = extract_features(uploaded_image_path, is_url=is_url)
    if query_features is None:
        print("Không thể trích xuất đặc trưng từ ảnh tải lên.")
        return []

    # Lấy danh sách đặc trưng từ cơ sở dữ liệu
    cursor = connection.cursor()
    cursor.execute("SELECT id, name, features FROM Products WHERE features IS NOT NULL")
    products = cursor.fetchall()

    # Tính độ tương đồng
    similarities = []
    for product in products:
        product_id, product_name, product_features = product
        product_features_array = np.fromstring(product_features, sep=',')
        similarity = 1 - cosine(query_features, product_features_array)
        similarities.append((product_id, product_name, similarity))

    # Sắp xếp và trả về top N
    similarities = sorted(similarities, key=lambda x: x[2], reverse=True)[:top_n]
    return similarities
