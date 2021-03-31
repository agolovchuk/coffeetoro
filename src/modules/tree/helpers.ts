interface Item {
  id: string;
  parentId: string;
}

type PIDGroup = Record<string, Item[]>;

function getDip(nodeId: string, g: PIDGroup, list: string[]) {
  list.push(nodeId);
  const m = g[nodeId];
  if (Array.isArray(m)) {
    for (const e of m) {
      getDip(e.id, g, list);
    }
  }
  return;
}

export function getChildren(nodeId: string, g: PIDGroup): string[] {
  const list: string[] = [];
  getDip(nodeId, g, list);
  return list;
}

export function getParent(id: string, group: Record<string, Item>, list: string[]) {
  list.push(id);
  if (group[id]) getParent(group[id].parentId, group, list);
  return;
}
