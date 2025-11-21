from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

# Inicializar extensions
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    # Configurações
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'masterkey'
    
    # Inicializar extensions com o app
    db.init_app(app)
    CORS(app)
    
    return app

app = create_app()

# Model dentro do app.py para simplificar
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            'created_at': self.created_at.isoformat()
        }

# Criar tabelas
with app.app_context():
    db.create_all()

# Rota raiz para teste
@app.route('/')
def home():
    return jsonify({'message': 'Backend Flask funcionando!', 'status': 'OK'})

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'message': 'Backend funcionando!'})

# GET todas as tarefas
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        tasks = Task.query.order_by(Task.created_at.desc()).all()
        return jsonify([task.to_dict() for task in tasks])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# POST criar nova tarefa
@app.route('/api/tasks', methods=['POST'])
def create_task():
    try:
        data = request.get_json()
        
        if not data or 'title' not in data:
            return jsonify({'error': 'Título é obrigatório'}), 400
        
        new_task = Task(
            title=data['title'],
            description=data.get('description', ''),
            completed=data.get('completed', False)
        )
        
        db.session.add(new_task)
        db.session.commit()
        
        return jsonify(new_task.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# PUT atualizar tarefa
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        task = Task.query.get_or_404(task_id)
        data = request.get_json()
        
        if 'title' in data:
            task.title = data['title']
        if 'description' in data:
            task.description = data['description']
        if 'completed' in data:
            task.completed = data['completed']
        
        db.session.commit()
        return jsonify(task.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# DELETE tarefa
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task deletada com sucesso', 'id': task_id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# PATCH alternar conclusão
@app.route('/api/tasks/<int:task_id>/toggle', methods=['PATCH'])
def toggle_task(task_id):
    try:
        task = Task.query.get_or_404(task_id)
        task.completed = not task.completed
        db.session.commit()
        return jsonify(task.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Iniciando servidor Flask na porta 5000...")
    print("📊 Acesse: http://localhost:5000/")
    print("🔍 Health check: http://localhost:5000/api/health")
    app.run(debug=True, host='0.0.0.0', port=5000)