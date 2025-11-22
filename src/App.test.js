import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component Integration Tests', () => {
    test('renders the App with input, buttons, and task list', () => {
        render(<App />);
        expect(screen.getByPlaceholderText('Adicionar novo desejo...')).toBeInTheDocument();
        expect(screen.getByText('Adicionar')).toBeInTheDocument();
        expect(screen.getByText('Limpar Lista')).toBeInTheDocument();
        expect(screen.getByTestId('task-list')).toBeInTheDocument();
    });

    test('adds a task to the list', () => {
        render(<App />);
        const input = screen.getByPlaceholderText('Adicionar novo desejo...');
        const addButton = screen.getByText('Adicionar');

        fireEvent.change(input, { target: { value: 'Nova Tarefa' } });
        fireEvent.click(addButton);

        expect(screen.getByText('Nova Tarefa')).toBeInTheDocument();
    });

    test('marks a task as completed', () => {
        render(<App />);
        const input = screen.getByPlaceholderText('Adicionar novo desejo...');
        const addButton = screen.getByText('Adicionar');

        fireEvent.change(input, { target: { value: 'Completar tarefa' } });
        fireEvent.click(addButton);

        const completeButton = screen.getByText('Concluir');
        fireEvent.click(completeButton);

        expect(screen.getByText('Completar tarefa')).toHaveStyle('text-decoration: line-through');
    });

    test('deletes a task', () => {
        render(<App />);
        const input = screen.getByPlaceholderText('Adicionar novo desejo...');
        const addButton = screen.getByText('Adicionar');

        fireEvent.change(input, { target: { value: 'Excluir tarefa' } });
        fireEvent.click(addButton);

        const deleteButton = screen.getByText('Excluir');
        fireEvent.click(deleteButton);

        expect(screen.queryByText('Excluir tarefa')).not.toBeInTheDocument();
    });

    test('clears all tasks', () => {
        render(<App />);
        const input = screen.getByPlaceholderText('Adicionar novo desejo...');
        const addButton = screen.getByText('Adicionar');

        fireEvent.change(input, { target: { value: 'Tarefa 1' } });
        fireEvent.click(addButton);

        fireEvent.change(input, { target: { value: 'Tarefa 2' } });
        fireEvent.click(addButton);

        const clearButton = screen.getByText('Limpar Lista');
        fireEvent.click(clearButton);

        expect(screen.queryByText('Tarefa 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Tarefa 2')).not.toBeInTheDocument();
    });
});
