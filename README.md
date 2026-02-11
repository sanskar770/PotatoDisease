PlantDoc AI is a modern web application that uses deep learning to detect and classify potato leaf diseases. The system analyzes uploaded images and provides instant diagnosis with confidence scores and treatment recommendations. Built with TensorFlow's EfficientNet architecture, the model achieves 90%+ accuracy in classifying three disease states.

🎬 Demo
Live Demo
🌐 URL: http://http://3.110.29.37:5000 

Try It Yourself
bash# Clone the repository
git clone https://github.com/yourusername/potato-disease-detection.git

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py

# Open browser at http://localhost:5000

🛠️ Technology Stack
Backend

Python 3.8+: Core programming language
Flask 3.0: Web framework
TensorFlow 2.15: Deep learning framework
Keras: High-level neural networks API
Gunicorn: WSGI HTTP server for production

Machine Learning

EfficientNet: Pre-trained CNN architecture (transfer learning)
NumPy: Numerical computing
Pillow (PIL): Image processing

Frontend

HTML5: Structure and semantic markup
CSS3: Styling with custom animations
JavaScript (Vanilla): Interactive functionality
Google Fonts: Typography (Syne, DM Sans)

Deployment

AWS EC2: Cloud hosting
Nginx: Reverse proxy and web server
Ubuntu 22.04 LTS: Operating system
Systemd: Service management
Let's Encrypt: SSL/TLS certificates

Development Tools

Git: Version control
pip: Package management
Virtual Environment: Dependency isolation




