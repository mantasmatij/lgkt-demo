import { z } from 'zod';

// Zod stub for sidebar state (T006)
export const SidebarStateSchema = z.object({
  collapsed: z.boolean(),
});

export type SidebarState = z.infer<typeof SidebarStateSchema>;
