import auth from "next-auth/react";
import { vi, expect, describe, it } from 'vitest'
import { prettyDOM, render, screen, within } from '@testing-library/react'
import LandingPage from '../pages'
import { Session } from "next-auth";
import {mockUnauthenticatedSession, mockAuthenticatedSession} from './utils'

describe('Landing Page', () => {
    const authenticatedButtonText = 'Continue to Map';
    const unAuthenticatedButtonText = 'Login';
    
    vi.spyOn(auth, 'useSession')
        .mockReturnValueOnce(mockUnauthenticatedSession)
        .mockReturnValueOnce(mockAuthenticatedSession)

    it('Prompts user to login when they are not authenticated', () => {
        const container = render(<LandingPage />)
        expect(
            container.queryByText(unAuthenticatedButtonText, {selector: 'button'})
        ).toBeDefined()
        
        // Authenticated Options are not there
        expect(
            container.queryByText(authenticatedButtonText, {selector: 'button'})
        ).toBeNull()
    })

    it('Shows the user a link to the map page when they are authenticated', () => {
        const container = render(<LandingPage />)

        // Authenticated options now display
        expect(
            container.queryByText(authenticatedButtonText, {selector: 'button'})
        ).toBeDefined()
    })
})