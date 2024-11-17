import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
from tensorflow.keras.models import Model

# Tải mô hình VGG16 đã huấn luyện sẵn
base_model = VGG16(weights='imagenet')
model = Model(inputs=base_model.input, outputs=base_model.get_layer('fc2').output)

def extract_features(image_path, is_url=True):
    """Trích xuất đặc trưng từ ảnh, hỗ trợ cả URL hoặc đường dẫn file"""
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    # Trích xuất đặc trưng từ mô hình VGG16
    features = model.predict(img_array)
    
    return features.flatten()  # Trả về một mảng đặc trưng
