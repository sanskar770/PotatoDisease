from flask import Flask, render_template, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import os
from tensorflow.keras.applications import efficientnet
import logging
from werkzeug.utils import secure_filename

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max file size
app.config['UPLOAD_FOLDER'] = "static/uploads"
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'webp'}

# Create upload directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load model
MODEL_PATH = os.environ.get('MODEL_PATH', 'model_balanced_final.h5')
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    logger.info(f"✅ Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    logger.error(f"❌ Error loading model: {str(e)}")
    model = None

CLASS_NAMES = [
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy"
]

IMG_SIZE = 224


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


def prepare_image(img_path):
    """Prepare image for model prediction"""
    try:
        # Open and convert image
        img = Image.open(img_path).convert("RGB")
        img = img.resize((IMG_SIZE, IMG_SIZE))
        
        # Convert to array
        arr = np.array(img)
        
        # Apply EfficientNet preprocessing
        arr = efficientnet.preprocess_input(arr)
        arr = np.expand_dims(arr, axis=0)
        
        return arr
    except Exception as e:
        logger.error(f"Error preparing image: {str(e)}")
        return None


@app.route("/", methods=["GET", "POST"])
def home():
    """Main route for home page and predictions"""
    result = None
    confidence = None
    img_path = None
    error = None

    if request.method == "POST":
        try:
            # Check if model is loaded
            if model is None:
                error = "Model not loaded. Please contact administrator."
                logger.error("Prediction attempted but model is None")
                return render_template("index.html", error=error)
            
            # Check if file is in request
            if 'image' not in request.files:
                error = "No file uploaded"
                return render_template("index.html", error=error)
            
            file = request.files['image']
            
            # Check if file is selected
            if file.filename == '':
                error = "No file selected"
                return render_template("index.html", error=error)
            
            # Validate file type
            if not allowed_file(file.filename):
                error = "Invalid file type. Please upload PNG, JPG, JPEG, or WEBP"
                return render_template("index.html", error=error)
            
            # Secure the filename
            filename = secure_filename(file.filename)
            
            # Save file
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            logger.info(f"File saved: {file_path}")
            
            # Prepare image for prediction
            prepared_img = prepare_image(file_path)
            
            if prepared_img is None:
                error = "Error processing image"
                return render_template("index.html", error=error)
            
            # Make prediction
            prediction = model.predict(prepared_img, verbose=0)[0]
            
            # Get result
            idx = np.argmax(prediction)
            result = CLASS_NAMES[idx]
            confidence = round(float(prediction[idx]) * 100, 2)
            img_path = file_path
            
            logger.info(f"Prediction: {result} with {confidence}% confidence")
            
        except Exception as e:
            error = f"An error occurred: {str(e)}"
            logger.error(f"Error during prediction: {str(e)}", exc_info=True)

    return render_template(
        "index.html",
        result=result,
        confidence=confidence,
        image=img_path,
        error=error
    )


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint for monitoring"""
    if model is None:
        return jsonify({
            "status": "unhealthy",
            "message": "Model not loaded"
        }), 503
    
    return jsonify({
        "status": "healthy",
        "message": "Application is running",
        "model_loaded": True
    }), 200


@app.errorhandler(413)
def too_large(e):
    """Handle file too large error"""
    return render_template(
        "index.html",
        error="File too large. Maximum size is 10MB"
    ), 413


@app.errorhandler(500)
def internal_error(e):
    """Handle internal server errors"""
    logger.error(f"Internal server error: {str(e)}", exc_info=True)
    return render_template(
        "index.html",
        error="Internal server error. Please try again."
    ), 500


if __name__ == "__main__":
    # Get configuration from environment variables
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    
    logger.info(f"Starting application on {host}:{port}")
    logger.info(f"Debug mode: {debug_mode}")
    
    app.run(
        host=host,
        port=port,
        debug=debug_mode
    )