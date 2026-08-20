const DELAY_MS = 450;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS));
}

/**
 * Fábrica de "API" mockada em memória para um recurso — usada por todos os
 * módulos de domínio (Fase 7) até existir um backend real. Simula latência
 * de rede; a paginação/ordenação fica a cargo do DataTable no cliente.
 */
export function createMockResource<T extends { id: string }>(seed: T[], idPrefix: string) {
  let items = [...seed];
  let counter = seed.length;

  async function list(predicate?: (item: T) => boolean): Promise<T[]> {
    const data = predicate ? items.filter(predicate) : items;
    return delay([...data]);
  }

  async function get(id: string): Promise<T | null> {
    return delay(items.find((item) => item.id === id) ?? null);
  }

  async function create(input: Omit<T, "id">): Promise<T> {
    counter += 1;
    const id = `${idPrefix}-${String(counter).padStart(3, "0")}`;
    const created = { ...input, id } as T;
    items = [created, ...items];
    return delay(created);
  }

  async function update(id: string, input: Partial<Omit<T, "id">>): Promise<T> {
    items = items.map((item) => (item.id === id ? { ...item, ...input } : item));
    const updated = items.find((item) => item.id === id);
    if (!updated) throw new Error("Registro não encontrado");
    return delay(updated);
  }

  async function remove(id: string): Promise<void> {
    items = items.filter((item) => item.id !== id);
    return delay(undefined);
  }

  return { list, get, create, update, remove };
}
