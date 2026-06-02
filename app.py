import sqlite3
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
DATABASE = 'catlicker.db'
adminPass = '676767'


def init_db():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS players(
                           id INTEGER PRIMARY KEY AUTOINCREMENT,
                           username TEXT NOT NULL UNIQUE,
                           clicks INTEGER DEFAULT 0)
                       ''')
        conn.commit()


init_db()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/gameinfo.html')
def gameinfo():
    return render_template('gameinfo.html')


@app.route('/about.html')
def about():
    return render_template('about.html')


@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    sort_by = request.args.get('sort', 'clicks')
    order = 'DESC' if sort_by == 'clicks' else 'ASC'

    if sort_by not in ['username', 'clicks']:
        sort_by = 'clicks'

    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute(f'SELECT username, clicks FROM players ORDER BY {sort_by} {order}')
        players = [{'username': row[0], 'clicks': row[1]} for row in cursor.fetchall()]
    return jsonify(players)


@app.route('/api/click', methods=['POST'])
def save_click():
    data = request.json
    username = data.get('username', 'Anonymous cat')
    clicks = data.get('clicks', 0)

    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
                       INSERT INTO players (username, clicks)
                       VALUES (?, ?) ON CONFLICT(username) DO
                       UPDATE SET clicks = max (clicks, excluded.clicks)
                       ''', (username, clicks))
        conn.commit()
    return jsonify({'status': 'success'})


@app.route('/api/admin/delete-player', methods=['POST'])
def admin_delete():
    data = request.json
    username = data.get('username')
    secret = data.get('secret')

    if secret != adminPass:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403

    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM players WHERE username = ?', (username,))
        conn.commit()
    return jsonify({'status': 'deleted'})


@app.route('/api/admin/update-clicks', methods=['POST'])
def admin_update_clicks():
    data = request.json
    username = data.get('username')
    clicks = data.get('clicks')
    secret = data.get('secret')

    if secret != adminPass:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403

    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO players (username, clicks) 
            VALUES (?, ?)
            ON CONFLICT(username) DO UPDATE SET clicks = excluded.clicks
        ''', (username, clicks))
        conn.commit()
    return jsonify({'status': 'updated'})

if __name__ == '__main__':
    app.run(debug=True)