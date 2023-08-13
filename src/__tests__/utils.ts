import { Session } from "next-auth";
import { vi } from 'vitest'

export type AuthenticatedStatus = 'authenticated' | 'unauthenticated';

export const mockAuthenticatedSession = {
    data: {
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
        user: { name: "admin" },
    } as Session,
    status: 'authenticated' as 'authenticated',
    update: vi.fn(),
}

export const mockUnauthenticatedSession = {
    data: null,
    status: 'unauthenticated' as 'unauthenticated',
    update: vi.fn(),
}