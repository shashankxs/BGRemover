from flask import Flask, request, send_file
from rembg import remove
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/remove-background', methods=['POST'])
def remove_background():
    try:
        if 'image_file' not in request.files:
            return 'No image file provided', 400

        image_file = request.files['image_file']

        # Log the filename for debugging
        print(f"Processing file: {image_file.filename}")

        # Read the image file
        input_image = image_file.read()

        # Ensure the file is not empty
        if not input_image:
            return 'Empty image file', 400

        # Process the image using rembg to remove the background
        output_image = remove(input_image)

        # Prepare the processed image to be sent back to the client
        return send_file(
            BytesIO(output_image),
            mimetype='image/png',
            as_attachment=True,
            download_name='result.png'  # Changed to 'download_name'
        )
    
    except Exception as e:
        print(f"Error processing image: {str(e)}")  # Log the error in terminal
        return f'Internal Server Error: {str(e)}', 500  # Return the error message

if __name__ == '__main__':
    app.run(debug=True)
