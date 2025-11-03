import type { Task } from '@/interface/interfaces';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;

export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al cargar las tareas:', error);
    throw error;
  }
};

export const getTaskById = async (id: string | number): Promise<Task> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al cargar la tarea con id ${id}:`, error);
    throw error;
  }
};

export const createTask = async (taskData: Task): Promise<Task> => {
  try {
    const response = await axios.post(API_URL, taskData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    throw error;
  }
};

export const updateTask = async (id: string | number, updates: Partial<Task>): Promise<Task> => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la tarea con id ${id}:`, error);
    throw error;
  }
};

export const addTagToTask = async (taskId: number | string, tagId: number | string): Promise<Task> => {
  try {
    const response = await axios.post(`${API_URL}/${taskId}/tags`, { tagId });
    return response.data;
  } catch (error) {
    console.error(`Error al añadir el tag ${tagId} a la tarea ${taskId}:`, error);
    throw error;
  }
};

export const removeTagFromTask = async (taskId: number | string, tagId: number | string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${taskId}/tags/${tagId}`);
  } catch (error) {
    console.error(`Error al quitar el tag ${tagId} de la tarea ${taskId}:`, error);
    throw error;
  }
}

