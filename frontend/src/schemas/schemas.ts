import * as Yup from "yup";

export const taskValidationSchema = Yup.object({
  title: Yup.string().required("El título es requerido"),
  description: Yup.string().required("La descripción es requerida"),
  dueDate: Yup.date().required("La fecha es requerida"),
  completed: Yup.boolean(),
});