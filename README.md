
# Skill Swap 

A beautiful, modern React component for creating skill swap exchanges. This form allows users to offer their skills in exchange for learning new ones from other community members.

## Features

- **Modern Design**: Contemporary UI with gradient backgrounds, smooth animations, and hover effects
- **Responsive Layout**: Works seamlessly across desktop, tablet, and mobile devices
- **Intuitive UX**: Color-coded sections and clear visual hierarchy for easy navigation
- **Interactive Elements**: Smooth transitions, micro-animations, and visual feedback
- **Accessible**: Proper focus states, semantic HTML, and keyboard navigation support

## Component Structure

### Main Sections

1. **Provider Information**: User identification and contact details
2. **Skill Offered**: What the user can teach (skill, description, expertise level)
3. **Skill Requested**: What the user wants to learn (skill, description, desired level)
4. **Session Details**: Meeting scheduling and logistics
5. **Personal Message**: Introduction and additional context

### Form Fields

- **Provider ID**: Unique identifier for the user
- **Skill Information**: Name, description, and proficiency level
- **Scheduling**: Date, time, and duration
- **Meeting Type**: Online, in-person, or hybrid options
- **Meeting Details**: Zoom links, addresses, or special instructions
- **Personal Message**: Free-form text for introduction

## Installation

```bash
npm install react lucide-react
```

## Usage

```jsx
import SwapForm from './SwapForm';

function App() {
  return (
    <div className="App">
      <SwapForm />
    </div>
  );
}
```

## Dependencies

- **React**: ^18.0.0
- **lucide-react**: ^0.263.1 (for icons)
- **Tailwind CSS**: For styling

## Styling

The component uses Tailwind CSS for styling with:
- Custom gradients and color schemes
- Responsive breakpoints
- Hover and focus states
- Smooth transitions and animations

### Color Scheme

- **Primary**: Blue to purple gradient
- **Skill Offered**: Green accent
- **Skill Requested**: Blue accent
- **Session Details**: Purple accent
- **Background**: Soft gradient from blue to purple

## Customization

### Modifying Colors

Update the gradient classes in the component:

```jsx
// Background gradient
className="bg-gradient-to-br from-blue-50 via-white to-purple-50"

// Button gradient
className="bg-gradient-to-r from-blue-500 to-purple-600"

// Section backgrounds
className="bg-gradient-to-r from-green-50 to-emerald-50"
```

### Adding New Fields

To add new form fields, follow this pattern:

```jsx
<InputField
  icon={YourIcon}
  label="Field Label"
  placeholder="Enter value..."
  value={yourState}
  onChange={(e) => setYourState(e.target.value)}
  required
/>
```

### Custom Icons

Icons are provided by Lucide React. To use different icons:

```jsx
import { YourIcon } from 'lucide-react';
```

## Form Submission

The form currently logs data to console. To integrate with your backend:

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/swaps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        providerId,
        skillOffered,
        skillRequested,
        message,
        scheduledDate,
        duration,
        meetingType,
        meetingDetails,
      }),
    });
    
    if (response.ok) {
      // Handle success
      console.log('Swap created successfully!');
    }
  } catch (error) {
    console.error('Error creating swap:', error);
  }
};
```

## Data Structure

The form collects data in this structure:

```javascript
{
  providerId: string,
  skillOffered: {
    skill: string,
    description: string,
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  },
  skillRequested: {
    skill: string,
    description: string,
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  },
  message: string,
  scheduledDate: string, // ISO datetime
  duration: number, // minutes
  meetingType: 'online' | 'in-person' | 'hybrid',
  meetingDetails: string
}
```

## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- Styling powered by [Tailwind CSS](https://tailwindcss.com/)
- Built with [React](https://reactjs.org/)

## Screenshots

The form features:
- Clean, modern interface with gradient backgrounds
- Color-coded sections for different form areas
- Smooth animations and hover effects
- Professional typography and spacing
- Mobile-responsive design

## Support

For support, please open an issue in the repository or contact the development team.

---

*Built with ❤️ for the skill-sharing community*
