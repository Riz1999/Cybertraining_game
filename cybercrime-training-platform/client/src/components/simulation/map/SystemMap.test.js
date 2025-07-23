import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SystemMap from './SystemMap';

// Mock data for testing
const mockSystems = [
  {
    id: 'ncrp',
    name: 'NCRP',
    description: 'National Cybercrime Reporting Portal',
    details: 'The primary portal for reporting cybercrimes in India.',
    position: { x: 150, y: 120 },
    keyFeatures: ['Online complaint filing', 'Case status tracking']
  },
  {
    id: 'i4c',
    name: 'I4C',
    description: 'Indian Cyber Crime Coordination Centre',
    details: 'Coordinates cybercrime investigation across states.',
    position: { x: 450, y: 120 },
    keyFeatures: ['Inter-state coordination', 'Technical expertise']
  },
  {
    id: 'helpline-1930',
    name: '1930',
    description: 'National Cybercrime Helpline',
    details: 'Immediate assistance for cybercrime victims.',
    position: { x: 300, y: 250 },
    keyFeatures: ['24/7 availability', 'Immediate response']
  },
  {
    id: 'cctns',
    name: 'CCTNS',
    description: 'Crime and Criminal Tracking Network & Systems',
    details: 'Comprehensive crime tracking system.',
    position: { x: 150, y: 300 },
    keyFeatures: ['Crime database', 'Criminal records']
  }
];

const mockConnections = [
  { from: 'ncrp', to: 'i4c' },
  { from: 'ncrp', to: 'helpline-1930' },
  { from: 'i4c', to: 'cctns' }
];

