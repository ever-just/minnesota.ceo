import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EnhancedEmailField from '@/components/EnhancedEmailField'

describe('EnhancedEmailField', () => {
  it('renders the email input and submit button', () => {
    const mockSubmit = jest.fn()
    render(<EnhancedEmailField onSubmit={mockSubmit} />)
    
    const input = screen.getByPlaceholderText(/your@email.com/i)
    const button = screen.getByRole('button')
    
    expect(input).toBeInTheDocument()
    expect(button).toBeInTheDocument()
  })

  it('shows error for invalid email', async () => {
    const mockSubmit = jest.fn()
    render(<EnhancedEmailField onSubmit={mockSubmit} />)
    
    const input = screen.getByPlaceholderText(/your@email.com/i)
    const button = screen.getByRole('button')
    
    fireEvent.change(input, { target: { value: 'invalid-email' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/valid email address/i)).toBeInTheDocument()
    })
    
    expect(mockSubmit).not.toHaveBeenCalled()
  })

  it('submits valid email successfully', async () => {
    const mockSubmit = jest.fn().mockResolvedValue(undefined)
    render(<EnhancedEmailField onSubmit={mockSubmit} successMessage="Success!" />)
    
    const input = screen.getByPlaceholderText(/your@email.com/i)
    const button = screen.getByRole('button')
    
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith('test@example.com')
    })
  })

  it('disables button while submitting', async () => {
    const mockSubmit = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
    render(<EnhancedEmailField onSubmit={mockSubmit} />)
    
    const input = screen.getByPlaceholderText(/your@email.com/i)
    const button = screen.getByRole('button')
    
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)
    
    expect(button).toBeDisabled()
  })
})

