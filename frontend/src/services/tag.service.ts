import type { Tag } from '@/interface/interfaces';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/tags`;

export const getAllTags = async (): Promise<Tag[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al cargar los tags:', error);
    throw error;
  }
};

export const getTagById = async (id: string | number): Promise<Tag> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al cargar el tag con id ${id}:`, error);
    throw error;
  }
};

export const createTag = async (tagData: Tag): Promise<Tag> => {
  try {
    const response = await axios.post(API_URL, tagData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el tag:', error);
    throw error;
  }
};

export const updateTag = async (id: string | number, updates: Tag): Promise<Tag> => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el tag con id ${id}:`, error);
    throw error;
  }
};

export const deleteTag = async (id: string | number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el tag con id ${id}:`, error);
    throw error;
  }
};
