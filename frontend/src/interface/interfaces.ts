export interface Task {
    id?: number;
    title: string;
    description: string;
    completed?: boolean;
    tags?: Tag[];
    dueDate?: string | null;
    eliminado?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export interface Tag {
    id?: number;
    title: string;
}

export interface TaskHasTag {
    tag_id: number;
    task_id: number;
}