import { Route, Routes } from "react-router";
import MainLayout from "./layout/MainLayout";
import { TaskPage } from "./views/task/TaskPage"
import { ToDoPage } from "./views/to-do/ToDoPage";
import { TagPage } from "./views/tag/TagPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<ToDoPage />} />
        <Route path="task" element={<TaskPage />} />
        <Route path="tag" element={ <TagPage />} />
      </Route>
    </Routes>
  );
}

