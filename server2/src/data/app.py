# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from tensorflow.keras.models import load_model
# from tensorflow.keras.utils import load_img, img_to_array
# import numpy as np
# import os
# from io import BytesIO

# app = Flask(__name__)
# CORS(app)  # Bật CORS cho toàn bộ ứng dụng

# MODEL_PATH = r'C:\Users\Tai Nguyen\Desktop\fullstack-ecom\server2\src\data\vgg16_model.h5'
# model = load_model(MODEL_PATH)

# classes = ['Amplifier', 'Guitar', 'Kèn', 'Organ', 'Piano', 'Trống', 'Ukulele', 'Violin']

# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         if 'file' not in request.files:
#             return jsonify({"error": "No file uploaded"}), 400

#         file = request.files['file']
#         if file.filename == '':
#             return jsonify({"error": "No file selected"}), 400

#         image = load_img(BytesIO(file.read()), target_size=(224, 224))
#         image = img_to_array(image)
#         image = np.expand_dims(image, axis=0) / 255.0

#         predictions = model.predict(image)
#         class_idx = np.argmax(predictions[0])
#         class_name = classes[class_idx]
#         confidence = predictions[0][class_idx]

#         return jsonify({"class": class_name, "confidence": float(confidence)})
#     except Exception as e:
#         import traceback
#         print(traceback.format_exc())
#         return jsonify({"error": f"Internal server error: {str(e)}"}), 500

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import load_img, img_to_array
import numpy as np
from io import BytesIO

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})

# Đường dẫn tới các mô hình
MODELS = {
    "vgg16_model": r'C:\Users\Tai Nguyen\Desktop\fullstack-ecom\server2\src\data\vgg16_model.h5',
    "mobilenet_model": r'C:\Users\Tai Nguyen\Desktop\fullstack-ecom\server2\src\data\mobilenet_model.h5',
    "resnet_model": r'C:\Users\Tai Nguyen\Desktop\fullstack-ecom\server2\src\data\ResNet_model (1).h5',
}

# Tải các mô hình vào bộ nhớ
models = {name: load_model(path) for name, path in MODELS.items()}

# Các lớp nhạc cụ
classes = ['Amplifier', 'Guitar', 'Kèn', 'Organ', 'Piano', 'Trống', 'Ukulele', 'Violin']

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files or 'model' not in request.form:
            return jsonify({"error": "File hoặc model không hợp lệ"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        selected_model = request.form['model']
        if selected_model not in models:
            return jsonify({"error": "Model không hợp lệ"}), 400

        # Xử lý ảnh
        image = load_img(BytesIO(file.read()), target_size=(224, 224))
        image = img_to_array(image)
        image = np.expand_dims(image, axis=0) / 255.0

        # Chọn mô hình để dự đoán
        model = models[selected_model]
        predictions = model.predict(image)
        class_idx = np.argmax(predictions[0])
        class_name = classes[class_idx]
        confidence = predictions[0][class_idx]

        return jsonify({"class": class_name, "confidence": float(confidence)})
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
