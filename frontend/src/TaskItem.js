import React from 'react';

function TaskItem({ task, index, toggleTaskCompletion, deleteTask, editTask, loading = false }) {
    return (
        <li className={`d-flex justify-content-between align-items-center ${task.completed ? 'completed' : ''}`}>
            <span className={task.completed ? 'text-decoration-line-through' : ''}>
                {task.text}
            </span>
            <div className='btn-tasklist'>
                <button 
                    id='btn-list' 
                    className={`btn btn-sm me-1 ${task.completed ? 'btn-secondary' : 'btn-success'}`}
                    onClick={() => toggleTaskCompletion(index)}
                    disabled={loading}
                >
                    {task.completed ? 'Desfazer' : 'Concluir'}
                </button>
                <button 
                    id='btn-list' 
                    className="btn btn-warning btn-sm me-1"
                    onClick={() => editTask(index)}
                    disabled={loading}
                >
                    Editar
                </button>
                <button 
                    id='btn-list' 
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteTask(index)}
                    disabled={loading}
                >
                    Excluir
                </button>
            </div>
        </li>
    );
}

export default TaskItem;