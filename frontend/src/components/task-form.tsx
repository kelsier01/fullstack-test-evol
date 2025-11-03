import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Task, Tag } from "@/interface/interfaces";
import { useFormik } from "formik";
import { taskValidationSchema } from "@/schemas/schemas";
import { Check, ChevronsUpDown, PlusCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  tags: Tag[];
}

// 1. Helper para formatear Date (o string) a 'yyyy-MM-dd' para el input
const formatDateForInput = (date?: string | Date | null): string => {
  if (!date) return "";
  const d = new Date(date);
  // Asegura que la fecha se interprete en la zona horaria local para el input
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface TaskFormProps {
  onSubmit: (formData: TaskFormValues) => Promise<void>;
  onClose: () => void;
  availableTags: Tag[];
  onTagCreate: (title: string) => Promise<Tag>;
  initialData?: Task; // 2. Acepta datos iniciales para la edición
}

const FormError = ({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) => {
  return message ? (
    <p className={`text-red-500 text-sm ${className || ""}`}>{message}</p>
  ) : null;
};

export const TaskForm = ({
  onSubmit,
  onClose,
  availableTags,
  onTagCreate,
  initialData, // 3. Recibe los datos iniciales
}: TaskFormProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const formik = useFormik({
    // 4. Llena el formulario con initialData si existe
    initialValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      dueDate: formatDateForInput(initialData?.dueDate), // Formatea para input
      completed: initialData?.completed || false,
      tags: initialData?.tags || [],
    },
    validationSchema: taskValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      await onSubmit(values);
      setSubmitting(false);
    },
    enableReinitialize: true, // 5. Permite que Formik se reinicie si 'initialData' cambia
  });
  
  // ... (El resto del componente de formulario (lógica de tags, JSX) es igual)
  const handleCreateTag = async () => {
    if (searchQuery.trim() === "") return;
    try {
      const newTag = await onTagCreate(searchQuery);
      formik.setFieldValue("tags", [...formik.values.tags, newTag]);
      setSearchQuery("");
    } catch (error) {
      console.error("Error al crear el tag", error);
    }
  };

  const handleTagSelect = (tag: Tag) => {
    const isSelected = formik.values.tags.some((t) => t.id === tag.id);
    let newTags: Tag[];
    if (isSelected) {
      newTags = formik.values.tags.filter((t) => t.id !== tag.id);
    } else {
      newTags = [...formik.values.tags, tag];
    }
    formik.setFieldValue("tags", newTags);
  };

  const filteredTags = availableTags.filter(
    (tag) =>
      !formik.values.tags.some((selected) => selected.id === tag.id) &&
      tag.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exactMatch = availableTags.some(
    (tag) => tag.title.toLowerCase() === searchQuery.toLowerCase()
  );

  return (
    <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
      {/* Título */}
      <div className="grid grid-cols-4 items-center gap-x-4 gap-y-1">
        <Label htmlFor="title" className="text-right">
          Título
        </Label>
        <Input
          id="title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="col-span-3"
        />
        <div />
        <FormError
          className="col-span-3"
          message={formik.touched.title ? formik.errors.title : ""}
        />
      </div>

      {/* Descripción */}
      <div className="grid grid-cols-4 items-center gap-x-4 gap-y-1">
        <Label htmlFor="description" className="text-right">
          Descripción
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="col-span-3"
        />
        <div />
        <FormError
          className="col-span-3"
          message={
            formik.touched.description ? formik.errors.description : ""
          }
        />
      </div>

      {/* Vencimiento */}
      <div className="grid grid-cols-4 items-center gap-x-4 gap-y-1">
        <Label htmlFor="dueDate" className="text-right">
          Vencimiento
        </Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formik.values.dueDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="col-span-3"
        />
        <div />
        <FormError
          className="col-span-3"
          message={formik.touched.dueDate ? formik.errors.dueDate : ""}
        />
      </div>

      {/* Completada */}
      <div className="grid grid-cols-4 items-center gap-x-4 gap-y-1">
        <Label htmlFor="completed" className="text-right">
          Completada
        </Label>
        <Checkbox
          id="completed"
          name="completed"
          checked={formik.values.completed}
          onCheckedChange={(checked) => {
            formik.setFieldValue("completed", checked);
          }}
          onBlur={formik.handleBlur}
          className="col-span-3 justify-self-start"
        />
        <div />
        <FormError
          className="col-span-3"
          message={
            formik.touched.completed ? formik.errors.completed : ""
          }
        />
      </div>

      {/* Tags (Combobox) */}
      <div className="grid grid-cols-4 items-start gap-x-4 gap-y-1">
        <Label className="text-right pt-2">Tags</Label>
        <div className="col-span-3">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={popoverOpen}
                className="w-full justify-between h-auto flex-wrap"
              >
                <div className="flex gap-1 flex-wrap">
                  {formik.values.tags.length === 0 && "Seleccionar tags..."}
                  {formik.values.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTagSelect(tag);
                      }}
                    >
                      {tag.title}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput
                  placeholder="Buscar o crear tag..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty asChild>
                    {searchQuery.trim().length > 0 && !exactMatch && (
                      <CommandItem
                        onSelect={handleCreateTag}
                        className="cursor-pointer"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear nuevo tag: "{searchQuery}"
                      </CommandItem>
                    )}
                  </CommandEmpty>
                  <CommandGroup heading="Tags existentes">
                    {filteredTags.map((tag) => (
                      <CommandItem
                        key={tag.id}
                        onSelect={() => {
                          handleTagSelect(tag);
                        }}
                        value={tag.title}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formik.values.tags.some((t) => t.id === tag.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {tag.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Guardando..." : "Guardar Tarea"}
        </Button>
      </div>
    </form>
  );
};
