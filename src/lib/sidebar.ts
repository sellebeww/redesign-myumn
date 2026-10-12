export function toggleSidebarGroup(groups: Record<string, boolean>, id: string): Record<string, boolean> {
  const root = id.split('/')[0];
  const next: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(groups)) {
    if (key.split('/')[0] === root && key !== id && !key.startsWith(id + '/')) next[key] = value;
  }
  if (!groups[id]) next[id] = true;
  return next;
}

/** Groups that must be open so the page with this id is visible in the sidebar. */
export function openGroupsFor(viewId: string, isGroup: boolean): Record<string, boolean> {
  const parts = viewId.split('/');
  const open: Record<string, boolean> = {};
  for (let i = 1; i < parts.length; i++) open[parts.slice(0, i).join('/')] = true;
  if (isGroup) open[viewId] = true;
  return open;
}
