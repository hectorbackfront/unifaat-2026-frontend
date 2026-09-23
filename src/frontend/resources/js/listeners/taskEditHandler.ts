import tasksListRender from "../render/tasksListRender";
import { taskUpdateApi } from "../api/taskUpdateApi";
import type { TaskListItemElement } from "../types/dom";

export default async function taskEditHandler(event: Event): Promise<void> {
  const liElement = (event.target as HTMLElement).closest("li") as TaskListItemElement | null;
  if (!liElement) return;

  const { userId: idUser, taskId, page, taskName } = liElement;

  const newName = prompt("Novo nome da tarefa:", taskName)?.trim();
  if (!newName || newName === taskName) return;

  try {
    await taskUpdateApi(taskId, { name: newName });
    await tasksListRender(idUser, page);
  } catch (error) {
    alert("Erro ao editar tarefa");
    console.error(error);
  }
}
