import {
  createTask,
  getAllTasks,
  addTagToTask,
  getTaskById,
  updateTask,
  removeTagFromTask,
} from "@/services/task.service";
import { getAllTags, createTag } from "@/services/tag.service";
import { useEffect, useState } from "react";
import type { Task, Tag } from "@/interface/interfaces";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusIcon, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TaskForm, type TaskFormValues } from "@/components/task-form";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const formatDate = (dateString?: string | Date | null) => {
  if (!dateString) {
    return "N/A";
  }
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const ToDoPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | undefined>(undefined);

  const isEditMode = taskToEdit !== undefined;

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [tasksData, tagsData] = await Promise.all([
          getAllTasks(),
          getAllTags(),
        ]);
        setTasks(tasksData.filter(task => !task.eliminado));
        setAvailableTags(tagsData);
      } catch (error) {
        console.log(error);
        toast.error("Error al cargar los datos iniciales.");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  const handleTagCreate = async (title: string): Promise<Tag> => {
    try {
      const newTag = await createTag({ title });
      setAvailableTags((prev) => [...prev, newTag]);
      toast.success(`Tag "${newTag.title}" creado.`);
      return newTag;
    } catch (error) {
      console.error("Error al crear tag:", error);
      toast.error("No se pudo crear el nuevo tag.");
      throw error;
    }
  };
  const handleFormSubmit = async (formData: TaskFormValues) => {
    try {
      if (isEditMode && taskToEdit?.id) {
        const { tags: newTags, ...taskData } = formData;
        const id = taskToEdit.id;

        const taskPayload = {
          ...taskData,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
        };
        
        await updateTask(id, taskPayload);

        const oldTags = taskToEdit.tags || [];
        const tagsToAdd = newTags.filter(nt => nt.id && !oldTags.some(ot => ot.id === nt.id));
        const tagsToRemove = oldTags.filter(ot => ot.id && !newTags.some(nt => nt.id === ot.id)); 

        await Promise.all([
          ...tagsToAdd.map(tag => addTagToTask(id, tag.id!)),
          ...tagsToRemove.map(tag => removeTagFromTask(id, tag.id!)) 
        ]);

        const fullUpdatedTask = await getTaskById(id);
        setTasks(tasks.map(t => (t.id === id ? fullUpdatedTask : t)));
        handleModalToggle(false);
        toast.success("Tarea actualizada correctamente!");

      } else {
        const { tags, ...taskData } = formData;
        const taskPayload = {
          ...taskData,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
        };
        const newTask = await createTask(taskPayload);

        if (!newTask || typeof newTask.id === 'undefined') {
          toast.error("Error: La tarea se creó pero no se recibió un ID.");
          return;
        }

        for (const tag of tags) {
          if (typeof tag.id !== 'undefined') {
            await addTagToTask(newTask.id, tag.id);
          }
        }
        const fullNewTask = await getTaskById(newTask.id);
        setTasks((prevTasks) => [...prevTasks, fullNewTask]);
        handleModalToggle(false);
        toast.success("Tarea registrada correctamente!");
      }
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
      toast.error("Error al guardar la tarea.");
    }
  };

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setTaskToEdit(undefined); 
    setIsModalOpen(true);    
  };

  const handleModalToggle = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setTaskToEdit(undefined);
    }
  };

  const handleDelete = (task: Task) => {
    setTaskToDelete(task);
    setDeleteAlertOpen(true); 
  };

  const confirmDelete = async () => {
    if (!taskToDelete || typeof taskToDelete.id === 'undefined') return; 

    try {
      await updateTask(taskToDelete.id, { eliminado: true }); 
      
      setTasks(tasks.filter(t => t.id !== taskToDelete.id));
      
      toast.success(`Tarea "${taskToDelete.title}" eliminada.`);
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      toast.error("No se pudo eliminar la tarea.");
    } finally {
      setTaskToDelete(undefined);
      setDeleteAlertOpen(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold pb-4">To Do: Prueba Tecnica</h1>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarea</TableHead>
                <TableHead>Descripcion</TableHead>
                <TableHead>Cumplimiento</TableHead>
                <TableHead>Fecha V.</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    <Badge variant={task.completed ? "default" : "secondary"}>
                      {task.completed ? "Completado" : "Pendiente"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(task.dueDate)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {task.tags?.map((tag: Tag) => (
                        <Badge key={tag.id} variant="outline">
                          {tag.title}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(task)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(task)}
                          className="text-red-600 focus:text-red-600"
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Button
        variant="default"
        size="icon"
        className="rounded-full fixed bottom-6 right-6 shadow-lg"
        onClick={handleCreateClick} 
      >
        <PlusIcon />
      </Button>

      <Dialog open={isModalOpen} onOpenChange={handleModalToggle}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Tarea" : "Crear Nueva Tarea"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Edita los detalles de tu tarea. Haz clic en guardar cuando termines."
                : "Añade una nueva tarea a tu lista. Haz clic en guardar cuando termines."}
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            key={taskToEdit ? taskToEdit.id : "new-task"}
            onSubmit={handleFormSubmit}
            onClose={() => handleModalToggle(false)} 
            availableTags={availableTags}
            onTagCreate={handleTagCreate}
            initialData={taskToEdit} 
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción marcará la tarea "{taskToDelete?.title}" como eliminada. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTaskToDelete(undefined)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

