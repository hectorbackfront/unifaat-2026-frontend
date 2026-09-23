import taskRender from "./taskRender";
import { tasksListApi } from "../api/tasksListApi";

export default async function tasksListRender(idUser: number, page = 1): Promise<void> {
  const container = document.querySelector("#tasks-container");

  if (!container) return;

  container.innerHTML = "";

  const ulElement = document.createElement("ul");
  ulElement.id = "tasks-list";
  ulElement.classList.add("list-group");

  container.append(ulElement);

  const listApi = await tasksListApi({ page });

  ulElement.innerHTML = "";

  if (listApi.data.length === 0) {
    const emptyElement = document.createElement("li");
    emptyElement.classList.add("list-group-item", "text-center", "text-muted");
    emptyElement.innerText = "Nenhuma tarefa encontrada. Crie uma nova!";
    ulElement.append(emptyElement);
    return;
  }

  listApi.data.forEach((task) => {
    const liElement = taskRender(task, idUser, listApi.page);
    ulElement.append(liElement);
  });

  const hasPrevPage = listApi.page > 1;
  const hasNextPage = listApi.page * listApi.limit < listApi.total;

  if (hasPrevPage || hasNextPage) {
    const paginationElement = document.createElement("div");
    paginationElement.classList.add("d-flex", "justify-content-between", "align-items-center", "mt-3");

    const prevButtonElement = document.createElement("button");
    prevButtonElement.classList.add("btn", "btn-outline-secondary", "btn-sm");
    prevButtonElement.innerText = "Anterior";
    prevButtonElement.disabled = !hasPrevPage;
    prevButtonElement.addEventListener("click", () => tasksListRender(idUser, listApi.page - 1));

    const pageInfoElement = document.createElement("span");
    pageInfoElement.classList.add("text-muted", "small");
    pageInfoElement.innerText = `Página ${listApi.page}`;

    const nextButtonElement = document.createElement("button");
    nextButtonElement.classList.add("btn", "btn-outline-secondary", "btn-sm");
    nextButtonElement.innerText = "Próxima";
    nextButtonElement.disabled = !hasNextPage;
    nextButtonElement.addEventListener("click", () => tasksListRender(idUser, listApi.page + 1));

    paginationElement.append(prevButtonElement, pageInfoElement, nextButtonElement);
    container.append(paginationElement);
  }
}
