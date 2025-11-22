import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from './TaskItem';

describe('TaskItem Component', () => {
    const mockToggleTaskCompletion = jest.fn();
    const mockDeleteTask = jest.fn();
    const mockEditTask = jest.fn();
    const task = { text: 'Testar TaskItem', completed: false };

    test('renders the task with correct text', () => {
        render(
            <TaskItem
                task={task}
                index={0}
                toggleTaskCompletion={mockToggleTaskCompletion}
                deleteTask={mockDeleteTask}
                editTask={mockEditTask}
            />
        );
        expect(screen.getByText('Testar TaskItem')).toBeInTheDocument();
    });

    test('calls toggleTaskCompletion on click "Concluir"', () => {
        render(<TaskItem task={task} index={0} toggleTaskCompletion={mockToggleTaskCompletion} deleteTask={mockDeleteTask} editTask={mockEditTask} />);
        fireEvent.click(screen.getByText('Concluir'));
        expect(mockToggleTaskCompletion).toHaveBeenCalledWith(0);
    });

    test('calls editTask on click "Editar"', () => {
        render(<TaskItem task={task} index={0} toggleTaskCompletion={mockToggleTaskCompletion} deleteTask={mockDeleteTask} editTask={mockEditTask} />);
        fireEvent.click(screen.getByText('Editar'));
        expect(mockEditTask).toHaveBeenCalledWith(0);
    });

    test('calls deleteTask on click "Excluir"', () => {
        render(<TaskItem task={task} index={0} toggleTaskCompletion={mockToggleTaskCompletion} deleteTask={mockDeleteTask} editTask={mockEditTask} />);
        fireEvent.click(screen.getByText('Excluir'));
        expect(mockDeleteTask).toHaveBeenCalledWith(0);
    });
});
