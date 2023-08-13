import { vi, expect, describe, it } from 'vitest'
import { render, waitFor, fireEvent } from '@testing-library/react'
import MapPage from '../pages/map'

const allFeaturesURL = "https://openmaps.gov.bc.ca/geo/pub/ows?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&typeName=pub%3AWHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_PNTS_SP&outputFormat=application%2Fjson"

describe('Map Page', () => {
    it.skip('Attempts to all data when initially loaded and displays an error message if failed', async () => {
        // Mock a rejection
        global.fetch = vi.fn(() => Promise.reject());
        const container = render(<MapPage />)
        expect(global.fetch).toHaveBeenCalledWith(allFeaturesURL)

        const errorBanner = container.getByTestId('error-banner')
        await waitFor(() => {
            expect(errorBanner.style.opacity).toBe("1")
        })
    })

    it.skip('Attempts to fetch all data when initially loaded and displays the returned locations if successful', async () => {
        // Mock a success
        global.fetch = vi.fn(() => Promise.resolve({
            json: () => Promise.resolve({
                features: [
                    {
                        properties: {
                            INCIDENT_NAME: 'test fire download',
                            FIRE_ID: 1
                        }
                    },
                ]
            })
        })) as any;
        const container = render(<MapPage />)

        expect(global.fetch).toHaveBeenCalledWith(allFeaturesURL)

        // Error banner not displayed (faded to 0) if successfuly fetched
        const errorBanner = container.getByTestId('error-banner')
        expect(errorBanner.style.opacity).toBe("0")

        // Fetch response is in the DOM
        await waitFor(() => {
            expect(container.getByText('test fire download')).toBeDefined()
        })
    })

    it.skip('Re-fetches data when new filters are applied', async () => {
        // Fail on initial load
        global.fetch = vi.fn(() => Promise.reject());
        const container = render(<MapPage />)
        const errorBanner = container.getByTestId('error-banner')
        await waitFor(() => {
            expect(errorBanner.style.opacity).toBe("1")
        })

        // Respond with success
        global.fetch = vi.fn(() => Promise.resolve({
            json: () => Promise.resolve({
                features: [
                    {
                        properties: {
                            INCIDENT_NAME: 'test fire download',
                            FIRE_ID: 1
                        }
                    },
                ]
            })
        })) as any;

        // Trigger a search
        const applyFilterButton = container.getByTestId('apply-filter-btn');
        applyFilterButton.click();
        
        await waitFor(() => {
            expect(errorBanner.style.opacity).toBe("0")
        })

        // Fetch response is in the DOM
        await waitFor(() => {
            expect(container.getByText('test fire download')).toBeDefined()
        })
    })

    it('Does not over-trigger api calls on user interaction', async () => {
        global.fetch = vi.fn(() => Promise.reject());
        const container = render(<MapPage />)

        // Trigerred on page load
        expect(global.fetch).toHaveBeenCalledOnce();

        // Fire a change event on all form elements
        const geographicDescriptionSelect = document.querySelector('#fire-geographic-description-select') as Element;
        const fireStatusSelect = document.querySelector('#fire-status-select') as Element;
        const fireCauseSelect = document.querySelector('#fire-cause-select') as Element;
        fireEvent.change(geographicDescriptionSelect, {target: { value: 'something'}});
        fireEvent.change(fireStatusSelect, {target: { value: 'something'}});
        fireEvent.change(fireCauseSelect, {target: { value: 'something'}});

        // No additional fetch requests made
        expect(global.fetch).toHaveBeenCalledOnce();

        // Submit with the apply button
        const applyFilterButton = container.getByTestId('apply-filter-btn');
        applyFilterButton.click();

        // An additional fetch request has been made.
        expect(global.fetch).toHaveBeenCalledTimes(2);
    })
})