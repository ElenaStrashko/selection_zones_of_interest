from flask import Flask, render_template, Response, request

from modules.Camera import Camera
from modules.change_data_format import change_data_format


app = Flask(__name__, static_folder='build', static_url_path='', template_folder='build')


def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed')
def video_feed():
    return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/', methods=['POST', 'GET'])
def hello_world():
    if request.method == 'POST':
        posted_data = request.get_json(force=True, silent=True)

        result = change_data_format(posted_data)

        with open('data.txt', 'w') as outfile:
            outfile.write(result)

    return render_template('index.html')


print('start server')
app.run(host='0.0.0.0')

