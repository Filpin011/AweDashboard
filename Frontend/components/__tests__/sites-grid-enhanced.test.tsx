import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SitesGrid } from '../sites-grid-enhanced'

// Mock dnd-kit components which are hard to test in JSDOM
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => <div>{children}</div>,
  closestCenter: jest.fn(),
  KeyboardSensor: jest.fn(),
  PointerSensor: jest.fn(),
  useSensor: jest.fn(),
  useSensors: jest.fn(),
  DragOverlay: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => <div>{children}</div>,
  arrayMove: jest.fn(),
  sortableKeyboardCoordinates: jest.fn(),
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
  rectSortingStrategy: jest.fn(),
}))

describe('SitesGrid Component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('renders add new site button', () => {
    render(<SitesGrid />)
    expect(screen.getByText('Add new site')).toBeInTheDocument()
  })

  test('opens add modal when clicking Add new site', async () => {
    render(<SitesGrid />)
    const button = screen.getByText('Add new site', { selector: 'p' })
    fireEvent.click(button)
    
    expect(screen.getByRole('heading', { name: 'Add new site' })).toBeInTheDocument()
  })

  test('can add a new site', async () => {
    const user = userEvent.setup()
    render(<SitesGrid />)
    
    // Open modal
    const addButton = screen.getByText('Add new site', { selector: 'p' })
    await user.click(addButton)
    
    // Fill form
    const urlInput = screen.getByPlaceholderText('https://example.com')
    const titleInput = screen.getByPlaceholderText('My favourite site')
    
    await user.type(urlInput, 'https://testsite.com')
    await user.clear(titleInput)
    await user.type(titleInput, 'Test Web Site')
    
    // Submit
    const submitBtn = screen.getByRole('button', { name: 'Add site' })
    fireEvent.submit(submitBtn.closest('form') as HTMLFormElement)
    
    // Assert new site is in document
    await waitFor(() => {
      expect(screen.getByText('Test Web Site')).toBeInTheDocument()
    })
  })

  test('can edit an existing site', async () => {
    const user = userEvent.setup()
    render(<SitesGrid />)

    // Ensure initialSite "Google" is rendered (from testing data or default)
    // Wait, initialSites from @/app/sites.json are loaded
    const editButtons = screen.getAllByRole('button', { name: 'Edit site' })
    await user.click(editButtons[0]) // Click first edit button

    const titleInput = screen.getByPlaceholderText('My favourite site')
    await user.clear(titleInput)
    await user.type(titleInput, 'Edited Site Title')

    const saveBtn = screen.getByRole('button', { name: 'Save changes' })
    fireEvent.submit(saveBtn.closest('form') as HTMLFormElement)

    await waitFor(() => {
      expect(screen.getByText('Edited Site Title')).toBeInTheDocument()
    })
  })

  test('can toggle pin on a site', async () => {
    const user = userEvent.setup()
    render(<SitesGrid />)

    const pinButtons = screen.getAllByRole('button', { name: 'Pin site' })
    await user.click(pinButtons[0])

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: 'Unpin site' }).length).toBeGreaterThan(0)
    })
  })

  test('can remove a site', async () => {
    const user = userEvent.setup()
    render(<SitesGrid />)

    // Get initial count of remove buttons
    const initialRemoveButtons = screen.getAllByRole('button', { name: 'Remove site' })
    const initialCount = initialRemoveButtons.length

    // Click the first one
    await user.click(initialRemoveButtons[0])

    await waitFor(() => {
      const newRemoveButtons = screen.queryAllByRole('button', { name: 'Remove site' })
      expect(newRemoveButtons.length).toBe(initialCount - 1)
    })
  })
})