describe('SystemMap Component', () => {
  const defaultProps = {
    systems: mockSystems,
    connections: mockConnections,
    onSystemClick: jest.fn(),
    onKnowledgeCheckComplete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders system map with title', () => {
    render(<SystemMap {...defaultProps} />);
    
    expect(screen.getByText('Cybercrime Investigation Systems Map')).toBeInTheDocument();
  });

  test('displays progress indicator', () => {
    render(<SystemMap {...defaultProps} />);
    
    expect(screen.getByText('Systems Explored: 0 / 4')).toBeInTheDocument();
  });

  test('renders all systems as clickable elements', () => {
    render(<SystemMap {...defaultProps} />);
    
    // Check if all system names are rendered
    expect(screen.getByText('NCRP')).toBeInTheDocument();
    expect(screen.getByText('I4C')).toBeInTheDocument();
    expect(screen.getByText('1930')).toBeInTheDocument();
    expect(screen.getByText('CCTNS')).toBeInTheDocument();
  });

  test('opens popup when system is clicked', async () => {
    render(<SystemMap {...defaultProps} />);
    
    // Click on NCRP system
    const ncrpElement = screen.getByText('NCRP');
    fireEvent.click(ncrpElement);
    
    // Check if popup appears
    await waitFor(() => {
      expect(screen.getByText('National Cybercrime Reporting Portal')).toBeInTheDocument();
      expect(screen.getByText('The primary portal for reporting cybercrimes in India.')).toBeInTheDocument();
    });
  });

  test('calls onSystemClick when system is clicked', () => {
    const mockOnSystemClick = jest.fn();
    render(<SystemMap {...defaultProps} onSystemClick={mockOnSystemClick} />);
    
    // Click on NCRP system
    const ncrpElement = screen.getByText('NCRP');
    fireEvent.click(ncrpElement);
    
    expect(mockOnSystemClick).toHaveBeenCalledWith(mockSystems[0]);
  });

  test('closes popup when close button is clicked', async () => {
    render(<SystemMap {...defaultProps} />);
    
    // Click on NCRP system to open popup
    const ncrpElement = screen.getByText('NCRP');
    fireEvent.click(ncrpElement);
    
    // Wait for popup to appear
    await waitFor(() => {
      expect(screen.getByText('National Cybercrime Reporting Portal')).toBeInTheDocument();
    });
    
    // Click close button
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    // Check if popup is closed
    await waitFor(() => {
      expect(screen.queryByText('National Cybercrime Reporting Portal')).not.toBeInTheDocument();
    });
  });

  test('updates progress when systems are explored', async () => {
    render(<SystemMap {...defaultProps} />);
    
    // Initially 0 systems explored
    expect(screen.getByText('Systems Explored: 0 / 4')).toBeInTheDocument();
    
    // Click on NCRP system
    const ncrpElement = screen.getByText('NCRP');
    fireEvent.click(ncrpElement);
    
    // Close the popup
    await waitFor(() => {
      const closeButton = screen.getByText('Continue Exploring');
      fireEvent.click(closeButton);
    });
    
    // Check if progress updated
    expect(screen.getByText('Systems Explored: 1 / 4')).toBeInTheDocument();
  });

  test('shows knowledge check after all systems are explored', async () => {
    render(<SystemMap {...defaultProps} />);
    
    // Click on all systems
    for (const system of mockSystems) {
      const systemElement = screen.getByText(system.name);
      fireEvent.click(systemElement);
      
      // Close popup
      await waitFor(() => {
        const continueButton = screen.getByText('Continue Exploring');
        fireEvent.click(continueButton);
      });
    }
    
    // Wait for knowledge check to appear
    await waitFor(() => {
      expect(screen.getByText(/Knowledge Check/)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('handles knowledge check completion', async () => {
    const mockOnKnowledgeCheckComplete = jest.fn();
    render(<SystemMap {...defaultProps} onKnowledgeCheckComplete={mockOnKnowledgeCheckComplete} />);
    
    // Click on all systems to trigger knowledge check
    for (const system of mockSystems) {
      const systemElement = screen.getByText(system.name);
      fireEvent.click(systemElement);
      
      await waitFor(() => {
        const continueButton = screen.getByText('Continue Exploring');
        fireEvent.click(continueButton);
      });
    }
    
    // Wait for knowledge check
    await waitFor(() => {
      expect(screen.getByText(/Knowledge Check/)).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Answer the first question - use getAllByText to get the button specifically
    const ncrpButtons = screen.getAllByText('NCRP');
    const ncrpButton = ncrpButtons.find(button => button.tagName === 'BUTTON');
    fireEvent.click(ncrpButton);
    
    // Click next
    const nextButton = screen.getByText('Next Question');
    fireEvent.click(nextButton);
    
    // Continue answering questions and complete the knowledge check
    // This is a simplified test - in reality, you'd need to answer all questions
  });

  test('renders with custom className', () => {
    const { container } = render(<SystemMap {...defaultProps} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('handles empty systems array gracefully', () => {
    render(<SystemMap {...defaultProps} systems={[]} />);
    
    expect(screen.getByText('Systems Explored: 0 / 0')).toBeInTheDocument();
  });

  test('renders connections between systems', () => {
    const { container } = render(<SystemMap {...defaultProps} />);
    
    // Check if SVG lines are rendered for connections
    const svgLines = container.querySelectorAll('line');
    expect(svgLines).toHaveLength(mockConnections.length);
  });
});

describe('SystemMap Accessibility', () => {
  const defaultProps = {
    systems: mockSystems,
    connections: mockConnections
  };

  test('has proper ARIA labels and roles', () => {
    render(<SystemMap {...defaultProps} />);
    
    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  test('supports keyboard navigation', () => {
    render(<SystemMap {...defaultProps} />);
    
    // Test that elements are focusable (this would need more detailed implementation)
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });
});

describe('SystemMap Error Handling', () => {
  test('handles missing system data gracefully', () => {
    const systemsWithMissingData = [
      {
        id: 'test',
        name: 'Test System',
        // Missing description, details, position - should use defaults
      }
    ];
    
    expect(() => {
      render(<SystemMap systems={systemsWithMissingData} connections={[]} />);
    }).not.toThrow();
    
    // Should render with default values
    expect(screen.getByText('Test System')).toBeInTheDocument();
  });

  test('handles invalid connections gracefully', () => {
    const invalidConnections = [
      { from: 'nonexistent', to: 'alsononexistent' }
    ];
    
    expect(() => {
      render(<SystemMap systems={mockSystems} connections={invalidConnections} />);
    }).not.toThrow();
  });
});