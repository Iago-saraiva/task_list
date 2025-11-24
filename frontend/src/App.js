import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import './index.css';

// Serviço da API
const API_BASE = 'http://localhost:5000/api';

const taskService = {
  async getTasks() {
    const response = await fetch(`${API_BASE}/tasks`);
    return await response.json();
  },

  async createTask(taskData) {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: taskData.text,
        description: '',
        completed: taskData.completed || false
      }),
    });
    return await response.json();
  },

  async updateTask(taskId, taskData) {
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: taskData.text,
        description: '',
        completed: taskData.completed
      }),
    });
    return await response.json();
  },

  async deleteTask(taskId) {
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'DELETE',
    });
    return await response.json();
  },

  async toggleTask(taskId, completed) {
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed: !completed
      }),
    });
    return await response.json();
  }
};

function App() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [editIndex, setEditIndex] = useState(null);
    const [taskInput, setTaskInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Carregar tarefas do backend
    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const tasksData = await taskService.getTasks();
            // Adaptar para o formato do seu frontend
            const formattedTasks = tasksData.map(task => ({
                id: task.id,
                text: task.title,
                completed: task.completed,
                created_at: task.created_at
            }));
            setTasks(formattedTasks);
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            alert('Erro ao carregar tarefas. Verifique se o backend está rodando.');
        } finally {
            setLoading(false);
        }
    };

    const addTask = async () => {
        if (!taskInput.trim()) return;

        try {
            const newTask = { text: taskInput, completed: false };
            const createdTask = await taskService.createTask(newTask);
            
            // Adicionar à lista local
            const formattedTask = {
                id: createdTask.id,
                text: createdTask.title,
                completed: createdTask.completed
            };
            
            setTasks([...tasks, formattedTask]);
            setTaskInput(''); 
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            alert('Erro ao criar tarefa.');
        }
    };

    const toggleTaskCompletion = async (index) => {
        try {
            const task = filteredTasks[index];
            const updatedTask = await taskService.toggleTask(task.id, task.completed);
            
            // Atualizar lista local
            const updatedTasks = tasks.map(t => 
                t.id === task.id 
                    ? { ...t, completed: updatedTask.completed }
                    : t
            );
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Erro ao alternar tarefa:', error);
            alert('Erro ao atualizar tarefa.');
        }
    };

    const deleteTask = async (index) => {
        try {
            const task = filteredTasks[index];
            await taskService.deleteTask(task.id);
            
            // Remover da lista local
            const updatedTasks = tasks.filter(t => t.id !== task.id);
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
            alert('Erro ao deletar tarefa.');
        }
    };

    const editTask = (index) => {
        const task = filteredTasks[index];
        setEditIndex(task.id); // Agora usamos o ID em vez do índice
        setTaskInput(task.text);
    };

    const saveEdit = async () => {
        if (!taskInput.trim()) return;

        try {
            const taskToUpdate = tasks.find(task => task.id === editIndex);
            const updatedTask = await taskService.updateTask(editIndex, {
                text: taskInput,
                completed: taskToUpdate.completed
            });
            
            // Atualizar lista local
            const updatedTasks = tasks.map(task =>
                task.id === editIndex
                    ? { ...task, text: updatedTask.title }
                    : task
            );
            
            setTasks(updatedTasks);
            setEditIndex(null);
            setTaskInput('');
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            alert('Erro ao atualizar tarefa.');
        }
    };

    const clearList = async () => {
        if (window.confirm('Tem certeza que deseja limpar toda a lista?')) {
            try {
                // Deletar todas as tarefas do backend
                const deletePromises = tasks.map(task => 
                    taskService.deleteTask(task.id)
                );
                await Promise.all(deletePromises);
                
                // Limpar lista local
                setTasks([]);
            } catch (error) {
                console.error('Erro ao limpar lista:', error);
                alert('Erro ao limpar lista.');
            }
        }
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });

    return (
        <div className="container">
            <h1>Lista de Tarefas</h1>
            
            {loading && <div className="loading">Carregando...</div>}
            
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (editIndex !== null) {
                        saveEdit();
                    } else {
                        addTask();
                    }
                }}
            >
                <input
                    type="text"
                    name="taskInput"
                    placeholder="Adicionar novo desejo..."
                    required
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    disabled={loading}
                />
                <button className='add' type="submit" disabled={loading}>
                    {editIndex !== null ? 'Salvar' : 'Adicionar'}
                </button>
            </form>

            <div className="mb-3">
                <label htmlFor="filter" className="form-label">Filtrar:</label>
                <select 
                    id="filter" 
                    className="form-select" 
                    onChange={(e) => setFilter(e.target.value)}
                    disabled={loading}
                >
                    <option className="op" value="all">Todos</option>
                    <option className='op' value="completed">Concluídos</option>
                    <option className='op' value="incomplete">Não Concluídos</option>
                </select>
            </div>

            <TaskList 
                tasks={filteredTasks}
                toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask}
                editTask={editTask}
                loading={loading}
            /> 
            
            {tasks.length > 0 && (
                <button 
                    className="btn-delete" 
                    onClick={clearList}
                    disabled={loading}
                >
                    Limpar Lista
                </button>
            )}
        </div>
    );
}

export default App;